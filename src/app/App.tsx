import React from 'react';
import { Providers } from './providers';
import AppRoutes from '@core/router/routes';

const App: React.FC = () => {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  );
};

export default App;
