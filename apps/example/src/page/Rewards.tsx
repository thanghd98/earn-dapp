import { useAccount, useBalance } from "wagmi"
import { Clipboard } from "lucide-react";
import { useReward } from "../hooks/useReward";

const sETH_CONTRACT_ADDRESS = "0x3508a952176b3c15387c97be809eaffb1982176a"; // stETH contract address

export function Rewards() {
  const { address } = useAccount()
  
  const { data: sEthBalance } = useBalance({ address, token: sETH_CONTRACT_ADDRESS })

  const { rewardsOnChain, aprRewards } = useReward(address as string)
  console.log("🚀 ~ Rewards ~ aprRewards:", aprRewards)
  console.log("🚀 ~ Rewards ~ rewardsOnChain:", rewardsOnChain)
  
  return (
    <div className="p-8 flex flex-col items-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-4xl font-semibold">Reward History</h1>
        <p className="text-center">
          Track your Ethereum staking rewards with Lido
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
            <p>{address}</p>
          </div>
          <Clipboard className=" cursor-pointer " />
        </div>
        <div className="flex w-full justify-between items-center gap-2 border-t rounded-2xl p-4">
          <div>
            <p className="text-sm">stETH balance</p>
            <p className="font-semibold">{(Number(sEthBalance?.value) / 10 ** 18).toFixed(8)} stETH</p>
          </div>
         
          <div>
            <p className="text-sm">stETH rewarded</p>
            <p className="font-semibold">{(Number(rewardsOnChain?.totalRewards) / 10 ** 18).toFixed(8)} stETH</p>
          </div>

          <div>
            <p className="text-sm">Average APR</p>
            <p className="font-semibold text-green-600">{Number(aprRewards).toFixed(1)}%</p>
          </div>
        </div>
      </div>

        <table className="table-auto border-collapse border border-gray-300 mt-8 w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Change</th>
              <th className="border border-gray-300 px-4 py-2 text-left">APR</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            {              
              rewardsOnChain?.rewards?.slice()?.reverse()?.map((reward: any) => {
                const type = {
                  submit: "Staking",
                  rebase: "Reward",
                }
                const dateNumber = Number(reward?.originalEvent?.blockTimestamp || reward?.originalEvent?.args?.reportTimestamp);
                const date = new Date(dateNumber * 1000);
                const formatted = date.toLocaleDateString('vi-VN')

                return (
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{formatted}</td>
                    <td className="border border-gray-300 px-4 py-2">{type[reward.type]}</td>
                    <td className="border border-gray-300 px-4 py-2 text-green-600">{(Number(reward.change) / 10**18).toFixed(8)}</td>
                    <td className="border border-gray-300 px-4 py-2">{reward.apr || "-"}</td>
                    <td className="border border-gray-300 px-4 py-2">{(Number(reward.balance) / 10**18).toFixed(8)}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
  )
}
