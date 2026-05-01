import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true;

// Handle 401 Unauthorized globally
axios.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      const path = window.location.pathname;
      if (!path.startsWith("/login") && !path.startsWith("/register") && !path.startsWith("/status") && path !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

