const partners = [
  { name: "Victoria xao quyet @2412 copy right", icon: "/icons/vercel.svg" },
];

export function Footer() {
  return (
    <footer className="relative w-full bg-black py-6 rounded-b-[24px] overflow-hidden">
      {/* Glow left */}
      <div className="absolute left-[-20%] top-1/2 -translate-y-1/2 w-[40vw] h-[60%] bg-gradient-to-r from-white/10 via-transparent to-transparent blur-2xl opacity-30 pointer-events-none" />

      {/* Glow right */}
      <div className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-[40vw] h-[60%] bg-gradient-to-l from-white/10 via-transparent to-transparent blur-2xl opacity-30 pointer-events-none" />
      <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center items-center gap-8 px-4">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition"
          >
        
            <span className="text-xl">{partner.name}</span>
          </div>
        ))}
      </div>
    </footer>
  );
}
