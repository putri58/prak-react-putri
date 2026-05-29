export default function Alert({ children, type = "success" }) {
  const styles = {
    success: "bg-green-100 border-green-400 text-green-700",
    danger: "bg-red-100 border-red-400 text-red-700",
  };

  return (
    <div className={`border px-4 py-3 rounded-lg relative ${styles[type]}`} role="alert">
      <span className="block sm:inline">{children}</span>
    </div>
  );
}