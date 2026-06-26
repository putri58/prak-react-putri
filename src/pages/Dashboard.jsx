import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign, FaUsers, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { LuClipboardList, LuPackage } from "react-icons/lu";
import OrdersChart from "../components/OrdersChart";
import CustomerFeed from "../components/CustomerFeed";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0, completedOrders: 0, cancelledOrders: 0, totalRevenue: 0,
    totalProducts: 0, totalCustomers: 0, pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true); setError("");
      const { data: orders } = await supabase.from("orders").select("*");
      const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true });
      const { count: customersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "member");

      if (orders) {
        const total = orders.length;
        const completed = orders.filter((o) => o.status === "completed").length;
        const cancelled = orders.filter((o) => o.status === "cancelled").length;
        const revenue = orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
        setStats({ totalOrders: total, completedOrders: completed, cancelledOrders: cancelled, totalRevenue: revenue, totalProducts: productsCount || 0, totalCustomers: customersCount || 0, pendingOrders: orders.filter((o) => o.status === "pending").length });

        const recent = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        const customerIds = [...new Set(recent.map((o) => o.customer_id))];
        const { data: customers } = await supabase.from("profiles").select("id, full_name").in("id", customerIds);
        const customerMap = {}; customers?.forEach((c) => { customerMap[c.id] = c.full_name; });
        setRecentOrders(recent.map((o) => ({ ...o, customer_name: customerMap[o.customer_id] || "Unknown" })));
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const getStatusBadge = (status) => {
    const styles = { pending: "bg-yellow-500", completed: "bg-green-500", cancelled: "bg-red-500" };
    return styles[status] || "bg-gray-500";
  };

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: FaShoppingCart, bg: "bg-emerald-500", change: "+12%", up: true },
    { label: "Completed", value: stats.completedOrders, icon: FaTruck, bg: "bg-blue-500", change: "+8%", up: true },
    { label: "Cancelled", value: stats.cancelledOrders, icon: FaBan, bg: "bg-red-500", change: "-3%", up: false },
    { label: "Revenue", value: `Rp ${(stats.totalRevenue / 1000).toFixed(1)}K`, icon: FaDollarSign, bg: "bg-orange-500", change: "+15%", up: true },
    { label: "Products", value: stats.totalProducts, icon: LuPackage, bg: "bg-purple-500", change: "—", up: true },
    { label: "Members", value: stats.totalCustomers, icon: FaUsers, bg: "bg-teal-500", change: "+5%", up: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your store performance</p>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl mb-6 text-sm">
          ⚠️ {error} — Data tidak dapat dimuat.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} rounded-xl p-3 text-white`}><card.icon className="text-xl" /></div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${card.up ? "text-green-500" : "text-red-500"}`}>
                {card.up ? <FaArrowUp /> : <FaArrowDown />} {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><OrdersChart /></div>
        <div><CustomerFeed /></div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><LuClipboardList className="text-green-500" /> Recent Orders</h3>
          <a href="/orders" className="text-sm text-green-500 hover:text-green-600 font-semibold">View All →</a>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Customer</th>
                  <th className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Total</th>
                  <th className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Status</th>
                  <th className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Points</th>
                  <th className="py-3 px-2 text-xs font-semibold text-gray-400 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm font-medium">{order.customer_name}</td>
                    <td className="py-3 px-2 text-sm">Rp {parseFloat(order.total_price).toLocaleString("id-ID")}</td>
                    <td className="py-3 px-2 text-sm">
                      <span className={`px-2 py-1 rounded text-white text-xs inline-block ${getStatusBadge(order.status)}`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-2 text-sm">{order.points_gained || 0}</td>
                    <td className="py-3 px-2 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</td>
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