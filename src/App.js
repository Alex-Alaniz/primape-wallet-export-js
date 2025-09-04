import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import WalletExportApp from './components/WalletExportApp';
import './App.css';

function App() {
  return (
    <PrivyProvider
      appId={process.env.REACT_APP_PRIVY_APP_ID || "cm77yp83t04ei11q2fm2uec9y"}
      config={{
        appearance: {
          theme: 'light',
          accentColor: '#FF6B35',
          logo: 'https://primape.app/logo.png'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false
        },
        loginMethods: ['email', 'sms', 'google', 'twitter']
      }}
    >
      <WalletExportApp />
    </PrivyProvider>
  );
}

export default App;