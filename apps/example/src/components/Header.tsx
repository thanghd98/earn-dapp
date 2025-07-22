import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <div className="flex justify-between items-center p-2.5 border-b border-gray-300 shadow-xl">
        <div className="flex items-center">
            <img src="/c98logo.png" alt="Logo" className="h-10" />
            <span className="ml-2.5 text-lg font-bold">Coin98 staking</span>
        </div>
        <ConnectButton />
    </div>
  )
}