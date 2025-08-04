import { Transaction } from "@chorus-one/ethereum";
import { CoinType, EIP1193Provider, IClaim, IClaimableRequests, IClaimableResults, IStake, ITokenMetadata, ITotalStakedBalance, IUnstake, IWithdrawalRequests, IWithdrawalResults } from "../types";

export abstract class BaseEarnProvider{
    //@ts-expect-error unused variable
    constructor(private _logger?: Logger, private _web3Provider?: EIP1193Provider) {}
    public abstract name: string;
    public abstract stake(params: IStake): Promise<string | Transaction>;
    public abstract unstake(params: IUnstake): Promise<string | Transaction>;
    public abstract claim(params: IClaim): Promise<string | Transaction>;
    public abstract getTotalStakedBalance(params: ITotalStakedBalance): Promise<ITokenMetadata>;
    public abstract getTotalUnstakedBalance(): Promise<number>;
    public abstract getUserStakedBalance(): Promise<number>;
    public abstract getStakingRewards(): Promise<string>;
    public abstract getStakingHistory(): Promise<unknown>;
    public abstract getTokenAvailable(): Promise<CoinType>;
    public abstract getWithdrawalRequests(params: IWithdrawalRequests): Promise<IWithdrawalResults>;
    public abstract getClaimableRequests(params: IClaimableRequests): Promise<IClaimableResults>;
}