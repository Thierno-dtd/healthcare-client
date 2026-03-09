import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Legacy styles
import '../styles/main.css';
import '../styles/landing.css';
import '../styles/animations.css';
import '../styles/components.css';
import '../styles/extended.css';
import '../styles/examens.css';
import '../styles/responsive.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
