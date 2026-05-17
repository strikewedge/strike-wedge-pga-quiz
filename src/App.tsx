import { Dashboard } from "./components/Dashboard";
import { SaleEnded } from "./components/SaleEnded";

const IS_DASHBOARD =
  typeof window !== "undefined" &&
  window.location.pathname.replace(/\/$/, "") === "/dashboard";

function App() {
  if (IS_DASHBOARD) return <Dashboard />;
  return <SaleEnded />;
}

export default App;
