import { Stake } from "./page/Stake";
import { Routes, Route } from "react-router-dom";
import { Withdrawals } from "./page/Withdrawals";
import { Rewards } from "./page/Rewards";

function App() {


  return (
    <Routes>
        <Route path="/" element={<Stake />} />
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="/rewards" element={<Rewards />} />
    </Routes>
  );
}

export default App;
