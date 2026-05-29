export default function HeroSection({ title, subtitle }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 text-center md:text-left md:flex items-center justify-between shadow-lg">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-extrabold mb-2">{title}</h1>
        <p className="text-blue-100 text-base">{subtitle}</p>
      </div>
      <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-2.5 rounded-lg transition shadow">
        Mulai Sekarang
      </button>
    </div>
  );
}