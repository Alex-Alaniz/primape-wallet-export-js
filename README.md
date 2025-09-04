# PRIMAPE Wallet Export App

A React-based web application for exporting cryptocurrency wallets with PRIMAPE branding and Privy authentication.

## Features

- 🔐 **Privy Authentication**: Secure login with email, SMS, Google, and Twitter
- 💼 **Multi-Chain Support**: Export wallets for Ethereum and Solana
- 🎨 **PRIMAPE Branding**: Custom styling with PRIMAPE colors and logo
- 📱 **Mobile Optimized**: PWA-ready with responsive design
- 🚀 **Modern UI**: Clean, professional interface with black background

## Tech Stack

- **React 19** - Frontend framework
- **Privy** - Authentication and wallet management
- **Solana Web3.js** - Solana blockchain integration
- **React Icons** - Icon library
- **Lucide React** - Additional icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Privy App ID

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd primape-wallet-export-js
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Privy App ID to `.env.local`:
```
REACT_APP_PRIVY_APP_ID=your_privy_app_id_here
```

5. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_PRIVY_APP_ID`: Your Privy App ID

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Serve the build folder with any static file server:
```bash
npx serve -s build
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_PRIVY_APP_ID` | Privy App ID for authentication | Yes |

## Project Structure

```
src/
├── components/
│   ├── WalletExportApp.js    # Main application component
│   └── WalletExportApp.css   # Component styles
├── App.js                    # App wrapper with Privy provider
├── App.css                   # Global styles
└── index.js                  # Entry point
```

## Features Overview

### Authentication
- Multiple login methods (email, SMS, Google, Twitter)
- Secure wallet creation and management
- User profile display with social media integration

### Wallet Export
- **Ethereum Wallets**: Export private keys and seed phrases
- **Solana Wallets**: Export private keys and seed phrases
- Secure key generation and display

### UI/UX
- PRIMAPE brand colors (#FF6B35 accent, #000000 background)
- Responsive design for mobile and desktop
- Professional loading states and error handling
- Twitter integration with proper icon display

## Security Notes

- Private keys are generated client-side
- No sensitive data is stored on servers
- All wallet operations are performed locally
- Users are responsible for securing their exported keys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to PRIMAPE.

## Support

For support or questions, please contact the PRIMAPE development team.