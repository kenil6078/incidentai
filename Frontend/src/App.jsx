import "./App.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "./routes/AppRoutes";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;
