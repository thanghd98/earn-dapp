import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";

export const useReward = (adress: string, provider: string, stakeProvider: string) => {
    const { data: rewardsOnChain, isLoading: isLoadingRewardOnchain } = useQuery({
        queryKey: ["rewardsOnChain", provider, adress, stakeProvider],
        queryFn: async () => {
            return await earnSDK.getRewardsOnChain({
                delegatorAddress: adress,
                validatorAddress: stakeProvider,
                day: 7n, // Current day in seconds
                provider: provider
            }) as any;
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
        isLoadingRewardOnchain
    }
}