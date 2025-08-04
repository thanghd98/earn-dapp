import {
  CHORUS_ONE_ETHEREUM_VALIDATORS,
  EthereumStaker,
  Transaction,
} from '@chorus-one/ethereum';
import { BaseEarnProvider } from '../../core';
import {
  CoinType,
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

export class ChorusOneProvider extends BaseEarnProvider {
  public name: string = 'ChorusOne';
  private sdk: EthereumStaker;

  //@ts-expect-error
  constructor(private logger?: Logger, private web3Provider?: EIP1193Provider) {
    super(logger, web3Provider);
    this.sdk = new EthereumStaker({ network: 'hoodi' });
    this.sdk
      .init()
      .then(res => console.log('ChorusOneProvider initialized:', res));
  }

  public async getTokenAvailable(): Promise<CoinType> {
    return new CoinType(
      'ETH',
      'Ethereum',
      18,
      '0x0000000000000000000000000000000000000000'
    );
  }

  public async stake(params: IStake): Promise<Transaction> {
    const { validatorAddress, delegatorAddress, amount } = params;

    try {
      const { tx: stakeTx } = await this.sdk.buildStakeTx({
        delegatorAddress,
        validatorAddress,
        amount, // Passed as string, e.g. '1' - 1 ETH
      });

      return stakeTx;
    } catch (error) {
      throw new Error(`Failed to build stake transaction: ${error.message}`);
    }
  }

  public async unstake(params: IUnstake): Promise<Transaction> {
    const { validatorAddress, delegatorAddress, amount } = params;
    try {
      // const { maxUnstake } = await this.sdk.getStake({
      //   delegatorAddress,
      //   validatorAddress
      // })

      const { tx: unstakeTx } = await this.sdk.buildUnstakeTx({
        delegatorAddress,
        validatorAddress,
        amount, // Passed as string, e.g. '1' - 1 ETH
      });

      return unstakeTx;
    } catch (error) {
      throw new Error(`Failed to build unstake transaction: ${error.message}`);
    }
  }

  public async claim(params: IClaim): Promise<Transaction> {
    const { data, delegatorAddress, validatorAddress } = params;
    try {
      const claimRequestFilter =
        data.requests.filter((request: any) => request.isFinalized) || [];

      const ids = claimRequestFilter.map((request: any) => request.id);

      const { tx: withdrawTx } = await this.sdk.buildWithdrawTx({
        delegatorAddress,
        validatorAddress,
        positionTickets: ids,
      });

      return withdrawTx;
    } catch (error) {
      throw new Error(`Failed to claim: ${error.message}`);
    }
  }

  public async getTotalStakedBalance(
    params: ITotalStakedBalance
  ): Promise<ITokenMetadata> {
    const { validatorAddress, address } = params;
    try {
      const { balance } = await this.sdk.getStake({
        validatorAddress, // Replace with actual validator address if needed
        delegatorAddress: address as string,
      });

      return {
        balance: (+balance * 10 ** 18).toString(), // Convert BigNumber to string
        coin: new CoinType(
          'ETH',
          'Ethereum',
          18,
          '0x0000000000000000000000000000000000000000'
        ),
      };
    } catch (error) {
      throw new Error(`Failed to get total staked balance: ${error.message}`);
    }
  }

  public getTotalUnstakedBalance(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public getUserStakedBalance(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public getStakingRewards(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public getStakingHistory(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  public async getValidatorInformation(): Promise<{ vault: IInformation }[]> {
    const vaults = await Promise.all(
      Object.values(CHORUS_ONE_ETHEREUM_VALIDATORS.hoodi).map(async v => {
        const vault = await this.sdk.getVault({ validatorAddress: v });

        return {
          vault: {
            ...vault.vault,
            logoUrl:
              'https://pbs.twimg.com/profile_images/1922639518399705088/B70wR6V2_400x400.jpg',
          },
        };
      })
    );

    return vaults;
  }

  public async getWithdrawalRequests(params: IWithdrawalRequests): Promise<IWithdrawalResults> {
    const { address, validatorAddress } = params;
    try {
      const requests = await this.sdk.getUnstakeQueue({
        validatorAddress: validatorAddress,
        delegatorAddress: address,
      });
      console.log("🚀 ~ ChorusOneProvider ~ getWithdrawalRequests ~ requests:", requests)

      const pendingAmount = requests.reduce((total, request) => {
        return total + parseFloat(request.totalAmount || '0');
      }, 0);

      const pendingRequestsFilter = requests.filter(
        request => !request.isWithdrawable
      );

      const pendingRequests = pendingRequestsFilter.map(request => {
        const requestedAt = new Date().getTime();
        const finalizationAt = request.withdrawalTimestamp;

        const diffMs = Number(finalizationAt) - Number(requestedAt);
        const diffHours = diffMs / (1000 * 60 * 60);

        return {
          amount: Number(request.totalAmount) * 10 ** 18,
          id: request.positionTicket,
          isFinalized: request.isWithdrawable,
          owner: address,
          timestamp: diffHours,
        };
      });
      console.log("🚀 ~ ChorusOneProvider ~ getWithdrawalRequests ~ pendingRequests:", pendingRequests)

      return {
        pendingAmount: pendingAmount * 10 ** 18,
        pendingRequests,
      };
    } catch (error) {
      console.log("🚀 ~ ChorusOneProvider ~ getWithdrawalRequests ~ error:", error)
      throw new Error(
        `Failed to fetch withdrawal requests IDs: ${error.message}`
      );
    }
  }

  public async getClaimableRequests(params: IClaimableRequests): Promise<IClaimableResults> {
    const { address, validatorAddress } = params;

    try {
      const requests = await this.sdk.getUnstakeQueue({
        validatorAddress: validatorAddress,
        delegatorAddress: address,
      });

      const claimableRequests = requests.filter(
        request => request.isWithdrawable
      );

      const claimAmount = claimableRequests.reduce((total, request) => {
        return total + parseFloat(request.totalAmount || '0');
      }, 0);

      const claimRequests = claimableRequests.map(request => {
        const requestedAt = new Date().getTime();
        const finalizationAt = request.withdrawalTimestamp;

        const diffMs = Number(finalizationAt) - Number(requestedAt);
        const diffHours = diffMs / (1000 * 60 * 60);
        return {
          amount: Number(request.totalAmount) * 10 ** 18,
          id: request.positionTicket,
          isFinalized: request.isWithdrawable,
          owner: address,
          timestamp: diffHours,
        };
      });
      return {
        claimAmount: claimAmount * 10 ** 18,
        claimRequests,
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch claimable requests IDs: ${error.message}`
      );
    }
  }

  public async getRewardsOnChain(params: IStakingRewardRequest): Promise<IStakingRewardResponse> {
    const { delegatorAddress, validatorAddress } = params;
    try {
      const staker = new EthereumStaker({ network: 'hoodi' });
      await staker.init();

      // Setting the date range: from 1 month ago to today
      const from = new Date();
      from.setMonth(from.getDay() - 7);
      const to = new Date();

      const txHistory = await this.sdk.getRewardsHistory({
        startTime: from.getTime(),
        endTime: to.getTime(),
        delegatorAddress,
        validatorAddress,
      });
      console.log("🚀 ~ ChorusOneProvider ~ getRewardsOnChain ~ txHistory:", txHistory)

      const totalAmount = txHistory.reduce((acc, tx) => {
        const amount = Math.abs(Number(tx.amount) )|| 0;
        return acc + amount;
      }, 0);

      return {
        totalRewards: totalAmount * 10 ** 18, // Convert to wei
        rewards: txHistory.map(tx => {
          return {
            ...tx,
            amount: Math.abs(Number(tx.amount)) * 10 ** 18, // Convert to wei
            type: 'rebase', // Default to 'rebase' if type is not defined
          }
        })
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch rewards on chain: ${error.message}`
      );
    }
  }
}
