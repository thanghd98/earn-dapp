import { EarnSDK } from "@coin98-com/earn-sdk";
import { Header } from './components/Header';

let earnSDK: EarnSDK | null = null;

function App() {
  const test = async () => {
    if(!earnSDK) {
     earnSDK = new EarnSDK({ provider: window.ethereum, debug: true})
    }

    const test = await earnSDK.stake("LidoProvider")
    console.log(`🐳 -> test -> test:`, test)
    
  }

  return (
   <div>
      <Header />
      <main className="p-8 flex flex-col items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-4xl font-semibold">Stake ETH</h1>
          <p className="text-center">Stake ETH and receive stETH while staking</p>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center rounded-2xl border bor w-1/3 mt-8 p-4">
          <div className="flex justify-between items-center gap-2 border border-gray-300 rounded-lg px-3 py-2  w-full" >
            <div className="flex items-center ">
              <img src="https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628" width={25} height={25} alt="" />
              <input placeholder="0.001" type="text" className="outline-none border-none px-4 py-1" name="" id="" />
            </div>
            <button className="bg-black opacity-90 cursor-pointer backdrop-blur-sm text-white px-4 py-1 rounded  hover:opacity-75 ease-in-out duration-200">Max</button>
          </div>
          <div className="w-full">
            <button className="bg-black cursor-pointer opacity-90 w-full text-white px-4 py-2 hover:opacity-75 ease-in-out duration-200">Stake</button>
          </div>
          <div className="w-full flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <p>You will receive</p>
              <p>0.0 stETH</p>
            </div>
            <div className="flex justify-between">
              <p>Exchange rate</p>
              <p>1 ETH = 1 stETH</p>
            </div>
            <div className="flex justify-between">
              <p>Max transaction cost</p>
              <p>$0.57</p>
            </div>
            <div className="flex justify-between">
              <p>Reward fee</p>
              <p>10%</p>
            </div>
          </div>
        </div>
      </main> 
   </div>
  )
}

export default App
