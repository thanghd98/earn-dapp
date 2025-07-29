import { EarnSDK } from "../../packages/earn-sdk";

export const earnSDK = new EarnSDK({ provider: window.ethereum, debug: true });