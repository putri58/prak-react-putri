import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

export default function Products() {
  const { role } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const isAdmin = role === "admin";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      setError("Gagal memuat produk: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stock: "" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEditForm = (product) => {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      };

      if (editingProduct) {
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert([productData]);

        if (insertError) throw insertError;
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError("Gagal menyimpan produk: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;
      fetchProducts();
    } catch (err) {
      setError("Gagal menghapus produk: " + err.message);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Product List">
        {isAdmin && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add New Product
          </button>
        )}
      </PageHeader>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-4 rounded shadow mt-4">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada produk.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-2 px-2 font-semibold text-sm">No</th>
                  <th className="py-2 px-2 font-semibold text-sm">Name</th>
                  <th className="py-2 px-2 font-semibold text-sm">Description</th>
                  <th className="py-2 px-2 font-semibold text-sm">Price</th>
                  <th className="py-2 px-2 font-semibold text-sm">Stock</th>
                  {isAdmin && <th className="py-2 px-2 font-semibold text-sm">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">{index + 1}</td>
                    <td className="py-3 px-2 text-sm font-medium">
                      <Link to={`/products/${item.id}`} className="text-emerald-500 hover:text-emerald-600">
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-500 max-w-xs truncate">
                      {item.description || "-"}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      Rp {parseFloat(item.price).toLocaleString("id-ID")}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <span className={`px-2 py-1 rounded text-white text-xs inline-block ${item.stock > 50 ? "bg-green-500" : "bg-red-500"}`}>
                        {item.stock}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-2 text-sm">
                        <div className="flex gap-2">
                          <button onClick={() => openEditForm(item)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600">Edit</button>
                          <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="font-bold mb-4 text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="border p-2 w-full rounded" />
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="2" className="border p-2 w-full rounded" />
              <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required className="border p-2 w-full rounded" />
              <input name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" type="number" required className="border p-2 w-full rounded" />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex-1">
                  {editingProduct ? "Update" : "Submit"}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}