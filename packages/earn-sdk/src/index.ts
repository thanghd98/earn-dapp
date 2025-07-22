import * as providers from './providers'
import { BaseEarnProvider } from './core';
import { Logger } from './libs';
import { EIP1193Provider, InitParams } from './types/common';

export class EarnSDK {
    private logger = new Logger('EarnSDK')
    // Stake Provider
    private providers = new Map<string, BaseEarnProvider>();
    // Web3 provider
    private web3Provider: EIP1193Provider | undefined;

    constructor(initParams: InitParams) {
        this.logger = new Logger('EarnSDK', !!initParams?.debug);
        this.web3Provider = initParams?.provider;
        this.initBuiltInProvider();
    }

    public async stake(provider: string) {
        const earnProvider = this.providers.get(provider);
        if (!earnProvider) {
            this.logger.error(`Provider ${provider} not found`);
            return;
        }
        await earnProvider.stake();
        this.logger.success(`Staking with provider: ${provider}`);
    }

    public unstake(): void {
        // Implementation for unstaking with Lido
    }

    public claim(): void {
        // Implementation for claiming rewards with Lido
    }

    public getStakedBalance(): void {
        // Implementation to get staked balance with Lido
    }

    public getUnstakedBalance(): void {
        // Implementation to get unstaked balance with Lido
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