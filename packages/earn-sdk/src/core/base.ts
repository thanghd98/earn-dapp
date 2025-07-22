import { IStakeBalance } from "../types";

export abstract class BaseEarnProvider{
    //@ts-expect-error unused variable
    constructor(private _logger?: any, private _web3Provider?: any) {}
    public abstract name: string;
    public abstract stake(account?: string): string | Promise<string>;
    public abstract unstake(): void;
    public abstract claim(): void;
    public abstract getStakedBalance(): Promise<IStakeBalance>;
    public abstract getUnstakedBalance(): Promise<IStakeBalance>;
    public abstract getStakingRewards(): Promise<string>;
    public abstract getStakingHistory(): Promise<unknown>;
}