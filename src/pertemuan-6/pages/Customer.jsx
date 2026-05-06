import PageHeader from "../components/PageHeader";

export default function Customers() {
  return (
    <div>
      <PageHeader title="Customer List">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add New Customer
        </button>
      </PageHeader>

      <div className="bg-white p-4 rounded shadow mt-4">
        <p>Ini Halaman Customer</p>
      </div>
    </div>
  );
}