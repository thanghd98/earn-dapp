import { CoinType } from './coin';

// Common interface for requests with optional validator and delegator addresses
interface IBaseRequest {
  delegatorAddress?: string; // User address
  validatorAddress?: string; // Optional validator address
}

// Common interface for results with pending or claimable requests
interface IRequestResult<T> {
  amount: string | number; // Amount of each request
  id: string | number; // Unique identifier for the request
  isFinalized: boolean; // Whether the request is finalized
  owner: string;
  timestamp: number; // Timestamp of the request
  additionalData?: T; // Optional additional data
}

export interface IStake extends IBaseRequest {
  referralAddress?: string; // Optional referral address
  amount: string; // Amount in wei
  withdrawalAddress?: string; // For Blockdaemon, Figment
  autoSend?: boolean; // If true, SDK sends the transaction instead of returning unsigned
}

export interface IUnstake extends IBaseRequest {
  amount: string; // Amount in wei
  token: string; // Token address
}

export interface IClaim extends IBaseRequest {
  data: any; // Claim data (e.g., amount in wei)
}

export interface ITokenMetadata {
  balance: string;
  coin: CoinType;
}

export interface IInformation {
  address: string;
  name: string;
  description?: string;
  logoUrl?: string;
  tvl?: string;
  apy: number;
}

export interface ITotalStakedBalance {
  address: string;
  validatorAddress?: string;
}

export interface IWithdrawalRequests extends IBaseRequest {
  address: string; // User's address
}

export interface IWithdrawalResults {
  pendingAmount: string | number; // Total pending withdrawal amount
  pendingRequests: IRequestResult<null>[]; // List of pending requests
}

export interface IClaimableRequests extends IBaseRequest {
  address: string; // User's address
}

export interface IClaimableResults {
  claimAmount: string | number; // Total claimable amount
  claimRequests: IRequestResult<null>[]; // List of claimable requests
}

export interface IStakingRewardRequest extends IBaseRequest {
  day: '7'; // Default to 7 days
}

export interface IStakingRewardResponse {
  totalRewards: number;
  rewards: {
    amount: number | string; // Amount of the reward
    timestamp: number; // Timestamp of the reward
    type: string; // Reward type
  }[];
}
