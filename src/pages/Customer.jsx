import { useState } from "react"; // ✅ tambahan
import PageHeader from "../components/PageHeader";
import { customers } from "../data/customers"; // ✅ tambahan

export default function Customers() {

  const [showForm, setShowForm] = useState(false); // ✅ tambahan

  return (
    <div>
      <PageHeader title="Customer List">
        <button 
          onClick={() => setShowForm(true)} // ✅ tambahan
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Customer
        </button>
      </PageHeader>

      <div className="bg-white p-4 rounded shadow mt-4">
        <p>Ini Halaman Customer</p>

        {/* ✅ POINT 6: DATA */}
        <div className="mt-4">
          {customers.map((item) => (
            <div key={item.id} className="border-b py-2">
              <p><b>ID:</b> {item.id}</p>
              <p><b>Name:</b> {item.name}</p>
              <p><b>Email:</b> {item.email}</p>
              <p><b>Phone:</b> {item.phone}</p>
              <p>
                <b>Loyalty:</b> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs
                  ${item.loyalty === "Bronze" ? "bg-yellow-600" :
                    item.loyalty === "Silver" ? "bg-gray-500" :
                    "bg-green-500"}`}>
                  {item.loyalty}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* ✅ POINT 7: FORM */}
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