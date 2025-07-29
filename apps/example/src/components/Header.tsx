import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex justify-between items-center py-3 px-8 fixed top-0 left-0 right-0 z-50">
      <div>
        {" "}
        <img src="/c98logo.png" alt="Logo" className="h-10" />{" "}
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-white text-lg">
        <ul className="flex items-center gap-8 px-8 py-2 rounded-2xl text-sm bg-[#222524] border border-[#212121]">
          <Link
            to={"/"}
            className={`cursor-pointer ease-in duration-300 transform hover:scale-110 hover:text-yellow-400 ${
              isActive("/") ? "text-yellow-400" : "text-white"
            }`}
          >
            Stake
          </Link>
          <Link
            to={"/withdrawals"}
            className={`cursor-pointer ease-in duration-300 transform hover:scale-110 hover:text-yellow-400 ${
              isActive("/withdrawals") ? "text-yellow-400" : "text-white"
            }`}
          >
            Withdrawals
          </Link>
          <Link
            to={"/rewards"}
            className={`cursor-pointer ease-in duration-300 transform hover:scale-110 hover:text-yellow-400 ${
              isActive("/rewards") ? "text-yellow-400" : "text-white"
            }`}
          >
            Rewards
          </Link>
        </ul>
      </div>

      <div>
        {" "}
        <ConnectButton />{" "}
      </div>
    </div>
  );
}
