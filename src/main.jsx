import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './output.css';
import 'animate.css';
import { WhatsApp } from './WhatsApp.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <WhatsApp />
    </Provider>
  </StrictMode>,
)
