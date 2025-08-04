import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAccount, useSendTransaction } from "wagmi";
import { earnSDK } from "../services";
import { toast } from "react-toastify";
import { useWithdrawals } from "../hooks/useWithdrawals";
import Skeleton from "react-loading-skeleton";
import { Loading } from "../components/Loading";
import { useProvider, useStakeProvider } from "../hooks/useProvider";
import { useStake } from "../hooks/useStake";

export function Withdrawals() {
  const [loading, setLoading] = useState(false);
  const { address, isConnected } = useAccount();
  const { provider } = useProvider();
  const { stakeProvider } = useStakeProvider();
  const { sendTransactionAsync } = useSendTransaction()
  const { tokens } = useStake(
    address as string,
    provider,
    stakeProvider
  );

  const [tab, setTab] = useState("request");

  const {
    pendingRequests,
    claimableRequests,
    isLoadingPending,
  } = useWithdrawals(address as string, stakeProvider, provider);
    console.log("🚀 ~ Withdrawals ~ claimableRequests:", claimableRequests)

  const { totalStakedBalance, isLoadingTotalStaked } = useStake(
    address as string,
    provider,
    stakeProvider
  );

  const { handleSubmit, register, control, setValue, reset } = useForm({
    defaultValues: {
      requests: claimableRequests?.claimRequests.map((item: any) => {
        return {
          id: item?.id,
          isFinalized: item?.isFinalized,
        };
      }),
      amount: "", // Add amount to defaultValues
    },
  });

  useEffect(() => {
      reset({
        requests: claimableRequests?.claimRequests.map((item: any) => ({
          id: item.id,
          isFinalized: item.isFinalized,
        })),
      });
  }, [claimableRequests, reset]);

  const onWithdrawRequest = async (data: { amount: string }) => {
    setLoading(true);

    try {
      const result = await earnSDK.unstake({
        provider,
        amount: data.amount,
        token: "stETH", // or "wstETH",
        delegatorAddress: address as string,
        validatorAddress: stakeProvider,
      });
      let hash = result

      if (typeof result === 'object') {
        hash = await sendTransactionAsync(result)
      }

      toast.success(
        <div>
          <p className="font-sm">Transaction successfully</p>
          <p className="text-xs truncate max-w-[250px]">{typeof result === 'object' ? hash : result}</p>
        </div>,
        {
          onClick: () => {
            window.open(`https://hoodi.etherscan.io/tx/${typeof result === 'object' ? hash : result}`, "_blank");
          },
          position: "bottom-right",
        }
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onClaim = async (data: any) => {
    console.log("🚀 ~ onClaim ~ data:", data)
    setLoading(true);

    try {
      const result = await earnSDK.claim({
        data,
        provider,
        delegatorAddress: address as string,
        validatorAddress: stakeProvider,
      });

      let hash = result

      if (typeof result === 'object') {
        hash = await sendTransactionAsync(result)
      }

      toast.success(
        <div>
          <p className="font-sm">Transaction successfully</p>
          <p className="text-xs truncate max-w-[250px]">{typeof result === 'object' ? hash : result}</p>
        </div>,
        {
          onClick: () => {
            window.open(`https://hoodi.etherscan.io/tx/${typeof result === 'object' ? hash : result}`, "_blank");
          },
          position: "bottom-right",
        }
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const requestWithdrawal = () => {
    return (
      <form
        className="flex flex-col gap-4 justify-center items-center rounded-2xl border border-[#212121] w-1/2  mt-8 p-4"
        onSubmit={handleSubmit(onWithdrawRequest)}
      >
        {isConnected && (
          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm">Staked amount</p>
                <p className="text-xl font-semibold">
                  {isLoadingTotalStaked ? (
                    <Skeleton count={1} />
                  ) : (
                    (Number(totalStakedBalance?.balance) / 10 ** Number(totalStakedBalance?.coin?.decimals)).toFixed(4) +
                    " " +
                    totalStakedBalance?.coin?.symbol
                  )}{" "}
                </p>
              </div>

              <div>
                <div className="flex items-center flex-col gap-2">
                  <p className="text-sm text-left">My requests</p>

                  <div>
                    {isLoadingPending ? (
                      <div className="flex items-center gap-2 h-full">
                        <Skeleton count={1} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="orangeCheckbox"
                            checked
                            className="w-4 h-4 accent-gray-300"
                          />
                          <label className="text-sm font-semibold">
                            {pendingRequests?.pendingRequests?.length || 0}
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="orangeCheckbox"
                            checked
                            className="w-4 h-4 accent-gray-800"
                          />
                          <p className="text-sm font-semibold">
                            {claimableRequests?.claimRequests?.length || 0}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center gap-2 border border-[#212121] rounded-lg px-3 py-2 w-full">
          <div className="flex items-center ">
            <img
              src="https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628"
              width={25}
              height={25}
              alt=""
            />
            <input
              placeholder="Amount"
              type="text"
              className="outline-none border-none px-4 py-1"
              {...register("amount", { required: true })}
            />
          </div>
        </div>
        <div className="w-full">
          <button
            disabled={!isConnected}
            type="submit"
            className="bg-black flex justify-center cursor-pointer opacity-90 w-full text-white px-4 py-2 hover:opacity-75 ease-in-out duration-200"
          >
            {loading ? (
              <Loading />
            ) : isConnected ? (
              "Request withdrawal"
            ) : (
              "Connect Wallet"
            )}
          </button>
        </div>
        {/* <div className="w-full flex flex-col gap-2 text-sm">
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
        </div> */}
      </form>
    );
  };

  const claimWithdrawal = () => {
    return (
      <form
        className="flex flex-col gap-4 justify-center items-center rounded-2xl border border-[#212121] w-1/2 mt-8 p-4"
        onSubmit={handleSubmit(onClaim)}
      >
        {isConnected && (
          <div className="w-full">
            <div className="w-full flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm">Available to claim</p>
                <p className="text-xl font-semibold">{Number(claimableRequests?.claimAmount) / 10**tokens?.decimals} ETH</p>
              </div>
            </div>
            <hr className="border-[#212121] w-full my-2" />

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
                          className="w-4 h-4 accent-gray-300"
                        />
                        <label className="text-sm font-semibold">
                          {pendingRequests?.pendingRequests?.length || 0}
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="orangeCheckbox"
                          checked
                          className="w-4 h-4 accent-gray-800"
                        />
                        <p className="text-sm font-semibold">
                          {claimableRequests?.claimRequests?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-left">My pending amount</p>
                <p className="text-xl font-semibold text-right">
                  {isLoadingPending ? (
                    <Skeleton count={1} />
                  ) : (
                    `${(Number(pendingRequests?.pendingAmount) /
                      10 ** 18).toFixed(4)}`
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className=" border flex flex-col gap-4 border-[#212121] rounded-lg px-3 py-2 w-full">
          {pendingRequests?.pendingRequests?.length > 0 &&
            pendingRequests.pendingRequests.map((request: any) => {
              const isDisabled = request.timestamp > 0;

              return (
                <div className="flex justify-between items-center text-gray-300">
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      disabled={isDisabled}
                      id={`checkbox-${request.id}`}
                      className="w-4 h-4 accent-green-500"
                      onChange={(e) =>
                        //@ts-expect-error
                        setValue(`claimRequests.${request.id}`, {
                          id: request.id,
                          checked: e.target.checked,
                        })
                      }
                    />
                    <p>{(Number(request.amount) / 10 ** 18).toFixed(4)} {tokens?.symbol}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-200 px-2 rounded-2xl">
                    <Clock className="w-4 text-orange-600" />
                    <p className="text-orange-600">
                      ~{Math.round(request.timestamp)} hour
                    </p>
                  </div>
                </div>
              );
            })}

          {claimableRequests?.claimRequests?.length > 0 &&
            claimableRequests.claimRequests.map(
              (request: any, index: number) => {
                return (
                  <div className="flex justify-between items-center text-gray-300">
                    <div className="flex items-center gap-2 text-sm">
                      <Controller
                        key={request.id.toString()}
                        control={control}
                        name={`requests.${index}.isFinalized`}
                        render={({ field }) => (
                          <input
                            className="w-4 h-4 accent-green-500"
                            type="checkbox"
                            {...field}
                            checked={field.value ?? false} // chống undefined ở lần đầu
                          />
                        )}
                      />

                      <p>{(Number(request.amount) / 10 ** 18).toFixed(4)} {tokens?.symbol}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-blue-200 px-2 rounded-2xl">
                      <Clock className="w-4 text-blue-600" />
                      <p className="text-blue-600">Ready</p>
                    </div>
                  </div>
                );
              }
            )}
        </div>
        <div className="w-full">
          <button
            disabled={!isConnected}
            type="submit"
            className="bg-black flex justify-center cursor-pointer opacity-90 w-full text-white px-4 py-2 hover:opacity-75 ease-in-out duration-200"
          >
            {loading ? <Loading /> : isConnected ? "Claim" : "Connect Wallet"}
          </button>
        </div>
        {/* <div className="w-full flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <p>Max transaction cost</p>
            <p>$0.79</p>
          </div>
        </div> */}
      </form>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
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
