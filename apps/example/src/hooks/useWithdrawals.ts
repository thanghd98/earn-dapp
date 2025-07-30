import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";
import { EarnSDK } from "../../packages/earn-sdk/src";

export const useWithdrawals = (adress: string) => {
    const { data: pendingRequests, isLoading: isLoadingPending } = useQuery({
        queryKey: ["getPendingRequest", "LidoProvider", adress],
        queryFn: async () => {
            return await earnSDK.getWithdrawalRequestsIds(adress, EarnSDK.providerNames.LidoProvider);
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: claimableRequests } = useQuery({
        queryKey: ["getClaimablegRequest", "LidoProvider", adress],
        queryFn: async () => {
            return await earnSDK.getClaimableRequestsIds(adress, EarnSDK.providerNames.LidoProvider);
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: timeEstimated } = useQuery({
        queryKey: ["getTimeEstimated", "LidoProvider", adress],
        queryFn: async () => {
            const ids = pendingRequests?.pendingRequests?.map((request: any) => request.id) || [];
            return await earnSDK.getClaimTimeEstimated(ids, EarnSDK.providerNames.LidoProvider);
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