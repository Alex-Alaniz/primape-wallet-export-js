# PRIMAPE Wallet Export - Privy Integration

This React application integrates with Privy to allow users to export their embedded wallet private keys securely.

## Privy Documentation References

### UI Components
- **UserPill Component**: [https://docs.privy.io/user-management/users/ui-components.md](https://docs.privy.io/user-management/users/ui-components.md)
  - Used for user authentication and wallet management
  - Supports multiple login methods: email, SMS, Google, Twitter
  - Configurable with action types and size options

### Full Privy Documentation
- **Complete API Reference**: [https://docs.privy.io/llms-full.txt](https://docs.privy.io/llms-full.txt)
  - Comprehensive documentation for all Privy features
  - API endpoints, authentication, wallet management
  - Authorization signatures and security features

### Account Linking & Unlinking
- **Linking Accounts**: [https://docs.privy.io/user-management/users/linking-accounts.md](https://docs.privy.io/user-management/users/linking-accounts.md)
  - Link additional accounts (email, phone, wallet, social)
  - Progressive onboarding support
  - Modal-guided link methods
- **Unlinking Accounts**: [https://docs.privy.io/user-management/users/unlinking-accounts](https://docs.privy.io/user-management/users/unlinking-accounts)
  - Unlink linked accounts at any point
  - Direct methods from usePrivy hook
  - Users must have at least one linked account

## Implementation Details

### UserPill Configuration
```jsx
<UserPill
  action={{
    type: 'login', 
    options: {
      loginMethods: ['email', 'sms', 'google', 'twitter']
    }
  }}
  size={48}
/>
```

### Wallet Export Features
- **Ethereum Wallets**: Export ETH wallet private keys
- **Solana Wallets**: Export SOL wallet private keys
- **Security**: Uses Privy's secure export modal
- **Authentication**: Same credentials as iOS app

### Account Management Features
- **Link Accounts**: Email, Phone, Wallet, Google, Twitter, Discord
- **Unlink Accounts**: Remove linked accounts with confirmation
- **Account Display**: View all linked accounts with details
- **Progressive Onboarding**: Link accounts when needed

### Security Considerations
- Private keys are assembled on a different origin for maximum security
- Neither PRIMAPE nor Privy can access the private key
- Only the user can see their private key during export

## App Configuration

### PrivyProvider Setup
```jsx
<PrivyProvider
  appId="cm77yp83t04ei11q2fm2uec9y"
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
```

## Usage

1. Users connect with their PRIMAPE account using the UserPill
2. The app displays their embedded wallets (Ethereum and Solana)
3. Users can export private keys for each wallet type
4. Privy's secure export modal handles the key exposure

## Development

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`
