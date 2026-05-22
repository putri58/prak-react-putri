import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import data from "../data/product.json";

export default function Products() {
  const [showForm, setShowForm] = useState(false);

  const products = data.product;

  return (
    <div>
      <PageHeader title="Product List">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Product
        </button>
      </PageHeader>

      <div className="bg-white p-4 rounded shadow mt-4">
        <p className="mb-4">Ini Halaman Product</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="py-2 px-2 font-semibold text-sm">ID</th>
                <th className="py-2 px-2 font-semibold text-sm">Title</th>
                <th className="py-2 px-2 font-semibold text-sm">Code</th>
                <th className="py-2 px-2 font-semibold text-sm">Category</th>
                <th className="py-2 px-2 font-semibold text-sm">Brand</th>
                <th className="py-2 px-2 font-semibold text-sm">Price</th>
                <th className="py-2 px-2 font-semibold text-sm">Stock</th>
              </tr>
            </thead>

            <tbody>
              {products.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-3 px-2 text-sm">{item.id}</td>

                  {/* TITLE JADI LINK */}
                  <td className="py-3 px-2 text-sm font-medium">
                    <Link
                      to={`/products/${item.id}`}
                      className="text-emerald-500 hover:text-emerald-600"
                    >
                      {item.tittle}
                    </Link>
                  </td>

                  <td className="py-3 px-2 text-sm">{item.code}</td>
                  <td className="py-3 px-2 text-sm">{item.category}</td>
                  <td className="py-3 px-2 text-sm">{item.brand}</td>

                  <td className="py-3 px-2 text-sm">
                    Rp {item.price.toLocaleString("id-ID")}
                  </td>

                  <td className="py-3 px-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs inline-block ${
                        item.stock > 50 ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="bg-gray-100 p-4 mt-6 rounded shadow">
            <h3 className="font-bold mb-3 text-lg">Add New Product</h3>

            <input
              placeholder="Product Title"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Product Code"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Brand"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Price"
              type="number"
              className="border p-2 w-full mb-2 rounded"
            />

            <input
              placeholder="Stock"
              type="number"
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