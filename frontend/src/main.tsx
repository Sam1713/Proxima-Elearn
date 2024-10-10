import './crypto-polyfill';
import 'crypto-browserify';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { persistor, store } from './redux/store.tsx'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { ThemeProvider } from "@material-tailwind/react";

if (!window.crypto || !window.crypto.getRandomValues) {
  console.error('Crypto API not available or unsupported. Make sure your environment supports the Web Crypto API.');
} else {
  console.log('Crypto API is available and supported.');
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <ThemeProvider>

    <App />
    </ThemeProvider>
    </PersistGate>
    </Provider>
)
