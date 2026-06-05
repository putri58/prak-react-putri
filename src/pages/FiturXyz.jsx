export default function FiturXyz() {
  return (
    <div id="dashboard-container" className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Fitur XYZ
          </h1>

          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <span>Dashboard</span>
            <span>/</span>
            <span>Order List</span>
          </div>
        </div>

        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Add Button
        </button>
      </div>

      {/* Content */}
      <div>
        <p className="text-gray-700">
          Ini Halaman Fitur XYZ
        </p>
      </div>
    </div>
  );
}