import 'webcrypto-shim';
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { persistor, store } from './redux/store.tsx'
import {Provider} from 'react-redux'
import { PersistGate } from 'redux-persist/es/integration/react'
import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
    <ThemeProvider>

    <App />
    </ThemeProvider>
    </PersistGate>
    </Provider>
)
