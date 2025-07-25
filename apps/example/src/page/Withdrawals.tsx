import { Clock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount, useBalance } from "wagmi";
import { earnSDK } from "../services";
import { toast } from "react-toastify";
import { useWithdrawals } from "../hooks/useWithdrawals";

const sETH_CONTRACT_ADDRESS = "0x3508a952176b3c15387c97be809eaffb1982176a"; // stETH contract address

export function Withdrawals() {
  const { address, isConnected } = useAccount();
  const { handleSubmit, register, setValue } = useForm();

  const [tab, setTab] = useState("request");

  const { pendingRequests, claimableRequests, timeEstimated } = useWithdrawals(address as string);

  const { data: sEthBalance } = useBalance({
    address,
    token: sETH_CONTRACT_ADDRESS,
  });

  const onWithdrawRequest = async (data: { amount: string }) => {
    const hash = await earnSDK.unstake({
      provider: "LidoProvider",
      amount: data.amount,
      token: "stETH", // or "wstETH"
    });

    toast.success(
      <div>
        <p className="font-sm">Transaction successfully</p>
        <p className="text-xs truncate max-w-[250px]">{hash}</p>
      </div>,
      {
        onClick: () => {
          window.open(`https://hoodi.etherscan.io/tx/${hash}`, "_blank");
        },
        position: "bottom-right",
      }
    );
  };

  const onClaim = async (data: any) => {
    const claimRequestFilter = await data.claimRequests.filter((request: any) => request.checked) || [];
    const ids = claimRequestFilter.map((request: any) => request.id);
  
    const hash = await earnSDK.claim( ids, "LidoProvider" );

    toast.success(
      <div>
        <p className="font-sm">Transaction successfully</p>
        <p className="text-xs truncate max-w-[250px]">{hash}</p>
      </div>,
      {
        onClick: () => {
          window.open(`https://hoodi.etherscan.io/tx/${hash}`, "_blank");
        },
        position: "bottom-right",
      }
    );
  }

  const requestWithdrawal = () => {
    return (
      <form
        className="flex flex-col gap-4 justify-center items-center rounded-2xl border bor w-1/3 mt-8 p-4"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        onSubmit={handleSubmit(onWithdrawRequest)}
      >
        {isConnected && (
          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm">stETH balance</p>
                <p className="text-xl font-semibold">
                  {(Number(sEthBalance?.value) / 10 ** 18).toFixed(4)} stETH
                </p>
              </div>
              <div>
                <div className="flex items-center flex-col gap-2">
                  <p className="text-sm text-left">My requests</p>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="orangeCheckbox"
                          checked
                          className="w-4 h-4 accent-orange-500"
                        />
                        <label className="text-sm font-semibold">{pendingRequests?.pendingRequests?.length || 0}</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="orangeCheckbox"
                          checked
                          className="w-4 h-4 accent-green-500"
                        />
                        <p className="text-sm font-semibold">{claimableRequests?.claimableRequests?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full">
          <div className="flex items-center ">
            <img
              src="https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628"
              width={25}
              height={25}
              alt=""
            />
            <input
              placeholder="sERTH amount"
              type="text"
              className="outline-none border-none px-4 py-1"
              {...register("amount", { required: true })}
            />
          </div>
          <button
            type="button"
            className="bg-black opacity-90 cursor-pointer backdrop-blur-sm text-white px-4 py-1 rounded hover:opacity-75 ease-in-out duration-200"
          >
            Max
          </button>
        </div>
        <div className="w-full">
          <button
            disabled={!isConnected}
            type="submit"
            className="bg-black cursor-pointer opacity-90 w-full text-white px-4 py-2 hover:opacity-75 ease-in-out duration-200"
          >
            {isConnected ? "Request withdrawal" : "Connect Wallet"}
          </button>
        </div>
        <div className="w-full flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <p>Max unlock cost</p>
            <p>FREE</p>
          </div>
          <div className="flex justify-between">
            <p>Max transaction cost</p>
            <p>$1.88</p>
          </div>
          <div className="flex justify-between">
            <p>Allowance</p>
            <p>0.0 stETH</p>
          </div>
          <div className="flex justify-between">
            <p>Exchange rate</p>
            <p>1 stETH = 1 ETH</p>
          </div>
        </div>
      </form>
    );
  };

  const claimWithdrawal = () => {
    return (
      <form
        className="flex flex-col gap-4 justify-center items-center rounded-2xl border bor w-1/3 mt-8 p-4"
        onSubmit={handleSubmit(onClaim)}
      >
        {isConnected && (
          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm">Available to claim</p>
                <p className="text-xl font-semibold">0.0 ETH</p>
              </div>
            </div>
            <hr className="border-gray-300 w-full my-2" />

            <div className="w-full flex justify-between items-center mb-2">
              <div>
                <div className="flex items-center flex-col gap-2">
                  <p className="text-sm text-left">My requests</p>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="orangeCheckbox"
                          checked
                          className="w-4 h-4 accent-orange-500"
                        />
                        <label className="text-sm font-semibold">{pendingRequests?.pendingRequests?.length || 0}</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="orangeCheckbox"
                          checked
                          className="w-4 h-4 accent-green-500"
                        />
                        <p className="text-sm font-semibold">{claimableRequests?.claimableRequests?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-left">My pending amount</p>
                <p className="text-xl font-semibold">{Number(pendingRequests?.pendingAmountStETH) / 10**18} stETH</p>
              </div>
            </div>
          </div>
        )}

        <div className=" border flex flex-col gap-4 border-gray-300 rounded-lg px-3 py-2 w-full">
          {pendingRequests?.pendingRequests?.length > 0 && pendingRequests.pendingRequests.map((request) => {
            const findRequest = timeEstimated?.find((item) => Number(item?.requestInfo?.requestId) === Number(request?.id));
            console.log("🚀 ~ findRequest:", findRequest)

            const requestedAt = new Date().getTime();
            const finalizationAt = new Date(findRequest?.requestInfo?.finalizationAt);

            const diffMs = Number(finalizationAt) - Number(requestedAt);
            const diffHours = diffMs / (1000 * 60 * 60); 

            const isDisabled = diffHours > 0;

            return (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <input
                  type="checkbox"
                  disabled={isDisabled}
                  id={`checkbox-${request.id}`}
                  className="w-4 h-4 accent-green-500"
                  onChange={(e) => setValue(`claimRequests.${request.id}`, { id: request.id, checked: e.target.checked })}
                  />
                  <p>{Number(request.amountOfStETH) / 10**18} stETH</p>
                </div>
                <div className="flex items-center gap-2 bg-orange-200 px-2 rounded-2xl">
                  <Clock className="w-4 text-orange-600" />
                  <p className="text-orange-600">~{Math.round(diffHours)} hour</p>
                </div>
              </div>
            )
        })}
        </div>
        <div className="w-full">
          <button
            disabled={!isConnected}
            type="submit"
            className="bg-black cursor-pointer opacity-90 w-full text-white px-4 py-2 hover:opacity-75 ease-in-out duration-200"
          >
            {isConnected ? "Claim" : "Connect Wallet"}
          </button>
        </div>
        <div className="w-full flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <p>Max transaction cost</p>
            <p>$0.79</p>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Withdrawals</h1>
        <p className="text-center">
          Request stETH/wstETH withdrawal and claim ETH
        </p>
      </div>

      <div className="flex mt-6">
        <button
          className={`px-4 py-2 min-w-[100px] cursor-pointer bg-gray-300 text-black hover:opacity-75 ease-in-out duration-200 ${tab ===
            "request" && "!bg-black !text-white"}`}
          onClick={() => setTab("request")}
        >
          Request
        </button>
        <button
          className={`px-4 py-2 min-w-[100px] cursor-pointer bg-gray-300 text-black hover:bg-gray-400 ease-in-out duration-200 ${tab ===
            "claim" && "!bg-black !text-white"}`}
          onClick={() => setTab("claim")}
        >
          Claim
        </button>
      </div>
      {tab === "request" ? requestWithdrawal() : claimWithdrawal()}
    </div>
  );
}
