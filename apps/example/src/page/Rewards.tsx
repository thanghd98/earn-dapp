import { useAccount, useBalance } from "wagmi";
import { Clipboard } from "lucide-react";
import { useReward } from "../hooks/useReward";
import Skeleton from "react-loading-skeleton";
import { useProvider, useStakeProvider } from "../hooks/useProvider";
import { Loading } from "../components/Loading";

const sETH_CONTRACT_ADDRESS = "0x3508a952176b3c15387c97be809eaffb1982176a"; // stETH contract address

export function Rewards() {
  const { address } = useAccount();
  const { provider } = useProvider()
  const { stakeProvider } = useStakeProvider()
  console.log("🚀 ~ Rewards ~ stakeProvider:", stakeProvider)

  const { rewardsOnChain, isLoadingRewardOnchain } = useReward(
    address as string,
    provider,
    stakeProvider
  );
  

  return (
    <div className=" w-full flex flex-col items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Reward History</h1>
        <p className="text-center">
          Track your Ethereum staking rewards
        </p>
      </div>
      <div className=" flex flex-col gap-4 justify-center items-center rounded-2xl border bor w-1/2 mt-8">
        <div className="w-full flex items-center justify-between px-8 py-4 rounded-2xl">
          <div className="w-full flex items-center gap-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ0t93Uo6khtOycVpju5d2chs5jWUPt6m2NQ&s"
              alt=""
              width={40}
              className="rounded-full"
            />
            <p className="truncate">{address}</p>
          </div>
          <Clipboard className=" cursor-pointer " />
        </div>
        <div className="flex w-full justify-between items-center gap-2 border-t rounded-2xl p-4">
          {/* <div>
            <p className="text-sm">stETH balance</p>
            {isLoadingBalance ? (
              <Skeleton count={1} />
            ) : (
              <p className="font-semibold">
                {(Number(sEthBalance?.value) / 10 ** 18).toFixed(8)} stETH
              </p>
            )}
          </div> */}

          <div className="flex w-full justify-between items-center gap-2">
            <p className="text-sm">Total rewarded</p>
            
              <p className="font-semibold text-green-600">
                {
                  isLoadingRewardOnchain ? <Skeleton count={1} /> : (
                    (Number(rewardsOnChain?.totalRewards) / 10 ** 18).toFixed(8)
                  )
                }
              </p>
          </div>
        </div>
      </div>
      {
        isLoadingRewardOnchain ? (
          <div className="p-8">
            <Loading />
          </div>
        ): (
<table className="table-auto border-collapse border border-gray-300 mt-8 w-full h-1/2 overflow-scroll">
        <thead>
          <tr className="bg-black text-center">
            <th className="border border-gray-300 px-4 py-2 text-center">
              Date
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Type
            </th>
            <th className="border border-gray-300 px-4 py-2 text-center">
              Change
            </th>
          </tr>
        </thead>
        <tbody>
          {rewardsOnChain?.rewards
            ?.slice()
            ?.reverse()
            ?.map((reward: { type: "submit" | "rebase" | "withdrawal"; change: string; balance: string; apr?: string; originalEvent?: { blockTimestamp?: string; args?: { reportTimestamp?: string } } }) => {
              console.log("🚀 ~ reward:", reward)
              const type: { [key in "submit" | "rebase" | "withdrawal"]: string } = {
                submit: "Staking",
                rebase: "Reward",
                withdrawal: "Withdrawal",
              };
              const date = new Date(reward.timestamp * 1000);
              const formatted = date.toLocaleDateString("vi-VN");

              return (
                <tr className="hover:bg-gray-800">
                  <td className="border border-gray-300 px-4 py-2">
                    {formatted}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {type[reward.type]}
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 ${
                      Number(reward.amount) > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    +{(Number(reward.amount) / 10 ** 18).toFixed(8)}
                  </td>
                  
                </tr>
              );
            })}
        </tbody>
      </table>
        )
      }
      
      
    </div>
  );
}
