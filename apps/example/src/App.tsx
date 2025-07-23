import { EarnSDK } from "@coin98-com/earn-sdk";
import { Header } from "./components/Header";
import { useForm } from "react-hook-form";

let earnSDK: EarnSDK | null = null;

function App() {
  const { register, handleSubmit, setValue, } = useForm();
  

  const onStaking = async (data: any) => {
    console.log("🚀 ~ onStaking ~ data:", data);
    if (!earnSDK) {
      earnSDK = new EarnSDK({ provider: window.ethereum, debug: true });
    }
    const result = await earnSDK.stake({
      amount: data.amount,
      provider: "LidoProvider"
    })
    console.log("🚀 ~ onStaking ~ result:", result)    
  };

  return (
    <div>
      <Header />
      <main className="p-8 flex flex-col items-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-4xl font-semibold">Stake ETH</h1>
          <p className="text-center">
            Stake ETH and receive stETH while staking
          </p>
        </div>
        <form
          className="flex flex-col gap-4 justify-center items-center rounded-2xl border bor w-1/3 mt-8 p-4"
          onSubmit={handleSubmit(onStaking)}
        >
          <div className="w-full flex justify-between items-center">
            <div>
              <p className="text-sm">Available to stake</p>
              <p className="text-xl font-semibold">0.8998 ETH</p>
            </div>
            <div className="text-right">
              <p className="text-sm">Staked amount</p>
              <p className="text-xl font-semibold">0.1000 stETH</p>
            </div>
          </div>

          <hr className="border-gray-300 w-full my-2" />

          <div className="w-full flex justify-between items-center mb-2">
            <div>
                <div className="flex items-center gap-2">
                <p className="text-sm">Lido APR</p>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/545/545682.png"
                  alt="Question Icon"
                  width={16}
                  height={16}
                  className="cursor-pointer"
                  title="Annual Percentage Rate (APR) for staking with Lido."
                />
                </div>
            </div>
            <p className="text-xl font-semibold text-green-600">-0.1%</p>
          </div>

          <div className="flex justify-between items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-full">
            <div className="flex items-center ">
              <img
                src="https://assets.coingecko.com/coins/images/279/standard/ethereum.png?1696501628"
                width={25}
                height={25}
                alt=""
              />
              <input
                placeholder="0.001"
                type="text"
                className="outline-none border-none px-4 py-1"
                
                {...register("amount", { required: true })}
              />
            </div>
            <button
              type="button"
              className="bg-black opacity-90 cursor-pointer backdrop-blur-sm text-white px-4 py-1 rounded hover:opacity-75 ease-in-out duration-200"
              onClick={() => setValue("amount", "Max")}
            >
              Max
            </button>
          </div>
          <div className="w-full">
            <button
              type="submit"
              className="bg-black cursor-pointer opacity-90 w-full text-white px-4 py-2 hover:opacity-75 ease-in-out duration-200"
            >
              Stake
            </button>
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
        </form>
      </main>
    </div>
  );
}

export default App;
