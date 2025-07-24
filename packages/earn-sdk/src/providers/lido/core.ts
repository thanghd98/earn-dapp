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
            chainId: 560048,
            rpcUrls: ["https://rpc.hoodi.ethpandaops.io"],
            //@ts-expect-error
            web3Provider: LidoSDKCore.createWeb3Provider(560048, window.ethereum)
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

    public async getAverageAPR(): Promise<number> {
        try {
            const smaApr = await this.sdk.statistics.apr.getSmaApr({ days: 7 })

            return smaApr;
        } catch (error) {
            console.log("🚀 ~ LidoProvider ~ getAverageAPR ~ error:", error)
            return 0
        }
    }

    // public async getEstimatedFee(params: IStake): Promise<number> {
    //     const { referralAddress, amount } = params
    //     console.log("🚀 ~ LidoProvider ~ getEstimatedFee ~ amount:", amount)
    //     console.log("🚀 ~ LidoProvider ~ getEstimatedFee ~ referralAddress:", referralAddress)
    //     try {
    //         const stakeEstimated = await this.sdk.stake.stakeEthEstimateGas(
    //             {
    //                 value: amount,
    //                 referralAddress: referralAddress as any,
    //             }
    //         );
    //         console.log("🚀 ~ LidoProvider ~ getEstimatedFee ~ stakeEstimated:", stakeEstimated)

    //         return Number(stakeEstimated); // Return the estimated gas price
    //     } catch (error) {
    //         console.log("🚀 ~ LidoProvider ~ getEstimatedFee ~ error:", error)
    //         return 0
    //     }
    // }

    // public async getRewardsOnChain(address: string, day: bigint = 7n): Promise<void> {
    //     const rewardsQuery = await this.sdk.rewards.getRewardsFromChain({
    //         address: address as any,
    //         stepBlock: 10000, // defaults to 50000, max block range per 1 query
    //         back: {
    //           days: day, // defaults to 7 days
    //         },
    //       });
          
    //       console.log(rewardsQuery.rewards);
    // }
}

// public async getRewardsOnChain(address: string, day: bigint = 7n): Promise<GetRewardsFromChainResult> {
//     console.log("🚀 ~ LidoProvider ~ getRewardsOnChain ~ day:", day)
//     console.log("🚀 ~ LidoProvider ~ getRewardsOnChain ~ address:", address)
//     try {
//         const rewardsQuery = await this.sdk.rewards.getRewardsFromChain({
//             address: address as any,
//             stepBlock: 10,
//             back: {
//               days: day,
//             },
//           });
//         console.log("🚀 ~ LidoProvider ~ getRewardsOnChain ~ rewardsQuery:", rewardsQuery)
        
    //         return rewardsQuery;
        
    //     } catch (error) {
//         console.log("🚀 ~ LidoProvider ~ getRewardsOnChain ~ error:", error)
//         throw new Error(`Failed to get rewards on chain: ${(error as SDKError).errorMessage}`);
//     }
// }



// console.log("🚀 ~ LidoProvider ~ getAverageAPR ~ smaApr:", smaApr)
// const response = await fetch('https://eth-api-hoodi.testnet.fi/v1/protocol/steth/apr/sma');

// const { data } = await response.json();
// console.log("🚀 ~ LidoProvider ~ getAverageAPR ~ data:", data)

// const rewards = data.aprs;

// // const now = Math.floor(Date.now() / 1000); // current time in seconds
// // const sevenDaysAgo = now - 7 * 24 * 60 * 60;

// // const recentAPR = aprs.filter((item: any) => item.timeUnix >= sevenDaysAgo);
// // console.log("🚀 ~ LidoProvider ~ getAverageAPR ~ recentAPR:", recentAPR)

// const totalAPR = rewards.reduce(
//     (acc: number, reward: any) => acc + reward.apr,
//     0,
// );