import { EarnSDK } from "../../packages/earn-sdk/src/index";

export const earnSDK = new EarnSDK({ provider: window.ethereum, debug: true });