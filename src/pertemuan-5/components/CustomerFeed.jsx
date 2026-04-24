import { FaUserCircle } from "react-icons/fa";

export default function CustomerFeed() {
    const activities = [
        { name: "Budi Santoso", action: "Memberikan ulasan bintang 5", time: "Baru saja" },
        { name: "Siti Nuraini", action: "Memesan Nasi Goreng Spesial", time: "2 menit yang lalu" },
        { name: "Andi Pratama", action: "Membatalkan pesanan #00120", time: "5 menit yang lalu" },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Aktivitas Pelanggan Terbaru</h3>
            <div className="space-y-4">
                {activities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0">
                        <div className="flex items-center space-x-3">
                            <FaUserCircle className="text-gray-300 text-3xl" />
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.action}</p>
                            </div>
                        </div>
                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-400">
                            {item.time}
                        </span>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-sm text-hijau font-semibold hover:underline">
                Lihat Semua Aktivitas
            </button>
        </div>
    );
}