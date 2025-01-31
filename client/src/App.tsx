import { useEffect } from "react";
import "./App.css";
import { AppProvider } from "./providers/app";
import { AppRoutes } from "./routes";

function App() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      // Request write access when the app loads
      tg.requestWriteAccess();
    } else {
      console.warn("Telegram WebApp API is not available.");
    }
  }, []);

  return (
    <div>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </div>
  );
}

export default App;
