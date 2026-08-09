"use client";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex w-full justify-center px-4">
      <div className="relative mt-6 flex h-16 w-[88%] max-w-[1500px] items-center rounded-full border border-white/10 bg-black/30 px-8 backdrop-blur-2xl lg:px-10">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_22px_rgba(180,255,120,.9)]" />
          <span className="text-lg font-bold tracking-[0.35em]">1CC</span>
        </div>

        {/* LINKS */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-12 text-sm text-white/60 lg:flex">
          <a href="#" className="transition hover:text-white">Про нас</a>
          <a href="#" className="transition hover:text-white">Кейси</a>
          <a href="#" className="transition hover:text-white">Контакти</a>
        </nav>

        {/* CTA */}
        <button className="ml-auto rounded-full border border-white/15 bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-105">
          Почати
        </button>

      </div>
    </header>
  );
}