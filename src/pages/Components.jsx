import Button from "../components/Button"; 
import Badge from "../components/Badge"; 
import Avatar from "../components/Avatar"; 
import Container from "../components/Container"; 
import Footer from "../components/Footer"; 
import Card from "../components/Card"; 
import ProductCard from "../components/ProductCard"; 
import Table from "../components/Table"; 
import PageHeader from "../components/PageHeader"; 

// Import komponen-komponen baru
import InputField from "../components/InputField";
import Alert from "../components/Alert";
import HeroSection from "../components/HeroSection";

const tableHeaders = ["No", "Nama Produk", "Kategori", "Harga", "Aksi"];
const tableProducts = [
  { id: 1, name: "Laptop Asus", category: "Elektronik", price: "Rp 8.000.000" },
  { id: 2, name: "Sepatu Sport", category: "Fashion", price: "Rp 450.000" },
  { id: 3, name: "Jam Tangan", category: "Aksesoris", price: "Rp 799.000" }
];

export default function Products() {
  return (



    <div id="dashboard-container">
      <PageHeader title="Components" subtitle="Dashboard / Components" />

      <div style={{ marginTop: "20px" }}>
        
        <h3>1. Basic Component: Button</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <Button type="success">Simpan</Button>
          <Button type="danger">Hapus</Button>
          <Button type="secondary">Edit</Button>
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>2. Basic Component: Badge</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <Badge type="success">Aktif</Badge>
          <Badge type="warning">Pending</Badge>
          <Badge type="danger">Ditolak</Badge>
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>3. Basic Component: Avatar</h3>
        <div style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "30px" }}>
          <Avatar name="Budi" />
          <Avatar name="Siti" />
          <Avatar name="Putri" />
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>4. Form Component (InputField)</h3>
        <p style={{ marginBottom: "15px", color: "gray" }}>Digunakan untuk menerima input user</p>
        <div style={{ maxWidth: "400px", marginBottom: "30px" }}>
          <InputField label="Nama Lengkap" placeholder="Masukkan nama Anda..." />
          <InputField label="Email" type="email" placeholder="contoh@email.com" />
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>5. Feedback Component (Alert)</h3>
        <p style={{ marginBottom: "15px", color: "gray" }}>Respon aksi sukses atau gagal</p>
        <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
          <Alert type="success">Data berhasil disimpan ke database!</Alert>
          <Alert type="danger">Gagal mengunggah file. Silakan coba lagi.</Alert>
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>6. Section Component (HeroSection)</h3>
        <p style={{ marginBottom: "15px", color: "gray" }}>Satu bagian besar halaman utama</p>
        <div style={{ maxWidth: "800px", marginBottom: "30px" }}>
          <HeroSection 
            title="Selamat Datang di Dashboard Sedap" 
            subtitle="Kelola seluruh produk, pesanan pelanggan, dan laporan tokomu di sini dengan mudah." 
          />
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>7. Layout/Data Component: Container & Card</h3>
        <div style={{ maxWidth: "600px", marginBottom: "30px" }}>
          <Container className="bg-gray-100 rounded-xl border border-gray-200">
            <Card>
              <h2 className="text-xl font-bold mb-2">Judul di Dalam Card</h2>
              <p className="text-gray-600">Ini isi card yang dibungkus Container.</p>
            </Card>
          </Container>
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>8. ProductCard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-30">
          <ProductCard
            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
            title="Sepatu Sport"
            category="Fashion"
            price="Rp 450.000"
            description="Sepatu sport modern dengan desain nyaman."
          />
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>9. Table</h3>
        <div className="max-w-4xl mb-30">
          <Table headers={tableHeaders}>
            {tableProducts.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="border px-4 py-3">{index + 1}</td>
                <td className="border px-4 py-3 font-medium">{product.name}</td>
                <td className="border px-4 py-3">{product.category}</td>
                <td className="border px-4 py-3">{product.price}</td>
                <td className="border px-4 py-3">
                  <button className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded">Detail</button>
                </td>
              </tr>
            ))}
          </Table>
        </div>

        <hr style={{ borderColor: "#e5e7eb", marginBottom: "30px" }} />

        <h3>10. Footer</h3>
        <Footer />

      </div>
    </div>
  );
}