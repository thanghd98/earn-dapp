import { useForm } from "react-hook-form";
import { useAccount, useBalance } from "wagmi";
import { toast } from "react-toastify";
import { useReward } from "../hooks/useReward";
import { earnSDK } from "../services";
import { BadgeQuestionMark } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Loading } from "../components/Loading";
import { useState } from "react";
import { EarnSDK } from "../../packages/earn-sdk/src";

const sETH_CONTRACT_ADDRESS = "0x3508a952176b3c15387c97be809eaffb1982176a"; // stETH contract address

export function Stake() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, setValue, watch } = useForm();
    const amount = watch("amount");
  
    const { address, isConnected } = useAccount()
  
    const { data: ethBalance, isLoading: isLoadingNative } = useBalance({ address })
    const { data: sEthBalance, isLoading: isLoadingNonNative

     } = useBalance({ address, token: sETH_CONTRACT_ADDRESS })
  
    const { apr, isLoadingApr } = useReward(address as string)
  
    const onStaking = async (data: { amount: string }) => {
        setLoading(true);
      const result = await earnSDK.stake({
        amount: data.amount,
        provider: EarnSDK.providerNames.LidoProvider
      })
  
      toast.success(
        <div>
          <p className="font-sm">Transaction successfully</p>
          <p className="text-xs truncate max-w-[250px]">{result}</p>
        </div>,
        {
          onClick: () => {
            window.open(`https://hoodi.etherscan.io/tx/${result}`, "_blank");
          },
          position: 'bottom-right',
        }
      );

      setLoading(false);
    };
    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex flex-col gap-2">
                <h1 className="text-center text-4xl font-semibold">Stake ETH</h1>
                <p className="text-center">
                    Stake ETH and receive stETH while staking
                </p>
            </div>
            <form
            className="flex flex-col gap-4 justify-center items-center rounded-2xl border-2 border-[#212121] w-1/3 mt-8 p-4"
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            onSubmit={handleSubmit(onStaking)}
            >
            {
                isConnected && (
                <div className="w-full"> 
                    <div className="w-full flex justify-between items-center">
                    <div>
                        <p className="text-sm">Available to stake</p>
                        <p className="text-xl font-semibold">{isLoadingNative ? <Skeleton count={1}/> : `${(Number(ethBalance?.value) / 10 ** 18).toFixed(4)} ${ethBalance?.symbol}`}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm">Staked amount</p>
                        <p className="text-xl font-semibold">{isLoadingNonNative ? <Skeleton count={1}/> : `${(Number(sEthBalance?.value) / 10 ** 18).toFixed(4)} ${ethBalance?.symbol}`}</p>
                    </div>
                    </div>
        
                    <hr className="border-[#212121] w-full my-2" />
        
                    <div className="w-full flex justify-between items-center mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                        <p className="text-sm">Lido APR</p>
                        <BadgeQuestionMark />
                        </div>
                    </div>
                    <p className="text-xl font-semibold text-green-600">{isLoadingApr ? <Skeleton count={1} /> : apr?.toFixed(1)}%</p>
                    </div>
                </div>
                )
            }
            

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
                <button
                type="button"
                className="bg-black opacity-90 cursor-pointer backdrop-blur-sm text-white px-4 py-1 rounded hover:opacity-75 ease-in-out duration-200"
                onClick={() => setValue("amount", "Max")}
                >
                Max
                </button>
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
            <div className="w-full flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                <p>You will receive</p>
                <p>{amount ? amount : 0} stETH</p>
                </div>
                <div className="flex justify-between">
                <p>Exchange rate</p>
                <p>1 ETH = 1 stETH</p>
                </div>
                <div className="flex justify-between">
                <p>Max transaction cost</p>
                <p>$0.57</p>
                </div>
                <div className="flex justify-between">
                <p>Reward fee</p>
                <p>10%</p>
                </div>
            </div>
            </form>
        </div>
    )
}
