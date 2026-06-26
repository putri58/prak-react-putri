-- ============================================================
-- E-COMMERCE & MEMBERSHIP SYSTEM — SAFE MIGRATION
-- ============================================================

-- 1. CREATE ENUM TYPES (Safe: IF NOT EXISTS)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'member');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE member_tier AS ENUM ('bronze', 'silver', 'gold');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. CREATE TABLES (Safe: IF NOT EXISTS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role DEFAULT 'member'::user_role NOT NULL,
    tier member_tier DEFAULT 'bronze'::member_tier NOT NULL,
    points INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    total_price NUMERIC NOT NULL DEFAULT 0,
    status order_status DEFAULT 'pending'::order_status NOT NULL,
    points_gained INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase NUMERIC NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY (Safe: sudah di-enable atau belum)
-- ============================================================
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;

-- 4. DROP EXISTING POLICIES (to avoid duplicates)
-- ============================================================
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read own profile or admin all" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile or admin all" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read products" ON public.products;
DROP POLICY IF EXISTS "Allow admin to modify products" ON public.products;
DROP POLICY IF EXISTS "Allow users to handle own orders or admin all" ON public.orders;
DROP POLICY IF EXISTS "Allow users to handle own order items or admin all" ON public.order_items;

-- 5. HELPER FUNCTION (bypasses RLS to prevent infinite recursion)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 6. RLS POLICIES
-- ============================================================
CREATE POLICY "Allow users to insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to read own profile or admin all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow users to update own profile or admin all"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Allow authenticated users to read products"
  ON public.products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin to modify products"
  ON public.products FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Allow users to handle own orders or admin all"
  ON public.orders FOR ALL
  USING (customer_id = auth.uid() OR public.is_admin())
  WITH CHECK (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Allow users to handle own order items or admin all"
  ON public.order_items FOR ALL
  USING ((SELECT customer_id FROM public.orders WHERE id = order_id) = auth.uid()
         OR public.is_admin())
  WITH CHECK ((SELECT customer_id FROM public.orders WHERE id = order_id) = auth.uid()
              OR public.is_admin());

-- 7. TRIGGER FUNCTIONS (Drop first, then re-create)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, tier, points)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Member'),
    new.email,
    'member',
    'bronze',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
DROP TRIGGER IF EXISTS on_order_status_completed ON public.orders;
DROP FUNCTION IF EXISTS public.calculate_points_and_tier();

CREATE OR REPLACE FUNCTION public.calculate_points_and_tier()
RETURNS TRIGGER AS $$
DECLARE
    calculated_points INT;
    total_user_points INT;
    new_tier member_tier;
BEGIN
    IF NEW.status = 'completed' AND (OLD.status != 'completed' OR OLD.status IS NULL) THEN
        calculated_points := FLOOR(NEW.total_price / 10000);
        NEW.points_gained := calculated_points;

        UPDATE public.profiles
        SET points = points + calculated_points
        WHERE id = NEW.customer_id
        RETURNING points INTO total_user_points;

        IF total_user_points > 5000 THEN new_tier := 'gold';
        ELSIF total_user_points > 1000 THEN new_tier := 'silver';
        ELSE new_tier := 'bronze';
        END IF;

        UPDATE public.profiles SET tier = new_tier WHERE id = NEW.customer_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_order_status_completed
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.calculate_points_and_tier();

-- 8. SEED DATA — Products (only if table is empty)
-- ============================================================
INSERT INTO public.products (name, description, price, stock)
SELECT * FROM (VALUES
  ('Nasi Goreng Instan', 'Nasi goreng instan praktis dan lezat', 15000, 120),
  ('Mie Kari Pedas', 'Mie instan dengan rasa kari pedas', 12000, 90),
  ('Teh Melati Botol', 'Teh melati dalam kemasan botol', 8000, 200),
  ('Kopi Susu Premium', 'Kopi susu dengan rasa premium', 18000, 75),
  ('Roti Coklat', 'Roti isi coklat yang lembut', 10000, 60),
  ('Keripik Kentang', 'Keripik kentang renyah', 14000, 130),
  ('Sabun Cair Lemon', 'Sabun cair dengan aroma lemon segar', 25000, 55),
  ('Shampoo Herbal', 'Shampoo dengan bahan herbal alami', 32000, 40),
  ('Pasta Gigi Fresh', 'Pasta gigi dengan rasa fresh', 17000, 95),
  ('Air Mineral 600ml', 'Air minum dalam kemasan 600ml', 5000, 300),
  ('Biskuit Keju', 'Biskuit rasa keju yang gurih', 11000, 88),
  ('Susu UHT Coklat', 'Susu UHT rasa coklat', 9000, 150),
  ('Minyak Goreng 1L', 'Minyak goreng kelapa sawit 1 liter', 22000, 70),
  ('Gula Pasir 1Kg', 'Gula pasir putih 1 kilogram', 16000, 100),
  ('Beras Premium 5Kg', 'Beras kualitas premium 5 kilogram', 78000, 35)
) AS v(name, description, price, stock)
WHERE NOT EXISTS (SELECT 1 FROM public.products LIMIT 1);
