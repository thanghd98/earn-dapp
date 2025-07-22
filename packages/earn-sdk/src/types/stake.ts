export interface IStake {
  delegatorAddress?: string;           // user address
  validatorAddress?: string;          // optional
  referralAddress?: string;          // optional
  amount: string;                     // amount wei
  withdrawalAddress?: string;         // cho Blockdaemon, Figment
  autoSend?: boolean;                 // nếu true, SDK sẽ gửi luôn thay vì trả usigned transaction
}

export interface IUnstake {
  amount: string;                     // amount wei
  token: string;                      // token address
}