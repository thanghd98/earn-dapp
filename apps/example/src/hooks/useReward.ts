import { useQuery } from "@tanstack/react-query";
import { earnSDK } from "../services";

export const useReward = () => {
    const { data: rewardApr } = useQuery({
        queryKey: ["averageAPR", "LidoProvider"],
        queryFn: async () => {
      
        return await earnSDK.getAverageAPR("LidoProvider");
        },
    });

    return {
        rewardApr
    }
}