import { Network } from "../types";

export const ethereum: Network = {
    name: "Ethereum",
    chainId: 1,
    rpcUrls: ["https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
    blockExplorerUrls: ["https://etherscan.io"],
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
    }
}

// Testnet exportable
export const holesky: Network = {
    name: "Holesky",
    chainId: 17000,
    rpcUrls: ["https://ethereum-holesky-rpc.publicnode.com"],
    blockExplorerUrls: ["https://holesky.etherscan.io"],
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18
    }
}