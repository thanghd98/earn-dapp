import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";

export const useWithdrawals = (adress: string) => {
    const { data: pendingRequests, isLoading: isLoadingPending } = useQuery({
        queryKey: ["getPendingRequest", "LidoProvider", adress],
        queryFn: async () => {
            return await earnSDK.getWithdrawalRequestsIds(adress, "LidoProvider");
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: claimableRequests } = useQuery({
        queryKey: ["getClaimablegRequest", "LidoProvider", adress],
        queryFn: async () => {
            return await earnSDK.getClaimableRequestsIds(adress, "LidoProvider");
        },
        enabled: !!adress,
        refetchInterval: 100 * 60 * 60, // 1 hour
    });

    const { data: timeEstimated } = useQuery({
        queryKey: ["getTimeEstimated", "LidoProvider", adress],
        queryFn: async () => {
            const ids = pendingRequests?.pendingRequests?.map((request) => request.id) || [];
            return await earnSDK.getClaimTimeEstimated(ids, "LidoProvider");
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