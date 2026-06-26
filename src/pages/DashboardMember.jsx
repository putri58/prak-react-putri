import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { FaCoins, FaShoppingBag, FaStar, FaTag, FaChartLine, FaGift, FaRocket, FaCrown } from "react-icons/fa";

const TIER_INFO = {
  bronze: { 
    color: "from-yellow-700 to-yellow-900", 
    badge: "bg-yellow-600", 
    emoji: "🥉", 
    label: "Bronze", 
    next: "Silver", 
    nextPts: 1001,
    discount: 0,
    multiplier: 1,
    icon: FaRocket,
  },
  silver: { 
    color: "from-gray-300 to-gray-500", 
    badge: "bg-gray-500", 
    emoji: "🥈", 
    label: "Silver", 
    next: "Gold", 
    nextPts: 5001,
    discount: 5,
    multiplier: 1.5,
    icon: FaStar,
  },
  gold: { 
    color: "from-yellow-400 to-yellow-600", 
    badge: "bg-yellow-500", 
    emoji: "🥇", 
    label: "Gold", 
    next: null, 
    nextPts: null,
    discount: 10,
    multiplier: 2,
    icon: FaCrown,
  },
};

export default function DashboardMember() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, totalPoints: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tier = profile?.tier || "bronze";
  const tierInfo = TIER_INFO[tier] || TIER_INFO.bronze;
  const points = profile?.points || 0;

  const progressPercent = tierInfo.nextPts 
    ? Math.min(100, Math.round((points / tierInfo.nextPts) * 100)) 
    : 100;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        
        const { data: orders } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        setRecentOrders(orders || []);

        const totalOrders = orders?.length || 0;
        const totalSpent = orders?.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0) || 0;
        setStats({ totalOrders, totalSpent, totalPoints: points });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, points]);

  const getStatusBadge = (status) => {
    const styles = { pending: "bg-yellow-500", completed: "bg-green-500", cancelled: "bg-red-500" };
    return styles[status] || "bg-gray-500";
  };

  const TierIcon = tierInfo.icon;

  return (
    <div className="p-4 space-y-6">
      {/* Welcome & Tier Card */}
      <div className="relative overflow-hidden">
        <div className={`bg-gradient-to-r ${tierInfo.color} rounded-3xl p-6 text-white shadow-xl relative z-10`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10"></div>
          
          <div className="flex items-start justify-between relative z-20">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TierIcon className="text-2xl" />
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${tierInfo.badge}`}>
                  {tierInfo.label} MEMBER
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {profile?.full_name?.split(" ")[0] || "Member"}! 👋
              </h1>
              <p className="text-white/80 text-sm">{profile?.email || user?.email}</p>
            </div>
            <div className="text-right">
              <div className="text-5xl mb-2">{tierInfo.emoji}</div>
            </div>
          </div>
        </div>

        {/* Points & Benefits Card Overlapping */}
        <div className="grid grid-cols-3 gap-3 -mt-4 px-4 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <FaCoins className="text-yellow-500 text-xl mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{points}</p>
            <p className="text-xs text-gray-400">Points</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <FaTag className="text-green-500 text-xl mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{tierInfo.discount}%</p>
            <p className="text-xs text-gray-400">Discount</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <FaChartLine className="text-blue-500 text-xl mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{tierInfo.multiplier}x</p>
            <p className="text-xs text-gray-400">Points</p>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">Tier Progress</h3>
          {tierInfo.next ? (
            <span className="text-sm text-gray-400">{points.toLocaleString()} / {tierInfo.nextPts.toLocaleString()} pts</span>
          ) : (
            <span className="text-sm text-yellow-500 font-bold">🏆 Max Tier!</span>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${tier === "gold" ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : "bg-gradient-to-r from-green-400 to-emerald-500"}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        {tierInfo.next && (
          <p className="text-xs text-gray-400 mt-2">
            {tierInfo.nextPts - points > 0 
              ? `${(tierInfo.nextPts - points).toLocaleString()} poin lagi untuk naik ke ${tierInfo.next}!`
              : "Selamat! Anda naik tier!"}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 shadow-sm">
          <FaShoppingBag className="text-blue-500 text-xl mb-2" />
          <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
          <p className="text-xs text-gray-500">Total Orders</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 shadow-sm">
          <FaGift className="text-green-500 text-xl mb-2" />
          <p className="text-2xl font-bold text-gray-800">Rp {stats.totalSpent.toLocaleString("id-ID")}</p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartLine className="text-green-500" /> Recent Orders
        </h3>

        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <FaShoppingBag className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No orders yet</p>
            <a href="/shop" className="inline-block mt-3 bg-green-500 text-white px-6 py-2 rounded-xl text-sm hover:bg-green-600 transition">
              Start Shopping →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    #{order.id?.slice(0, 8)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    Rp {parseFloat(order.total_price).toLocaleString("id-ID")}
                  </p>
                  <span className={`px-2 py-0.5 rounded text-white text-xs inline-block ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            <a href="/orders" className="block text-center text-sm text-green-500 hover:text-green-600 font-semibold pt-2">
              View All Orders →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
