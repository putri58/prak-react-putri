export default function TailwindCSSRevolusioner() {
    return (
        // Gunakan background gray sedikit hangat agar warna orange tidak terlalu menyala sendirian
        <div className="bg-[#f1f1f1] min-h-screen pb-20 font-sans antialiased text-blue-950">
            <FlexboxGrid />

            {/* Container Utama dengan Grid Asimetris */}
            <main className="max-w-7xl mx-auto mt-12 md:mt-20 px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Header Section - Melebar 8 Kolom */}
                <header className="md:col-span-8 bg-white border-4 border-blue-950 p-10 shadow-[8px_8px_0px_0px_rgba(23,37,84,1)]">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-block px-4 py-1 rounded-full bg-orange-300 text-blue-950 text-xs font-bold uppercase tracking-widest border-2 border-blue-950">
                            v4.0 Alpha
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-blue-950 tracking-tighter leading-none">
                        Revolusi<br />
                        <span className="text-white [-webkit-text-stroke:2px_#172554]">Tailwind CSS</span>
                    </h1>
                    <p className="text-xl text-gray-700 mt-6 max-w-2xl leading-relaxed">
                        Hancurkan batasan desain konvensional. Kami menggabungkan utilitas kuat dengan estetika <span className="font-bold text-blue-950 border-b-4 border-orange-300">Neo-Brutalism</span> yang berani.
                    </p>
                    <button className="mt-8 group relative inline-flex items-center gap-3 bg-blue-950 text-orange-300 px-8 py-4 text-lg font-bold border-4 border-blue-950 transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(23,37,84,1)] active:translate-x-0 active:translate-y-0 active:shadow-none">
                        Mulai Eksplorasi
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </header>

                {/* Sidebar Section (Spacing & BGColors) - 4 Kolom */}
                <aside className="md:col-span-4 space-y-8">
                    <Spacing />
                    <BackgroundColors />
                </aside>

                {/* Full Width Middle Section */}
                <div className="md:col-span-12">
                    <Typography />
                </div>

                {/* Bottom Section (Buttons & Hover) - 6 Kolom Masing-masing */}
                <div className="md:col-span-6">
                    <BorderRadius />
                </div>
                <div className="md:col-span-6">
                    <ShadowEffects />
                </div>

            </main>

            {/* Footer revolusioner */}
            <footer className="mt-20 border-t-4 border-blue-950 bg-white py-10 px-4 text-center">
                <p className="font-bold text-lg">Build the future, brutally.</p>
                <div className="mt-2 text-sm text-gray-500">© 2024 BrutalTailwind Inc.</div>
            </footer>
        </div>
    )
}

function FlexboxGrid() {
    return (
        <nav className="sticky top-0 z-50 bg-blue-950 border-b-4 border-orange-300 text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* Logo Neo-Brutalist */}
                    <div className="w-10 h-10 bg-orange-300 border-4 border-white rotate-12 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                        <span className="font-black text-2xl text-blue-950">T</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter">PUTRI.UI</h1>
                </div>
                <ul className="hidden md:flex items-center gap-1 font-semibold text-sm">
                    <li><a href="#" className="px-4 py-2 hover:bg-orange-300 hover:text-blue-950 transition-colors rounded">Docs</a></li>
                    <li><a href="#" className="px-4 py-2 hover:bg-orange-300 hover:text-blue-950 transition-colors rounded">Components</a></li>
                    <li><a href="#" className="px-4 py-2 hover:bg-orange-300 hover:text-blue-950 transition-colors rounded">Themes</a></li>
                </ul>
                <button className="bg-red-500 text-white font-bold px-5 py-2 border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-red-600 transition hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    Logout
                </button>
            </div>
        </nav>
    )
}

function Spacing() {
    return (
        // Hard shadow besar warna orange
        <div className="bg-blue-950 p-8 border-4 border-blue-950 shadow-[10px_10px_0px_0px_rgba(253,186,116,1)]">
            <h2 className="text-orange-300 text-2xl font-black tracking-tight flex items-center gap-3">
                <span className="w-3 h-3 bg-orange-300"></span>
                Spacing System
            </h2>
            <p className="mt-4 text-white leading-relaxed opacity-90">
                Lupakan spasi halus. Kami menggunakan ritme vertikal yang agresif untuk menekankan hierarki dan struktur elemen.
            </p>
        </div>
    )
}

function Typography() {
    return (
        <div className="bg-white border-4 border-blue-950 p-10 shadow-[8px_8px_0px_0px_rgba(23,37,84,1)]">
            {/* Teks Outline */}
            <h1 className="text-6xl md:text-8xl font-black text-white [-webkit-text-stroke:3px_#172554] tracking-tighter leading-none mb-4">
                BIG TYPO
            </h1>
            <h1 className="text-4xl font-extrabold text-blue-950 tracking-tight">
                Typography is the Interface
            </h1>
            <p className="text-gray-700 text-xl mt-4 max-w-3xl">
                Teks bukan sekadar konten; teks adalah elemen desain utama. Berani, besar, dan mudah dibaca adalah kunci revolusi ini.
            </p>
        </div>
    )
}

function BorderRadius() {
    return (
        <div className="bg-white border-4 border-blue-950 p-8 shadow-[8px_8px_0px_0px_rgba(23,37,84,1)]">
            <h3 className="text-xl font-bold mb-6 text-blue-950">Border & Radius Radical</h3>
            <div className="flex flex-wrap items-center gap-6">
                {/* Asymmetric Border Radius */}
                <button className="border-4 border-blue-950 text-blue-950 px-8 py-3 font-bold text-lg rounded-tl-[30px] rounded-br-[30px] bg-orange-300 shadow-[4px_4px_0px_0px_rgba(23,37,84,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                    Pill Radikal
                </button>

                <button className="border-4 border-blue-950 text-white px-8 py-3 font-bold text-lg rounded-full bg-blue-950 hover:bg-orange-300 hover:text-blue-950 transition-colors">
                    Rounded Full
                </button>
            </div>
        </div>
    )
}

function BackgroundColors() {
    return (
        // Diagonal stripe pattern background
        <div className="bg-orange-300 text-blue-950 p-8 border-4 border-blue-950 shadow-[10px_10px_0px_0px_rgba(23,37,84,1)] relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #172554 0, #172554 2px, transparent 0, transparent 50%)', backgroundSize: '15px 15px' }}></div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tighter">Color Clash</h3>
                <p className="mt-3 font-bold leading-relaxed text-lg text-blue-900">
                    Tabrakan warna yang disengaja antara <span className="bg-blue-950 text-orange-300 px-1">Blue 950</span> dan <span className="bg-white text-blue-950 px-1 border border-blue-950">Orange 300</span> menciptakan energi visual yang tinggi.
                </p>
            </div>
        </div>
    )
}

function ShadowEffects() {
    return (
        // Hover effect yang membalikkan warna dan shadow
        <div className="bg-white group cursor-pointer border-4 border-blue-950 shadow-[10px_10px_0px_0px_rgba(23,37,84,1)] p-8 transition-all duration-300 hover:bg-blue-950 hover:shadow-[-10px_-10px_0px_0px_rgba(253,186,116,1)] hover:-translate-x-1 hover:-translate-y-1">
            <h3 className="text-2xl font-black tracking-tight text-blue-950 group-hover:text-orange-300 transition-colors">
                Hard Shadows <span className="text-orange-300 group-hover:text-white">&rarr;</span>
            </h3>
            <p className="text-gray-700 mt-3 text-lg group-hover:text-white/90 transition-colors leading-relaxed">
                Tinggalkan bayangan lembut yang realistis. Gunakan bayangan tajam dengan warna solid untuk memberikan kesan pop-art dan arsitektural.
            </p>
        </div>
    )
}