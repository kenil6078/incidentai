import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "../routes/AppRoutes";
import { useAuth } from "../features/auth/hook/useAuth";

function App() {
  const { handleGetMe, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      handleGetMe();
    }
  }, [isInitialized, handleGetMe]);

  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
