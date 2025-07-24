import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-between items-center p-2.5 border-b border-gray-300 shadow-xl">
      <div className="flex items-center">
        <img src="/c98logo.png" alt="Logo" className="h-10" />
        <span className="ml-2.5 text-lg font-bold">Coin98 staking</span>
        <ul className="flex items-center gap-4 uppercase text-sm mx-12">
          <Link
            to={"/"}
            className={`cursor-pointer hover:underline hover:font-semibold ease-in duration-400 ${
              isActive("/") ? "font-bold underline" : ""
            }`}
          >
            Stake
          </Link>
          <Link
            to={"/withdrawals"}
            className={`cursor-pointer hover:underline hover:font-semibold ease-in duration-400 ${
              isActive("/withdrawals") ? "font-bold underline" : ""
            }`}
          >
            Withdrawals
          </Link>
          <Link
            to={"/rewards"}
            className={`cursor-pointer hover:underline hover:font-semibold ease-in duration-400 ${
              isActive("/rewards") ? "font-bold underline" : ""
            }`}
          >
            Rewards
          </Link>
        </ul>
      </div>

      <ConnectButton />
    </div>
  );
}
