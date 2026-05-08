import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { customers } from "../data/customers";

export default function Customers() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <PageHeader title="Customer List">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Customer
        </button>
      </PageHeader>

      <div className="bg-white p-4 rounded shadow mt-4">
        <p className="mb-4">Ini Halaman Customer</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-2 px-2 font-semibold text-sm">ID</th>
                <th className="py-2 px-2 font-semibold text-sm">Name</th>
                <th className="py-2 px-2 font-semibold text-sm">Email</th>
                <th className="py-2 px-2 font-semibold text-sm">Phone</th>
                <th className="py-2 px-2 font-semibold text-sm">Loyalty</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((item) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm">{item.id}</td>
                  <td className="py-3 px-2 text-sm font-medium">{item.name}</td>
                  <td className="py-3 px-2 text-sm">{item.email}</td>
                  <td className="py-3 px-2 text-sm">{item.phone}</td>
                  <td className="py-3 px-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs inline-block
                      ${
                        item.loyalty === "Bronze"
                          ? "bg-yellow-600"
                          : item.loyalty === "Silver"
                          ? "bg-gray-500"
                          : "bg-green-500"
                      }`}
                    >
                      {item.loyalty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-4 mt-6 rounded shadow">
            <h3 className="font-bold mb-3 text-lg">Add New Customer</h3>

            <input
              placeholder="Customer Name"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Email"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Phone"
              className="border p-2 w-full mb-2 rounded"
            />

            <select className="border p-2 w-full mb-3 rounded">
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
            </select>

            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Submit
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}