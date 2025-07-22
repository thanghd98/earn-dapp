import { LidoSDK ,TransactionCallbackStage, SDKError, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk'
import { BaseEarnProvider } from '../../core';
import { Logger } from '../../libs';
import { CoinType, EIP1193Provider, IStake, IUnstake } from '../../types';

export class LidoProvider extends BaseEarnProvider {
    public name: string = "Lido";
    private sdk: LidoSDK;

    //@ts-expect-error
    constructor(private logger?: Logger, private web3Provider?: EIP1193Provider) {
        super(logger, web3Provider);
        this.sdk = new LidoSDK({
            chainId: 17000,
            rpcUrls: ["https://ethereum-holesky-rpc.publicnode.com"],
            //@ts-expect-error
            web3Provider: LidoSDKCore.createWeb3Provider(17000, window.ethereum)
        })
    }

    public getTokenAvailable(){
        return new CoinType("ETH", "Ethereum", 18, "0x0000000000000000000000000000000000000000")
    }

    public async stake(params: IStake): Promise<string> {
        const { referralAddress, amount } = params
        
        const callback = ({ stage, payload }: { stage: TransactionCallbackStage; payload?: unknown }) => {
            switch (stage) {
                case TransactionCallbackStage.SIGN:
                    console.log('wait for sign');
                    break;
                case TransactionCallbackStage.RECEIPT:
                    console.log('wait for receipt');
                    if (payload) {
                        console.log(payload, 'transaction hash');
                    }
                    break;
                case TransactionCallbackStage.CONFIRMATION:
                    console.log('wait for confirmation');
                    if (payload) {
                        console.log(payload, 'transaction receipt');
                    }
                    break;
                case TransactionCallbackStage.DONE:
                    console.log('done');
                    if (payload) {
                        console.log(payload, 'transaction confirmations');
                    }
                    break;
                case TransactionCallbackStage.ERROR:
                    console.log('error');
                    if (payload) {
                        console.log(payload, 'error object with code and message');
                    }
                    break;
                default:
            }
        };

        try {
            const stakeTx = await this.sdk.stake.stakeEth({
                value: amount,
                callback,
                referralAddress: referralAddress as any,
            });

            return stakeTx.hash; // Return the transaction hash
        } catch (error) {
            throw new Error(`Failed to stake with Lido: ${(error as SDKError).errorMessage}`);
        }
    }

    public async unstake(params: IUnstake): Promise<string> {
        const { amount, token } = params;
        // Implementation for unstaking with Lido
        const callback = ({ stage, payload }: { stage: TransactionCallbackStage; payload?: unknown }) => {
            switch (stage) {
                case TransactionCallbackStage.PERMIT:
                    console.log('wait for permit');
                    break;
                case TransactionCallbackStage.GAS_LIMIT:
                    console.log('wait for gas limit');
                    break;
                case TransactionCallbackStage.SIGN:
                    console.log('wait for sign');
                    break;
                case TransactionCallbackStage.RECEIPT:
                    console.log('wait for receipt');
                    console.log(payload, 'transaction hash');
                    break;
                case TransactionCallbackStage.CONFIRMATION:
                    console.log('wait for confirmation');
                    console.log(payload, 'transaction receipt');
                    break;
                case TransactionCallbackStage.DONE:
                    console.log('done');
                    console.log(payload, 'transaction confirmations');
                    break;
                case TransactionCallbackStage.MULTISIG_DONE:
                    console.log('multisig_done');
                    console.log(payload, 'transaction confirmations');
                    break;
                case TransactionCallbackStage.ERROR:
                    console.log('error');
                    console.log(payload, 'error object with code and message');
                    break;
                default:
            }
        };

        try {
            //@ts-expect-error
            const requestTx = await this.sdk.withdraw.request.requestWithdrawalWithPermit({
                amount,
                token: token as  'stETH' | 'wstETH', // 'stETH' | 'wstETH'
                callback,
            });   

            return requestTx.hash; // Return the transaction hash
        } catch (error) {
            throw new Error(`Failed to unstake with Lido: ${(error as SDKError).errorMessage}`);
        }
    }

    public claim(): void {
        // Implementation for claiming rewards with Lido
    }

    public async getTotalStakedBalance():  Promise<number>{
        const currentBalance = this.sdk.core.balanceETH();
        this.logger?.info(`Current ETH balance: ${currentBalance}`);
        return 0; // Return the staked balance
        
    }

    public async getTotalUnstakedBalance(): Promise<number> {
        // Implementation to get unstaked balance with Lido
        return 0;
    }

    public async getUserStakedBalance(): Promise<number> {
        return 0;
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