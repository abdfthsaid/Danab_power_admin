import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { DarkModeProvider } from './context/DarkModeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Provider } from 'react-redux';
import store from './store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
