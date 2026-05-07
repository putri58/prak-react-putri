import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { orders } from "../data/orders";

export default function Orders() {

  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      {/* HEADER */}
      <PageHeader 
        title="Order List" 
        breadcrumb={["Dashboard", "Orders"]}
      >
        <button 
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Order
        </button>
      </PageHeader>

      {/* CONTENT */}
      <div className="bg-white p-4 rounded shadow mt-4">
        <p>Ini Halaman Orders</p>

        {/* LIST DATA */}
        <div className="mt-4">
          {orders.map((item) => (
            <div key={item.id} className="border-b py-3">
              <p><b>ID:</b> {item.id}</p>
              <p><b>Name:</b> {item.name}</p>
              <p>
                <b>Status:</b> 
                <span className={`ml-2 px-2 py-1 rounded text-white text-xs
                  ${item.status === "Pending" ? "bg-yellow-500" :
                    item.status === "Completed" ? "bg-green-500" :
                    "bg-red-500"}`}>
                  {item.status}
                </span>
              </p>
              <p><b>Price:</b> Rp {item.price}</p>
              <p><b>Date:</b> {item.date}</p>
            </div>
          ))}
        </div>

        {/* FORM ADD ORDER */}
        {showForm && (
          <div className="bg-gray-100 p-4 mt-6 rounded shadow">
            <h3 className="font-bold mb-3 text-lg">Add New Order</h3>

            <input 
              placeholder="Customer Name" 
              className="border p-2 w-full mb-2 rounded"
            />

            <input 
              placeholder="Total Price" 
              className="border p-2 w-full mb-2 rounded"
            />

            <select className="border p-2 w-full mb-2 rounded">
              <option>Pending</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

            <input 
              type="date"
              className="border p-2 w-full mb-3 rounded"
            />

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