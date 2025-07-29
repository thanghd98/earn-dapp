import { Stake } from "./page/Stake";
import { Routes, Route } from "react-router-dom";
import { Withdrawals } from "./page/Withdrawals";
import { Rewards } from "./page/Rewards";

function App() {
  return (
    <div className="mt-[80px] bg-red-50 mx-12 rounded-3xl h-[calc(100%-160px)] overscroll-hidden">
      <div className="relative w-full h-full py-12 bg-black overflow-hidden rounded-3xl">
      <div className="absolute top-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-transparent via-white/70 to-transparent blur-3xl opacity-40 pointer-events-none glow-animation"></div>

      <div className="absolute bottom-[-30%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-transparent via-white/45 to-transparent blur-[120px] opacity-30 pointer-events-none glow-animation-reverse"></div>

      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
      <Routes>
      <Route path="/" element={<Stake />} />
      <Route path="/withdrawals" element={<Withdrawals />} />
      <Route path="/rewards" element={<Rewards />} />
      </Routes>
      </div>
      </div>
    </div>
  );
}

export default App;
