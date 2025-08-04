import { createContext, useContext } from "react"

interface ProviderContextType {
    provider: string;
    setProvider: React.Dispatch<React.SetStateAction<string>>
}

interface StakeProviderContextType {
    stakeProvider: string;
    setStakeProvider: React.Dispatch<React.SetStateAction<string>>
}

export const ProviderContext = createContext<ProviderContextType | null>(null);
export const StakeProviderContext = createContext<StakeProviderContextType | null>(null);

export const useProvider = () => {
    const { provider, setProvider } = useContext(ProviderContext) as ProviderContextType;

    return {
        provider,
        setProvider
    };    
}

export const useStakeProvider = () => {
    const { setStakeProvider, stakeProvider } = useContext(StakeProviderContext) as StakeProviderContextType;

    return {
        stakeProvider,
        setStakeProvider
    };    
}