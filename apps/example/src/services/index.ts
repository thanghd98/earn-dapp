import { EarnSDK } from "@coin98-com/earn-sdk";

export const earnSDK = new EarnSDK({ provider: window.ethereum, debug: true });