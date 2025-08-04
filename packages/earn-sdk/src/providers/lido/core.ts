import {
  LidoSDK,
  TransactionCallbackStage,
  SDKError,
  LidoSDKCore,
} from '@lidofinance/lido-ethereum-sdk';
import { BaseEarnProvider } from '../../core';
import { Logger } from '../../libs';
import {
  CoinType,
  EIP1193Provider,
  IClaim,
  IClaimableRequests,
  IClaimableResults,
  IInformation,
  IStake,
  IStakingRewardRequest,
  IStakingRewardResponse,
  ITokenMetadata,
  ITotalStakedBalance,
  IUnstake,
  IWithdrawalRequests,
  IWithdrawalResults,
} from '../../types';

export class LidoProvider extends BaseEarnProvider {
  public name: string = 'Lido';
  private sdk: LidoSDK;

  //@ts-expect-error
  constructor(private logger?: Logger, private web3Provider?: EIP1193Provider) {
    super(logger, web3Provider);
    this.sdk = new LidoSDK({
      chainId: 560048,
      rpcUrls: ['https://rpc.hoodi.ethpandaops.io'],
      //@ts-expect-error
      web3Provider: LidoSDKCore.createWeb3Provider(560048, window.ethereum),
    });
  }

  public async getTokenAvailable(): Promise<CoinType> {
    //@ts-expect-error
    const metadata = await this.sdk.steth.erc20Metadata();
    if (!metadata) {
      throw new Error('Failed to fetch token metadata');
    }
    return new CoinType(
      metadata.symbol,
      metadata.name,
      metadata.decimals,
      metadata.domainSeparator
    );
  }

  public async stake(params: IStake): Promise<string> {
    const { referralAddress, amount } = params;

    const callback = ({
      stage,
      payload,
    }: {
      stage: TransactionCallbackStage;
      payload?: unknown;
    }) => {
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
        referralAddress: referralAddress as string,
      });

      return stakeTx.hash; // Return the transaction hash
    } catch (error) {
      throw new Error(
        `Failed to stake with Lido: ${(error as SDKError).errorMessage}`
      );
    }
  }

  public async unstake(params: IUnstake): Promise<string> {
    const { amount, token } = params;
    // Implementation for unstaking with Lido
    const callback = ({
      stage,
      payload,
    }: {
      stage: TransactionCallbackStage;
      payload?: unknown;
    }) => {
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
      const requestTx = await this.sdk.withdraw.request.requestWithdrawalWithPermit(
        {
          amount,
          token: token as 'stETH' | 'wstETH', // 'stETH' | 'wstETH'
          callback,
        }
      );

      return requestTx.hash; // Return the transaction hash
    } catch (error) {
      throw new Error(
        `Failed to unstake with Lido: ${(error as SDKError).errorMessage}`
      );
    }
  }

  public async getWithdrawalRequests(params: IWithdrawalRequests): Promise<IWithdrawalResults> {
    const { address } = params
    try {
      const requests = await this.sdk.withdraw.requestsInfo.getPendingRequestsInfo(
        {
          account: address as string,
        }
      );

      const ids = requests.pendingRequests.map(request =>
        Number(request.id).toString()
      );

      const timeEstimated = await this.getClaimTimeEstimated(ids);

      const pendingRequests = requests.pendingRequests.map(request => {
        const findRequest = timeEstimated?.find(
          (item: any) =>
            Number(item?.requestInfo?.requestId) === Number(request?.id)
        );

        const requestedAt = new Date().getTime();
        const finalizationAt = new Date(
          findRequest?.requestInfo?.finalizationAt
        );

        const diffMs = Number(finalizationAt) - Number(requestedAt);
        const diffHours = diffMs / (1000 * 60 * 60);

        return {
          amount: Number(request.amountOfStETH),
          id: Number(request.id),
          isFinalized: request.isFinalized,
          owner: address,
          timestamp: diffHours,
        };
      });

      return {
        pendingAmount: Number(requests.pendingAmountStETH),
        pendingRequests,
      };
    } catch (error) {
      console.error('Error fetching withdrawal requests IDs:', error);
      throw new Error(
        `Failed to get withdrawal requests IDs: ${
          (error as SDKError).errorMessage
        }`
      );
    }
  }

  public async getClaimableRequests(params: IClaimableRequests): Promise<IClaimableResults> {
    const { address } = params

    try {
      const requests = await this.sdk.withdraw.requestsInfo.getClaimableRequestsInfo(
        {
          account: address as string,
        }
      );

      const claimAmount = Number(requests.claimableAmountStETH);

      const claimRequests = requests.claimableRequests.map(request => {
        return {
          amount: Number(request.amountOfStETH),
          id: Number(request.id),
          isFinalized: request.isFinalized,
          owner: address,
          timestamp: Number(request.timestamp),
        };
      });
      return {
        claimAmount,
        claimRequests,
      };
    } catch (error) {
      console.error('Error fetching withdrawal requests IDs:', error);
      throw new Error(
        `Failed to get withdrawal requests IDs: ${
          (error as SDKError).errorMessage
        }`
      );
    }
  }

  public async claim(params: IClaim): Promise<string> {
    const { data } = params
    // Implementation for claiming rewards with Lido

    const callback = ({
      stage,
      payload,
    }: {
      stage: TransactionCallbackStage;
      payload?: unknown;
    }) => {
      switch (stage) {
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
        case TransactionCallbackStage.ERROR:
          console.log('error');
          console.log(payload, 'error object with code and message');
          break;
        default:
      }
    };

    try {
      const claimRequestFilter =
        (await data.requests.filter((request: any) => request.isFinalized)) ||
        [];

      const ids = claimRequestFilter.map((request: any) => request.id);
      const claimTx = await this.sdk.withdraw.claim.claimRequests({
        requestsIds: ids,
        callback,
      });

      return claimTx.hash; // Return the transaction hash
    } catch (error) {
      throw new Error(
        `Failed to claim with Lido: ${(error as SDKError).errorMessage}`
      );
    }
  }

  public async getTotalStakedBalance(
    params: ITotalStakedBalance
  ): Promise<ITokenMetadata> {
    const { address } = params;
    try {
      const currentBalance = await this.sdk.steth.balance(address as any);
      //@ts-expect-error
      const metadata = await this.sdk.steth.erc20Metadata();

      return {
        balance: Number(currentBalance).toString(),
        coin: new CoinType(
          metadata.symbol,
          metadata.name,
          metadata.decimals,
          metadata.domainSeparator
        ),
      };
    } catch (error) {
      throw new Error(
        `Failed to get total staked balance: ${
          (error as SDKError).errorMessage
        }`
      );
    }
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
    return '';
  }

  public async getStakingHistory(): Promise<unknown> {
    // Implementation to get staking history with Lido
    return {};
  }

  public async getAverageAPR(): Promise<number> {
    try {
      const smaApr = await this.sdk.statistics.apr.getSmaApr({ days: 7 });

      return smaApr;
    } catch (error) {
      return 0;
    }
  }

  public async getRewardsOnChain(params: IStakingRewardRequest): Promise<IStakingRewardResponse> {
    const { delegatorAddress, day } = params;
    try {
      const rewardsQuery = await this.sdk.rewards.getRewardsFromChain({
        address: delegatorAddress as string,
        stepBlock: 10000, // defaults to 50000, max block range per 1 query
        back: {
          days: BigInt(day), // defaults to 7 days
        },
      });

      const result = rewardsQuery.rewards.map(reward => ({
        amount: Number(reward.change),
        timestamp: Number(
          //@ts-expect-error
          reward?.originalEvent?.blockTimestamp ||
            'reportTimestamp' in (reward?.originalEvent?.args || {}) ? reward.originalEvent.args.reportTimestamp : undefined
        ),
        txHash: reward.originalEvent.transactionHash,
        type: reward.type,
      }));
      console.log("🚀 ~ LidoProvider ~ getRewardsOnChain ~ result:", result)

      const totalRewards = result.reduce(
        (acc: number, reward: any) => acc + Number(reward.amount),
        0
      );

      return {
        totalRewards,
        rewards: result.filter(
        (reward: any) => reward.type === 'rebase' && reward.amount > 0)
      };
    } catch (error) {
     throw new Error(
        `Failed to get rewards on chain: ${(error as SDKError).errorMessage}`
      );
    }
  }

  public async getValidatorInformation(): Promise<{ vault: IInformation }[]> {
    const apr = await this.getAverageAPR();

    return [
      {
        vault: {
          address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
          name: 'Lido Finance',
          description:
            'Lido is a liquid staking solution for Ethereum, allowing users to stake ETH while maintaining liquidity.',
          logoUrl:
            'https://assets.coingecko.com/coins/images/13442/standard/steth_logo.png?1696513206',
          apy: apr, // Example TVL in wei
        },
      },
    ];
  }

  private async getClaimTimeEstimated(ids: string[]): Promise<any> {
    try {
      const idsString = ids.join(',');

      const response = await fetch(
        `https://wq-api-hoodi.testnet.fi/v2/request-time?ids=${idsString}`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error fetching estimated claim time:', error);
      throw new Error(
        `Failed to get estimated claim time: ${
          (error as SDKError).errorMessage
        }`
      );
    }
  }
}
