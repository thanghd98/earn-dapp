import { Stake } from "./page/Stake";
import { Routes, Route } from "react-router-dom";
import { Withdrawals } from "./page/Withdrawals";
import { Rewards } from "./page/Rewards";
import { useState } from "react";
import { ProviderContext, StakeProviderContext } from "./hooks/useProvider";
import { useStake } from "./hooks/useStake";
import { useAccount } from "wagmi";
import Skeleton from "react-loading-skeleton";
import { CircleQuestionMark } from "lucide-react";

const providers = [
  {
    id: "LidoProvider",
    name: "Lido",
    logo:
      "https://assets.coingecko.com/coins/images/13442/standard/steth_logo.png?1696513206",
  },
  {
    id: "ChorusOneProvider",
    name: "Chorus One",
    logo:
      "https://pbs.twimg.com/profile_images/1922639518399705088/B70wR6V2_400x400.jpg",
  },
];

function App() {
  const [provider, setProvider] = useState("LidoProvider");
  const [stakeProvider, setStakeProvider] = useState("");

  const { address } = useAccount();

  const { validators, isLoadingValidator } = useStake(address as string, provider, stakeProvider);

  const setProviderContext = (value: string) => {
    setProvider(value);
  };

  const setStakeProviderContext = (value: string) => {
    setStakeProvider(value);
  };

  return (
    <ProviderContext.Provider value={{ provider, setProvider }}>
      <StakeProviderContext.Provider
        value={{ stakeProvider: validators?.[0].vault.address || '', setStakeProvider }}
      >
        <div className="mt-[80px] justify-between gap-12  mx-12 flex rounded-3xl h-[calc(100%-160px)] overscroll-hidden">
          <div className="p-4 ml-12 bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600 flex justify-around gap-4 rounded-2xl">
            {providers.map((p) => (
              <div
                onClick={() => setProviderContext(p.id)}
                key={p.id}
                className={`flex flex-col items-center justify-center p-4 gap-2 border-2 shadow-2xl border-black bg-[#222524] text-white min-w-30 max-h-30 cursor-pointer rounded-2xl hover:opacity-90 transition-opacity duration-200 ${p.id ===
                  provider && "opacity-90 text-yellow-600"}`}
              >
                <img
                  src={p.logo}
                  alt={`${p.name} Logo`}
                  className="h-10 rounded-full"
                />
                <p>{p.name}</p>
              </div>
            ))}
          </div>
          <div className="relative w-full h-full py-12 bg-black overflow-hidden rounded-3xl">
            <div className="absolute top-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-transparent via-white/70 to-transparent blur-3xl opacity-40 pointer-events-none glow-animation"></div>

            <div className="absolute bottom-[-30%] left-[-20%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-bl from-transparent via-white/45 to-transparent blur-[120px] opacity-30 pointer-events-none glow-animation-reverse"></div>

            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light pointer-events-none"></div>

            <div className="w-full  gap-4 ">
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
                <Routes>
                  <Route path="/" element={<Stake />} />
                  <Route path="/withdrawals" element={<Withdrawals />} />
                  <Route path="/rewards" element={<Rewards />} />
                </Routes>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-1/3">
        {
          isLoadingValidator ? <Skeleton count={3} /> : (
            validators?.map((p) => {
              return (
                <div onClick={() => setStakeProviderContext(p.vault.address)} className=" bg-gradient-to-b from-yellow-300 via-yellow-500 to-yellow-600  px-4 py-2 rounded-2xl cursor-pointer hover:opacity-90 transition-opacity duration-200">
                  <div className="flex items-center gap-4">
                    <img
                     className="rounded-full"
                      src={p.vault.logoUrl}
                      width={50}
                      height={50}
                      alt=""
                    />
                    <p className="text-center font-semibold text-xl break-all text-black truncate">
                      {p.vault.name}
                    </p>
                  </div>
                  <div className="flex items-center mt-4 gap-2">
                    <p className=" items-center gap-1 text-sm text-yellow-600 bg-yellow-100 border-yellow-500 inline-flex roun rounded-xl px-2 py-1 border">
                      <span className="text-green-600 font-semibold ">
                        {isLoadingValidator ? <Skeleton count={1} /> : Number(p?.vault?.apy)?.toFixed(1)}%
                      </span>
                      APR
                    </p>
  
                    <span>
                      <CircleQuestionMark className="inline text-white" />
                    </span>
                  </div>
                </div>
              )
            })
          )
        }
        </div>
        </div>
      </StakeProviderContext.Provider>
    </ProviderContext.Provider>
  );
}

export default App;
