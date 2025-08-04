import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";

export const useWithdrawals = (adress: string, validatorAddress?: string, provider: string) => {
    const { data: pendingRequests, isLoading: isLoadingPending } = useQuery({
        queryKey: ["getWithdrawalRequests", provider, adress, validatorAddress],
        queryFn: async () => {
            return await earnSDK.getWithdrawalRequests({
                address: adress,
                validatorAddress: validatorAddress,
                provider: provider
            });
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: claimableRequests } = useQuery({
        queryKey: ["getClaimablegRequest", provider, adress, validatorAddress],
        queryFn: async () => {
            return await earnSDK.getClaimableRequests({
                address: adress,
                validatorAddress: validatorAddress,
                provider: provider
            });
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: timeEstimated } = useQuery({
        queryKey: ["getTimeEstimated", provider, adress],
        queryFn: async () => {
            const ids = pendingRequests?.pendingRequests?.map((request: any) => request.id) || [];
            return await earnSDK.getClaimTimeEstimated(ids, provider);
        },
        enabled: !!pendingRequests?.pendingRequests?.length,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    return {
        pendingRequests,
        claimableRequests,
        timeEstimated,
        isLoadingPending
    }
}