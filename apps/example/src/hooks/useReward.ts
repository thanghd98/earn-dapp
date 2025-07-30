import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";
import { EarnSDK } from "../../packages/earn-sdk/src";

export const useReward = (adress: string) => {
    const { data: apr, isLoading: isLoadingApr } = useQuery({
        queryKey: ["averageAPR", "LidoProvider", adress],
        queryFn: async () => {
            return await earnSDK.getAverageAPR(EarnSDK.providerNames.LidoProvider);
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: rewardsOnChain, isLoading: isLoadingRewardOnchain } = useQuery({
        queryKey: ["rewardsOnChain", "LidoProvider", adress],
        queryFn: async () => {
            return await earnSDK.getRewardsOnChain(adress as string, 7n, EarnSDK.providerNames.LidoProvider) as any;
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const aprRewards = rewardsOnChain?.rewards?.reduce((acc: any, reward: any) => {
        return acc + (reward.apr || 0);
    }, 0);

    const rebaseApr = rewardsOnChain?.rewards?.filter((reward: any) => reward.type === "rebase") || [];

    return {
        rewardsOnChain,
        aprRewards: aprRewards / rebaseApr?.length || 0 , // Average APR across all rewards
        apr,
        isLoadingApr,
        isLoadingRewardOnchain
    }
}