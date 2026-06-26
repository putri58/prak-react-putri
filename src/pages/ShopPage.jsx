import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash, FaTag, FaCoins, FaStar, FaCheckCircle } from "react-icons/fa";

const TIER_DISCOUNT = {
  bronze: 0,
  silver: 5,
  gold: 10,
};

const TIER_POINT_MULTIPLIER = {
  bronze: 1,
  silver: 1.5,
  gold: 2,
};

export default function ShopPage() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const tier = profile?.tier || "bronze";
  const discount = TIER_DISCOUNT[tier] || 0;
  const pointMultiplier = TIER_POINT_MULTIPLIER[tier] || 1;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setFetchError("");
      const { data, error: fetchErr } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (fetchErr) throw fetchErr;
      setProducts(data || []);
    } catch (err) {
      setFetchError("Gagal memuat produk: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId]?.quantity <= 1) {
        delete newCart[productId];
      } else {
        newCart[productId] = {
          ...newCart[productId],
          quantity: newCart[productId].quantity - 1,
        };
      }
      return newCart;
    });
  };

  const deleteFromCart = (productId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  const total = subtotal - discountAmount;
  const estimatedPoints = Math.floor(total / 10000) * pointMultiplier;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setOrdering(true);
    setError("");
    setSuccess("");

    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          total_price: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItemsData = orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      // Reduce stock for each item
      for (const item of cartItems) {
        await supabase
          .from("products")
          .update({ stock: item.stock - item.quantity })
          .eq("id", item.id);
      }

      // Refresh products to show updated stock
      fetchProducts();
      setSuccess(`Pesanan berhasil! Anda mendapat ${estimatedPoints} poin setelah pesanan selesai.`);
      setCart({});
      setShowCart(false);
    } catch (err) {
      setError("Gagal memproses pesanan: " + err.message);
    } finally {
      setOrdering(false);
    }
  };

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const getTierColor = () => {
    if (tier === "gold") return "from-yellow-400 to-yellow-600";
    if (tier === "silver") return "from-gray-300 to-gray-500";
    return "from-yellow-700 to-yellow-900";
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🛒 Belanja</h1>
          <p className="text-gray-400 mt-1">Dapatkan poin & nikmati diskon tier!</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Tier Badge */}
          <div className={`bg-gradient-to-r ${getTierColor()} text-white px-4 py-2 rounded-xl shadow-md`}>
            <p className="text-xs opacity-80">Tier {tier.toUpperCase()}</p>
            <p className="text-sm font-bold">{discount}% OFF</p>
          </div>
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <FaShoppingCart className="text-xl text-gray-600" />
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tier Benefits Banner */}
      {tier !== "bronze" && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl mb-6 shadow-lg flex items-center gap-3">
          <FaStar className="text-2xl" />
          <div>
            <p className="font-bold">
              {tier === "gold" ? "Gold Member — Diskon 10% + Poin 2x!" : "Silver Member — Diskon 5% + Poin 1.5x!"}
            </p>
            <p className="text-sm opacity-90">Nikmati keuntungan eksklusif tier Anda</p>
          </div>
        </div>
      )}

      {fetchError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-4 text-sm">
          ⚠️ {fetchError}
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cari produk..."
        className="w-full p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
      />

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <FaCheckCircle /> {success}
        </div>
      )}

      {/* Cart Panel */}
      {showCart && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaShoppingCart className="text-green-500" /> Keranjang ({totalCartItems})
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center py-4">Keranjang kosong</p>
          ) : (
            <>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200">
                        <FaPlus className="text-xs text-green-600" />
                      </button>
                      <button onClick={() => deleteFromCart(item.id)} className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 ml-1">
                        <FaTrash className="text-xs text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 flex items-center gap-1">
                      <FaTag /> Diskon {tier} ({discount}%)
                    </span>
                    <span className="text-green-600">-Rp {discountAmount.toLocaleString("id-ID")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-600 flex items-center gap-1">
                    <FaCoins /> Estimasi Poin ({pointMultiplier}x)
                  </span>
                  <span className="text-yellow-600">{estimatedPoints} pts</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span className="text-green-600">Rp {total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={ordering}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
              >
                {ordering ? "Memproses..." : `Checkout — Rp ${total.toLocaleString("id-ID")}`}
              </button>
            </>
          )}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const inCart = cart[product.id];
            const discountedPrice = product.price - Math.round(product.price * (discount / 100));
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                {/* Product Image Placeholder */}
                <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                  <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                    {product.name.charAt(0)}
                  </div>
                  {inCart && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      {inCart.quantity} in cart
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {discount > 0 ? (
                        <>
                          <span className="text-lg font-bold text-green-600">
                            Rp {discountedPrice.toLocaleString("id-ID")}
                          </span>
                          <span className="text-xs text-gray-400 line-through ml-2">
                            Rp {product.price.toLocaleString("id-ID")}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full bg-gray-100 hover:bg-green-500 hover:text-white text-gray-600 font-semibold py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPlus className="text-xs" />
                    {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-400 py-12">Produk tidak ditemukan.</p>
      )}
    </div>
  );
}
