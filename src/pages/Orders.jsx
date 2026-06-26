import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import PageHeader from "../components/PageHeader";

export default function Orders() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isAdmin = role === "admin";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      let query = supabase
        .from("orders")
        .select("*, profiles:customer_id(full_name, email)");

      if (!isAdmin) {
        query = query.eq("customer_id", user.id);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error: fetchError } = await query.order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err) {
      setError("Gagal memuat pesanan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, statusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (updateError) throw updateError;
      fetchOrders();
    } catch (err) {
      setError("Gagal memperbarui status: " + err.message);
    }
  };

  const getStatusBadge = (status) => {
    const styles = { pending: "bg-yellow-500", completed: "bg-green-500", cancelled: "bg-red-500" };
    return styles[status] || "bg-gray-500";
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Order List" breadcrumb={["Dashboard", "Orders"]}>
        <div className="flex gap-2">
          {["all", "pending", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-sm transition ${statusFilter === s ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </PageHeader>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      <div className="bg-white p-4 rounded shadow mt-4">
        <p className="mb-4 text-gray-600">{isAdmin ? "All Orders" : "My Orders"} ({orders.length})</p>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada pesanan.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-2 px-2 font-semibold text-sm">No</th>
                  {isAdmin && <th className="py-2 px-2 font-semibold text-sm">Customer</th>}
                  <th className="py-2 px-2 font-semibold text-sm">Total</th>
                  <th className="py-2 px-2 font-semibold text-sm">Status</th>
                  <th className="py-2 px-2 font-semibold text-sm">Points</th>
                  <th className="py-2 px-2 font-semibold text-sm">Date</th>
                  {isAdmin && <th className="py-2 px-2 font-semibold text-sm">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {orders.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">{index + 1}</td>
                    {isAdmin && (
                      <td className="py-3 px-2 text-sm font-medium">{item.profiles?.full_name || "Unknown"}</td>
                    )}
                    <td className="py-3 px-2 text-sm">Rp {parseFloat(item.total_price).toLocaleString("id-ID")}</td>
                    <td className="py-3 px-2 text-sm">
                      <span className={`px-2 py-1 rounded text-white text-xs inline-block ${getStatusBadge(item.status)}`}>{item.status}</span>
                    </td>
                    <td className="py-3 px-2 text-sm">{item.points_gained || 0}</td>
                    <td className="py-3 px-2 text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString("id-ID")}</td>
                    {isAdmin && item.status === "pending" && (
                      <td className="py-3 px-2 text-sm">
                        <div className="flex gap-1">
                          <button onClick={() => updateOrderStatus(item.id, "completed")} className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">Complete</button>
                          <button onClick={() => updateOrderStatus(item.id, "cancelled")} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Cancel</button>
                        </div>
                      </td>
                    )}
                    {isAdmin && item.status !== "pending" && (
                      <td className="py-3 px-2 text-sm text-gray-400 text-xs">{item.status === "completed" ? "Done" : "Cancelled"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}