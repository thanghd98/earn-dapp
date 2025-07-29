import * as providers from './providers'
console.log("🚀 ~ providers:", providers)
import { BaseEarnProvider } from './core';
import { Logger } from './libs';
import { EIP1193Provider, InitParams } from './types/common';
import { IStake, IUnstake } from './types';

export class EarnSDK {
    private logger = new Logger('EarnSDK')
    // Stake Provider
    private providers = new Map<string, BaseEarnProvider>();
    // Web3 provider
    private web3Provider: EIP1193Provider | undefined;

    constructor(initParams: InitParams) {
        this.logger = new Logger('EarnSDK', !!initParams?.debug);
        this.logger.info('Initializing EarnSDK with parameters:');
        this.web3Provider = initParams?.provider;
        this.initBuiltInProvider();
    }

    public async stake(params: IStake & { provider: string }) {
        const { provider, ...rest } = params
        this.logger.info(provider);
        console.log("🚀 ~ EarnSDK ~ stake ~ provider:", provider)
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return;
        }
        this.logger.success(`Staking with provider: ${provider}`);
        return await earnProvider.stake(rest);
    }

    public async unstake(params: IUnstake & { provider: string }) {
        // Implementation for unstaking with Lido
        const { provider, ...rest } = params
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return;
        }
        this.logger.success(`Staking with provider: ${provider}`);
        return await earnProvider.unstake(rest);
    }

    public async getWithdrawalRequestsIds(address: string, provider: string ) {
        // Implementation for unstaking with Lido
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return;
        }
        this.logger.success(`Staking with provider: ${provider}`);
        //@ts-expect-error
        return await earnProvider.getWithdrawalRequestsIds(address);
    }

    public async getClaimableRequestsIds(address: string, provider: string ) {
        // Implementation for unstaking with Lido
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return;
        }
        this.logger.success(`Staking with provider: ${provider}`);
        //@ts-expect-error
        return await earnProvider.getClaimableRequestsIds(address);
    }

    public async getClaimTimeEstimated(ids: string[], provider: string ) {
        // Implementation for unstaking with Lido
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return;
        }
        this.logger.success(`Staking with provider: ${provider}`);
        //@ts-expect-error
        return await earnProvider.getClaimTimeEstimated(ids);
        
    }

    public async getRewardsOnChain(adress: string, days: bigint, provider: string) : Promise<number> {
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return 0;
        }
        //@ts-expect-error
        return await earnProvider.getRewardsOnChain(adress, days);
    }

    public async getAverageAPR(provider: string) : Promise<number> {
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return 0;
        }
        //@ts-expect-error
        return await earnProvider.getAverageAPR();
    }

    public async claim(requestIds: bigint[], provider: string): Promise<string> {
        // Implementation for claiming rewards with Lido
         // Implementation for unstaking with Lido
         const earnProvider = this.providers.get(provider);
         if (!earnProvider) {
             this.logger.error(`Provider ${provider} not found`);
             return '';
         }
         this.logger.success(`Staking with provider: ${provider}`);
         return await earnProvider.claim(requestIds);
    }

    public async getTotalStakedBalance(): Promise<number> {
        // Implementation to get staked balance with Lido
        return 0
    }

    public async getTotalUnstakedBalance(): Promise<number> {
        // Implementation to get unstaked balance with Lido
        return 0
    }

    public async getUserStakedBalance(): Promise<number> {
        // Implementation to get user staked balance with Lido
        return 0
    }

    public getStakingRewards(): void {
        // Implementation to get staking rewards with Lido
    }

    public getStakingHistory(): void {
        // Implementation to get staking history with Lido
    }

    private initBuiltInProvider() {
        // Initialize built-in providers
        Object.values(providers).map(provider => {
            const createdProvider = new provider(this.logger, this.web3Provider)
            this.providers.set(provider.name, createdProvider as unknown as BaseEarnProvider)
        })

        this.logger.info(`Initialized built-in providers: ${Array.from(this.providers.keys()).join(', ')}`);
    }
}