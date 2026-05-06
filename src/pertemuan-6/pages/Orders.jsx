import PageHeader from "../components/PageHeader";

export default function Orders() {
  return (
    <div>
      <PageHeader title="Order List">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add New Order
        </button>
      </PageHeader>

      <div className="bg-white p-4 rounded shadow mt-4">
        <p>Ini Halaman Orders</p>
      </div>
    </div>
  );
}