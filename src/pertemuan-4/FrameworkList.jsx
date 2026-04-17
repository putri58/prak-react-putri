import frameworkData from "./framework.json";

export default function FrameworkList() {
  // Array warna untuk variasi kartu agar tidak bosan
  const cardColors = [
    "hover:shadow-[0_20px_50px_rgba(255,182,193,0.5)] border-pink-100",
    "hover:shadow-[0_20px_50px_rgba(186,230,253,0.5)] border-blue-100",
    "hover:shadow-[0_20px_50px_rgba(209,250,229,0.5)] border-emerald-100",
    "hover:shadow-[0_20px_50px_rgba(254,243,199,0.5)] border-amber-100",
  ];

  const tagColors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-purple-100 text-purple-600",
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-8 font-sans selection:bg-pink-200">
      <div className="max-w-2xl mx-auto">
        {/* Header yang Playful */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">
            ✨ Framework <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">Magic</span>
          </h1>
          <p className="text-gray-400 font-medium italic">Handpicked tools for the cool devs 🍦</p>
        </header>

        <div className="space-y-8">
          {frameworkData.map((item, index) => (
            <div
              key={item.id}
              className={`
                group relative bg-white border-2 p-8 rounded-[2.5rem] 
                transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                hover:scale-[1.03] hover:-rotate-1
                ${cardColors[index % cardColors.length]}
              `}
            >
              {/* Floating Badge Year */}
              <div className="absolute -top-3 -right-2 bg-gradient-to-br from-gray-800 to-black text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg transform rotate-6 group-hover:rotate-0 transition-transform">
                EST. {item.details.releaseYear}
              </div>

              <div className="mb-4">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2 group-hover:tracking-wide transition-all">
                  {item.name}
                </h2>
                <p className="text-gray-500 leading-relaxed font-medium text-sm">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex -space-x-2 mr-3">
                   {/* Avatar placeholder ala Gen Z */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-200 to-blue-200 border-2 border-white" />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  By <span className="text-gray-700">{item.details.developer}</span>
                </p>
              </div>

              {/* Tags dengan animasi hover */}
              <div className="flex flex-wrap gap-2 mb-8">
                {item.tags.map((tag, tIndex) => (
                  <span
                    key={tIndex}
                    className={`
                      ${tagColors[tIndex % tagColors.length]}
                      px-4 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-wider
                      transform transition-all hover:scale-110 cursor-default
                    `}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Link bergaya button gemoy */}
              <a
                href={item.details.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex items-center justify-center w-full py-4 bg-gray-50 text-gray-800 rounded-2xl font-bold text-sm transition-all hover:bg-gray-900 hover:text-white overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Check It Out 
                  <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}