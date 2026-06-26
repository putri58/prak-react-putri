import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function ProductDetail() {
  const { role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchError) throw fetchError;
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Redirect members to shop page
  useEffect(() => {
    if (!loading && role === "member") {
      navigate("/shop");
    }
  }, [role, loading]);

  if (loading || role === "member") {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  if (!product) return <div className="p-4">Product not found.</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
          ← Back
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

      {product.description && (
        <p className="text-gray-600 mb-4">{product.description}</p>
      )}

      <div className="space-y-2 border-t pt-4">
        <p className="text-gray-600">
          <span className="font-medium">Price:</span> Rp{" "}
          {parseFloat(product.price).toLocaleString("id-ID")}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Stock:</span>{" "}
          <span className={`px-2 py-1 rounded text-white text-xs inline-block ${product.stock > 50 ? "bg-green-500" : "bg-red-500"}`}>
            {product.stock}
          </span>
        </p>
      </div>
    </div>
  );
}