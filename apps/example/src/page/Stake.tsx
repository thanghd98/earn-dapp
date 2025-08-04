import { useForm } from "react-hook-form";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { toast } from "react-toastify";
import { earnSDK } from "../services";
import Skeleton from "react-loading-skeleton";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { useProvider, useStakeProvider } from "../hooks/useProvider";
import { useStake } from "../hooks/useStake";

export function Stake() {
  const [loading, setLoading] = useState(false);
  const { provider } = useProvider();
  const { register, handleSubmit } = useForm();

  const { stakeProvider } = useStakeProvider();

  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction()

  const { data: ethBalance, isLoading: isLoadingNative } = useBalance({
    address,
  });

  const { totalStakedBalance, isLoadingTotalStaked } = useStake(
    address as string,
    provider,
    stakeProvider
  );

  const onStaking = async (data: { amount: string }) => {
    setLoading(true);
    try {
      const result = await earnSDK.stake({
        amount: data.amount,
        provider: provider,
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
          <p className="text-xs truncate max-w-[250px]">{typeof result === 'object' ? hash as string : result}</p>
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

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 pb-4">
        <h1 className="text-center text-4xl font-semibold">Stake ETH</h1>
        <p className="text-center">Stake ETH and receive another token while staking</p>
      </div>
      <div className="w-full flex justify-center gap-8 ">
        <form
          className="flex flex-col gap-4 justify-center items-center rounded-2xl border-2 border-[#212121] w-full  p-4 max-w-1/2"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          onSubmit={handleSubmit(onStaking)}
        >
          {isConnected && (
            <div className="w-full">
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm">Available to stake</p>
                  <p className="text-xl font-semibold">
                    {isLoadingNative ? (
                      <Skeleton count={1} />
                    ) : (
                      `${(Number(ethBalance?.value) / 10 ** 18).toFixed(4)} ${
                        ethBalance?.symbol
                      }`
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Staked amount</p>
                  <p className="text-xl font-semibold">
                    {isLoadingTotalStaked ? (
                      <Skeleton count={1} />
                    ) : (
                      `${(
                        Number(totalStakedBalance?.balance) /
                        10 ** Number(totalStakedBalance?.coin.decimals)
                      ).toFixed(4)} ${totalStakedBalance?.coin.symbol}`
                    )}
                  </p>
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
                placeholder="0.001"
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
              className="bg-black flex justify-center cursor-pointer opacity-90 w-full text-white outline-none px-4 py-2 hover:opacity-75 ease-in-out duration-200"
            >
              {loading ? <Loading /> : isConnected ? "Stake" : "Connect Wallet"}
            </button>
          </div>
          {/* <div className="w-full flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <p>You will receive</p>
              <p>
                {amount ? amount : 0} {tokens?.symbol}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Exchange rate</p>
              <p>1 ETH = 1 {tokens?.symbol}</p>
            </div>
            <div className="flex justify-between">
              <p>Max transaction cost</p>
              <p>$0.57</p>
            </div>
            <div className="flex justify-between">
              <p>Reward fee</p>
              <p>10%</p>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
}
