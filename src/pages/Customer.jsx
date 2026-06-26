import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import PageHeader from "../components/PageHeader";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setCustomers(data || []);
    } catch (err) {
      setError("Gagal memuat data customer: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getTierBadge = (tier) => {
    const colors = { bronze: "bg-yellow-600", silver: "bg-gray-500", gold: "bg-green-500" };
    return colors[tier] || "bg-gray-400";
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Customer List" />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-4 rounded shadow mt-4">
        <p className="mb-4 text-gray-600">Total Members: {customers.length}</p>

        {customers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada member terdaftar.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-2 px-2 font-semibold text-sm">No</th>
                  <th className="py-2 px-2 font-semibold text-sm">Name</th>
                  <th className="py-2 px-2 font-semibold text-sm">Email</th>
                  <th className="py-2 px-2 font-semibold text-sm">Role</th>
                  <th className="py-2 px-2 font-semibold text-sm">Tier</th>
                  <th className="py-2 px-2 font-semibold text-sm">Points</th>
                  <th className="py-2 px-2 font-semibold text-sm">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((item, index) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm">{index + 1}</td>
                    <td className="py-3 px-2 text-sm font-medium">{item.full_name}</td>
                    <td className="py-3 px-2 text-sm">{item.email}</td>
                    <td className="py-3 px-2 text-sm capitalize">{item.role}</td>
                    <td className="py-3 px-2 text-sm">
                      <span className={`px-2 py-1 rounded text-white text-xs inline-block ${getTierBadge(item.tier)}`}>
                        {item.tier}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm">{item.points}</td>
                    <td className="py-3 px-2 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </td>
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