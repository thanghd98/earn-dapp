import { IStake, IUnstake } from "../types";

export abstract class BaseEarnProvider{
    //@ts-expect-error unused variable
    constructor(private _logger?: any, private _web3Provider?: any) {}
    public abstract name: string;
    public abstract stake(params: IStake): string | Promise<string>;
    public abstract unstake(params: IUnstake): Promise<string>;
    public abstract claim(requestsIds: bigint[]): Promise<string>;
    public abstract getTotalStakedBalance(): Promise<number>;
    public abstract getTotalUnstakedBalance(): Promise<number>;
    public abstract getUserStakedBalance(): Promise<number>;
    public abstract getStakingRewards(): Promise<string>;
    public abstract getStakingHistory(): Promise<unknown>;
}