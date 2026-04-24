export default function OrdersChart() {
    const chartData = [
        { label: "Sun", val: 40 },
        { label: "Mon", val: 70 },
        { label: "Tue", val: 45 },
        { label: "Wed", val: 90 },
        { label: "Thu", val: 65 },
        { label: "Fri", val: 80 },
        { label: "Sat", val: 50 },
    ];

    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md mx-5 mb-10 border border-gray-100">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Weekly Orders Review</h3>
                    <p className="text-xs text-gray-400">Statistik pesanan 7 hari terakhir</p>
                </div>
                <button className="text-[#00B074] border border-[#00B074] px-4 py-1 rounded-lg text-sm font-semibold hover:bg-green-50">
                    Save Report
                </button>
            </div>

            {/* Area Grafik */}
            <div className="flex items-end justify-between h-64 w-full px-2 gap-2 border-b border-gray-200">
                {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center w-full group">
                        {/* Batang Grafik - PAKSA PAKAI STYLE INLINE */}
                        <div 
                            style={{ 
                                height: `${data.val}px`, // Paksa pakai pixel biar kelihatan dulu
                                minHeight: `${data.val}%`, // Paksa pakai persen juga
                                backgroundColor: '#D1FAE5', // Warna hijau muda
                                width: '40px' 
                            }} 
                            className="rounded-t-md transition-all duration-300 hover:bg-[#00B074] cursor-pointer relative"
                        >
                            {/* Tooltip */}
                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                                {data.val} Orders
                            </span>
                        </div>
                        {/* Label Hari */}
                        <span className="text-xs text-gray-400 mt-4 font-medium mb-[-25px]">{data.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}