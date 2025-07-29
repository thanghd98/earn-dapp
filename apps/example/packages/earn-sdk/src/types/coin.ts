export class CoinType {
    symbol: string;
    name: string;
    decimals: number;
    address?: string;
    logoURI?: string;

    constructor(
        symbol: string,
        name: string,
        decimals: number,
        address?: string,
        logoURI?: string
    ) {
        this.symbol = symbol;
        this.name = name;
        this.decimals = decimals;
        this.address = address;
        this.logoURI = logoURI;
    }
}