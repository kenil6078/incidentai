import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "../routes/AppRoutes";
import { useAuth } from "../features/auth/hooks/useAuth";

function App() {
  const { refreshUser, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      refreshUser();
    }
  }, [isInitialized, refreshUser]);

  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
