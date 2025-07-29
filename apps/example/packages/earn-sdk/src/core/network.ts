export class NetworkService{
    private networks: Record<string, any> = {};

    constructor(private logger?: any) {
        this.initAvailableNetworks();
    }

    public addNetwork(network: any): void {
        if (!network || !network.name || !network.chainId) {
            this.logger?.error("Invalid network configuration");
            return;
        }
        this.networks[network.name] = network;
        this.logger?.info(`Network ${network.name} added successfully`);
    }

    public getNetwork(name: string): any {
        const network = this.networks[name];
        if (!network) {
            this.logger?.warn(`Network ${name} not found`);
            return null;
        }
        return network;
    }

    public getAllNetworks(): Record<string, any> {
        return this.networks;
    }   

    private initAvailableNetworks(){
        // Add pre-config networks
    }
}