import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";

export const useStake = (address: string, provider: string, validatorAddress?: string) => {
    const { data: totalStakedBalance, isLoading: isLoadingTotalStaked } = useQuery({
        queryKey: ["getTotalStakedBalance", provider, address],
        queryFn: async () => {
            return await earnSDK.getTotalStakedBalance({
                address,
                validatorAddress: validatorAddress,
                provider,
            });
        },
        enabled: !!address,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: tokens, isLoading: isLoadingTokens } = useQuery({
        queryKey: ["getTokenAvailable", provider, address],
        queryFn: async () => {
            return await earnSDK.getTokenAvailable(provider);
        },
        enabled: !!address,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: validators, isLoading: isLoadingValidator } = useQuery({
        queryKey: ["getValidatorInformation", provider, address, validatorAddress],
        queryFn: async () => {
            return await earnSDK.getValidatorInformation(provider);
        },
        enabled: !!address,
        refetchInterval: 100 * 60 * 60, // 1 hour
    }); 

    return {
        totalStakedBalance,
        validators,
        tokens,
        isLoadingTokens,
        isLoadingValidator,
        isLoadingTotalStaked
    }
}