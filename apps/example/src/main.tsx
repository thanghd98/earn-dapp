import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { hoodi } from 'wagmi/chains'
import {QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from "wagmi";
import '@rainbow-me/rainbowkit/styles.css'
import { ToastContainer } from 'react-toastify';
import { Header } from './components/Header.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Footer } from './components/Footer.tsx'
import { SkeletonTheme } from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css"

const config = getDefaultConfig({
    appName: "Victoria xao quyet",
    projectId: "fa6feca74d37cd370d154e5a381b311d",
    chains:  [hoodi],
})

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
              <Header />
              <App />
              <Footer />
              <ToastContainer />
            </SkeletonTheme>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </StrictMode>,
)
