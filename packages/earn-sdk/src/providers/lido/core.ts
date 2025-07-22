import { LidoSDK, AccountValue, StakeProps } from '@lidofinance/lido-ethereum-sdk'
import { WalletClient } from "viem";
import { BaseEarnProvider } from '../../core';
import { Logger } from '../../libs';
import { CoinType, EIP1193Provider, IStakeBalance } from '../../types';

export class LidoProvider extends BaseEarnProvider {
    public name: string = "Lido";
    private sdk: LidoSDK;
    private referralAddress = "0xe3265e1F8Ca72Fd44D5AC0c26eD48875a294C81e"

    constructor(private logger?: Logger, private web3Provider?: EIP1193Provider) {
        super(logger, web3Provider);
        console.debug('fwejoifjewofjewiofjewofjewfjiowejifowjefiowejfiowejio')
        this.sdk = new LidoSDK({
            chainId: 17000,
            rpcUrls: ["https://ethereum-holesky-rpc.publicnode.com"],
            web3Provider: this.web3Provider as unknown as WalletClient,
        })
    }

    public getTokenAvailable(){
        return new CoinType("ETH", "Ethereum", 18, "0x0000000000000000000000000000000000000000")
    }

    public async stake(_account: string = this.referralAddress): Promise<string> {
        // Implementation for staking with Lido
        this.logger?.info(`Staking with ${this.name}`);


        const balanace = await this.sdk.core.balanceETH("0xE15c5D59Cf5ff8f86Fef33e5E3F806Ca06aaaD0D")
        
        const address = await this.sdk.core.web3Provider?.request({ method: "eth_requestAccounts"})
        
        if (!address || !Array.isArray(address) || address.length === 0) {
            throw new Error("No account found");
        }

        console.log(`🐳 -> stake -> balanace:`, {balanace,address})

        const stakeProps: StakeProps = {
            value: "0.0001", // Amount of ETH to stake
            callback: () => { },
            referralAddress: this.referralAddress as unknown as any, // Optional referral address
            account: address[0] as AccountValue,
        }

        const stakeTx = await this.sdk.stake.stakeEth(stakeProps)

        if (stakeTx.result) {
            const { stethReceived, sharesReceived } = stakeTx.result;
            this.logger?.success(`Staked successfully: ${stethReceived} stETH received, ${sharesReceived} shares received`);
        }
        return stakeTx.hash;
    }

    public unstake(): void {
        // Implementation for unstaking with Lido
    }

    public claim(): void {
        // Implementation for claiming rewards with Lido
    }

    public async getStakedBalance():  Promise<IStakeBalance>{
        const currentBalance = this.sdk.core.balanceETH();
        this.logger?.info(`Current ETH balance: ${currentBalance}`);
        return {} as IStakeBalance; // Return the staked balance
        
    }

    public async getUnstakedBalance(): Promise<IStakeBalance> {
        // Implementation to get unstaked balance with Lido
        return {} as IStakeBalance;
    }

    public async getStakingRewards(): Promise<string> {
        // Implementation to get staking rewards with Lido
        return "";
    }

    public async getStakingHistory(): Promise<unknown> {
        // Implementation to get staking history with Lido
        return {};
    }
}