import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains'
import {QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from "wagmi";
import '@rainbow-me/rainbowkit/styles.css'

const config = getDefaultConfig({
    appName: "Victoria xao quyet",
    projectId: "fa6feca74d37cd370d154e5a381b311d",
    chains:  [mainnet, polygon, arbitrum, optimism],
})

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
