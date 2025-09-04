import React, { useState, useEffect } from 'react';
import { usePrivy, useLinkAccount, type WalletWithMetadata } from '@privy-io/react-auth';
import { UserPill } from '@privy-io/react-auth/ui';
import { useSolanaWallets } from '@privy-io/react-auth/solana';
import { createClient } from '@supabase/supabase-js';
import { 
  Mail, 
  Phone, 
  Wallet, 
  Chrome, 
  MessageCircle, 
  Key, 
  Coins, 
  Circle,
  Unlink,
  Link as LinkIcon,
  AlertTriangle
} from 'lucide-react';
import './WalletExportApp.css';
import primapeLogo from '../assets/primape/asset7.png';

// Supabase configuration
const supabaseUrl = 'https://sarwumhfyglncxucvsio.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcnd1bWhmeWdsbmN4dWN2c2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjg3NTQsImV4cCI6MjA3MTgwNDc1NH0.gVDwhlelWf0OFTaRWtFBteC97e0_JJJ2KLI9Yt1Zv-E';
const supabase = createClient(supabaseUrl, supabaseKey);

const WalletExportApp = () => {
  const { 
    ready, 
    authenticated, 
    user, 
    exportWallet: exportEthereumWallet,
    unlinkEmail,
    unlinkPhone,
    unlinkWallet,
    unlinkGoogle,
    unlinkTwitter,
    unlinkDiscord
  } = usePrivy();
  
  // Get Solana-specific export function
  const { exportWallet: exportSolanaWallet } = useSolanaWallets();
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [exportingWallet, setExportingWallet] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Add global error boundary for uncaught errors
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      event.preventDefault();
      
      // Handle specific Privy errors
      if (event.error?.message?.includes('already linked') || 
          event.error?.message?.includes('already has an account')) {
        setMessage('This account is already linked to another user.');
      } else if (event.error?.message?.includes('exportWallet')) {
        setMessage('Wallet export error. Please refresh and try again.');
      } else {
        setMessage(`Error: ${event.error?.message || 'An unexpected error occurred'}`);
      }
      
      setTimeout(() => setMessage(''), 5000);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError({ error: event.reason, preventDefault: () => event.preventDefault() });
    });
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  const { linkEmail, linkPhone, linkWallet, linkGoogle, linkTwitter, linkDiscord } = useLinkAccount({
    onSuccess: ({ user, linkMethod, linkedAccount }) => {
      console.log('Successfully linked account:', linkedAccount);
      setMessage(`Successfully linked ${linkMethod} account!`);
      setTimeout(() => setMessage(''), 3000);
    },
    onError: (error) => {
      console.error('Failed to link account:', error);
      // Handle common error cases gracefully
      if (error.message?.includes('already has an account') || error.message?.includes('already linked')) {
        setMessage(`This account is already linked to another user.`);
      } else if (error.message?.includes('User already has')) {
        setMessage(`You already have this type of account linked.`);
      } else {
        setMessage(`Failed to link account: ${error.message || 'Unknown error'}`);
      }
      setTimeout(() => setMessage(''), 5000);
    }
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  // Fetch user profile from Supabase when authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authenticated && user?.id) {
        try {
          console.log('Fetching user profile for Privy ID:', user.id);
          
          // First try to find by privy_id
          let { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('privy_id', user.id)
            .maybeSingle();
          
          // If not found by privy_id, try by bio field (legacy)
          if (!profile) {
            const { data: bioProfile } = await supabase
              .from('users')
              .select('*')
              .eq('bio', `Privy ID: ${user.id}`)
              .maybeSingle();
            
            profile = bioProfile;
          }
          
          // If we have a Twitter account linked, try to find by Twitter username
          if (!profile) {
            const twitterAccount = user?.linkedAccounts?.find(acc => acc.type === 'twitter');
            if (twitterAccount?.username) {
              const { data: twitterProfile } = await supabase
                .from('users')
                .select('*')
                .eq('twitter_username', twitterAccount.username)
                .maybeSingle();
              
              profile = twitterProfile;
            }
          }
          
          if (profile) {
            console.log('Found user profile:', profile);
            setUserProfile(profile);
          } else {
            console.log('No user profile found in database');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [authenticated, user]);

  if (loading) {
    return (
      <div className="container">
        <div className="logo">
          <img src={primapeLogo} alt="PRIMAPE" className="primape-logo" />
          <h1>PRIMAPE</h1>
          <p className="subtitle">Export Your Private Key</p>
        </div>
        <div className="status">
          <p>🔄 Loading...</p>
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="container">
        <div className="logo">
          <img src={primapeLogo} alt="PRIMAPE" className="primape-logo" />
          <h1>PRIMAPE</h1>
          <p className="subtitle">Export Your Private Key</p>
        </div>
        <div className="status">
          <p>🔄 Initializing PRIMAPE connection...</p>
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="container">
        <div className="logo">
          <img src={primapeLogo} alt="PRIMAPE" className="primape-logo" />
          <h1>PRIMAPE</h1>
          <p className="subtitle">Export Your Private Key</p>
          <p className="description">
            Connect with your PRIMAPE account to export your embedded wallet private key
          </p>
        </div>
        
        <div className="status">
          <p>Connect with your PRIMAPE account to export your embedded wallet private key</p>
        </div>
        
        <div className="user-pill-container">
          <UserPill
            action={{
              type: 'login', 
              options: {
                loginMethods: ['email', 'sms', 'google', 'twitter']
              }
            }}
            size={48}
          />
        </div>
        
        <div className="info-box">
          <strong>🔐 How it works:</strong><br /><br />
          1. Click the user pill above to sign in<br />
          2. Use the same credentials as your iOS app<br />
          3. View your embedded wallets<br />
          4. Export your private key securely<br /><br />
          
          <strong>🛡️ Security:</strong><br />
          Your private key is assembled on a different origin for maximum security. Neither PRIMAPE nor Privy can access your private key - only you can see it.
        </div>
      </div>
    );
  }

  // User is authenticated, show wallet export options
  const embeddedWallets = user?.linkedAccounts.filter(
    account => account.type === 'wallet' && account.walletClientType === 'privy'
  ) || [];

  const ethereumWallets = embeddedWallets.filter(wallet => wallet.chainType === 'ethereum');
  const solanaWallets = embeddedWallets.filter(wallet => wallet.chainType === 'solana');
  
  // Check which account types are already linked
  const hasEmail = user?.linkedAccounts?.some(acc => acc.type === 'email');
  const hasPhone = user?.linkedAccounts?.some(acc => acc.type === 'phone');
  const hasGoogle = user?.linkedAccounts?.some(acc => acc.type === 'google');
  const hasTwitter = user?.linkedAccounts?.some(acc => acc.type === 'twitter');
  const hasDiscord = user?.linkedAccounts?.some(acc => acc.type === 'discord');
  const hasExternalWallet = user?.linkedAccounts?.some(acc => acc.type === 'wallet' && acc.walletClientType !== 'privy');
  
  // Function to handle wallet export with error handling
  const handleExportWallet = async (wallet) => {
    try {
      setExportingWallet(wallet.address);
      setMessage('');
      
      console.log('Exporting wallet:', wallet);
      
      // For Privy embedded wallets
      if (wallet.walletClientType === 'privy') {
        if (wallet.chainType === 'ethereum') {
          // Use the Ethereum export function
          console.log('Using Ethereum wallet export...');
          await exportEthereumWallet();
        } else if (wallet.chainType === 'solana') {
          // Use the Solana-specific export function
          console.log('Using Solana wallet export...');
          await exportSolanaWallet();
        }
        
        // Clear any message since export was successful (Privy handles the UI)
        setMessage('');
      } else {
        setMessage('Export is only available for embedded wallets');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to export wallet:', error);
      
      // Handle specific error cases
      if (error.message?.includes('valid Ethereum address')) {
        setMessage('Wallet export error. Please try again.');
      } else if (error.message?.includes('Cannot use \'in\' operator')) {
        setMessage('Wallet export configuration error. Please refresh and try again.');
      } else if (error.message?.includes('not supported')) {
        setMessage('Wallet export is not supported for this wallet type.');
      } else if (error.message?.includes('User denied') || error.message?.includes('cancelled')) {
        // User cancelled the export, don't show error
        setMessage('');
        return;
      } else {
        setMessage(`Failed to export wallet: ${error.message || 'Unknown error'}`);
      }
      
      // Clear error message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setExportingWallet(null);
    }
  };

  // Function to unlink an account based on type
  const handleUnlinkAccount = async (accountType, account) => {
    // Unlinking is not fully supported in Privy v2 yet
    setMessage('Account unlinking is not available in this version. Please use the PRIMAPE app to manage linked accounts.');
    setTimeout(() => setMessage(''), 5000);
    return;
    
    /* Commented out until Privy supports unlinking
    try {
      // Check if this is the last linked account
      const linkedAccountsCount = user?.linkedAccounts?.length || 0;
      if (linkedAccountsCount <= 1) {
        setMessage('Cannot unlink your last account. You need at least one way to sign in.');
        setTimeout(() => setMessage(''), 5000);
        return;
      }
      
      // Check if trying to unlink an embedded wallet
      if (accountType === 'wallet' && account.walletClientType === 'privy') {
        setMessage('Embedded wallets cannot be unlinked.');
        setTimeout(() => setMessage(''), 5000);
        return;
      }
      
      switch (accountType) {
        case 'email':
          await unlinkEmail(account.address);
          break;
        case 'phone':
          await unlinkPhone(account.number);
          break;
        case 'wallet':
          // Only external wallets can be unlinked
          if (account.walletClientType !== 'privy') {
            await unlinkWallet(account.address);
          }
          break;
        case 'google':
          await unlinkGoogle();
          break;
        case 'twitter':
          await unlinkTwitter();
          break;
        case 'discord':
          await unlinkDiscord();
          break;
        default:
          setMessage(`Unlinking ${accountType} accounts is not supported yet`);
          setTimeout(() => setMessage(''), 5000);
          return;
      }
      
      setMessage(`Successfully unlinked ${accountType} account!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to unlink account:', error);
      
      // Handle specific error cases
      if (error.message?.includes('last remaining')) {
        setMessage('Cannot unlink your last sign-in method.');
      } else if (error.message?.includes('not found')) {
        setMessage('Account not found or already unlinked.');
      } else {
        setMessage(`Failed to unlink: ${error.message || 'Unknown error'}`);
      }
      
      setTimeout(() => setMessage(''), 5000);
    }
    */
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={primapeLogo} alt="PRIMAPE" className="primape-logo" />
        <h1>PRIMAPE</h1>
        <p className="subtitle">Export Your Private Key</p>
      </div>
      
      <div className="status success">
        <p>✅ Connected to PRIMAPE Account</p>
        <div className="user-info">
          {userProfile ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              {userProfile.avatar_url && (
                <img 
                  src={userProfile.avatar_url} 
                  alt={userProfile.username} 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{userProfile.username}</span>
                {userProfile.level && (
                  <span style={{ fontSize: 12, color: '#666' }}>Level {userProfile.level} • {userProfile.total_predictions} predictions</span>
                )}
              </div>
            </div>
          ) : (() => {
            // Fallback to linked accounts if no profile found
            const emailAccount = user?.linkedAccounts?.find(acc => acc.type === 'email');
            const phoneAccount = user?.linkedAccounts?.find(acc => acc.type === 'phone');
            const googleAccount = user?.linkedAccounts?.find(acc => acc.type === 'google');
            const twitterAccount = user?.linkedAccounts?.find(acc => acc.type === 'twitter');
            
            if (twitterAccount) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>𝕏</span>
                  <span>@{twitterAccount.username}</span>
                </div>
              );
            } else if (googleAccount) {
              return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Chrome size={16} />
                  <span>{googleAccount.email}</span>
                </div>
              );
            } else if (emailAccount) {
              return `User: ${emailAccount.address}`;
            } else if (phoneAccount) {
              return `User: ${phoneAccount.number}`;
            } else {
              return `Welcome!`;
            }
          })()}
        </div>
      </div>
      
      <div className="user-pill-container">
        <UserPill size={48} />
      </div>

      {message && (
        <div className={`status ${message.includes('Successfully') ? 'success' : 'error'}`}>
          <p>{message}</p>
        </div>
      )}

      <div className="account-management">
        <h3>🔗 Account Management</h3>
        
        <div className="link-accounts">
          <h4>Link New Accounts</h4>
          {hasEmail && hasPhone && hasGoogle && hasTwitter && hasDiscord && hasExternalWallet ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              All available account types are already linked.
            </p>
          ) : (
          <div className="link-buttons">
            {!hasEmail && (
              <button className="link-button" onClick={async () => {
                try {
                  await linkEmail();
                } catch (err) {
                  console.error('Link email error:', err);
                  if (err.message?.includes('already has')) {
                    setMessage('You already have an email linked');
                  } else {
                    setMessage('Failed to link email account');
                  }
                  setTimeout(() => setMessage(''), 5000);
                }
              }}>
                <Mail size={16} />
                Link Email
              </button>
            )}
            {!hasPhone && (
              <button className="link-button" onClick={async () => {
                try {
                  await linkPhone();
                } catch (err) {
                  console.error('Link phone error:', err);
                  if (err.message?.includes('already has')) {
                    setMessage('You already have a phone number linked');
                  } else {
                    setMessage('Failed to link phone account');
                  }
                  setTimeout(() => setMessage(''), 5000);
                }
              }}>
                <Phone size={16} />
                Link Phone
              </button>
            )}
            {!hasExternalWallet && (
              <button className="link-button" onClick={async () => {
                try {
                  await linkWallet();
                } catch (err) {
                  console.error('Link wallet error:', err);
                  if (err.message?.includes('already has')) {
                    setMessage('You already have a wallet linked');
                  } else {
                    setMessage('Failed to link wallet');
                  }
                  setTimeout(() => setMessage(''), 5000);
                }
              }}>
                <Wallet size={16} />
                Link Wallet
              </button>
            )}
            {!hasGoogle && (
              <button className="link-button" onClick={async () => {
                try {
                  await linkGoogle();
                } catch (err) {
                  console.error('Link Google error:', err);
                  if (err.message?.includes('already has')) {
                    setMessage('You already have a Google account linked');
                  } else {
                    setMessage('Failed to link Google account');
                  }
                  setTimeout(() => setMessage(''), 5000);
                }
              }}>
                <Chrome size={16} />
                Link Google
              </button>
            )}
            {!hasTwitter && (
              <button className="link-button" onClick={async () => {
                try {
                  await linkTwitter();
                } catch (err) {
                  console.error('Link Twitter error:', err);
                  if (err.message?.includes('already has')) {
                    setMessage('You already have an X (Twitter) account linked');
                  } else {
                    setMessage('Failed to link X (Twitter) account');
                  }
                  setTimeout(() => setMessage(''), 5000);
                }
              }}>
                <span style={{ fontSize: 16, fontWeight: 'bold' }}>𝕏</span>
                Link X (Twitter)
              </button>
            )}
            {!hasDiscord && (
              <button className="link-button" onClick={async () => {
                try {
                  await linkDiscord();
                } catch (err) {
                  console.error('Link Discord error:', err);
                  if (err.message?.includes('already has')) {
                    setMessage('You already have a Discord account linked');
                  } else {
                    setMessage('Failed to link Discord account');
                  }
                  setTimeout(() => setMessage(''), 5000);
                }
              }}>
                <MessageCircle size={16} />
                Link Discord
              </button>
            )}
          </div>
          )}
        </div>

        <div className="linked-accounts">
          <h4>Linked Accounts</h4>
          {user?.linkedAccounts?.map((account, index) => {
            const getAccountIcon = (type) => {
              switch (type) {
                case 'email': return <Mail size={20} />;
                case 'phone': return <Phone size={20} />;
                case 'wallet': 
                  // Check if it's an embedded wallet or external wallet
                  if (account.walletClientType === 'privy') {
                    return account.chainType === 'ethereum' ? <Coins size={20} /> : <Circle size={20} />;
                  }
                  return <Wallet size={20} />;
                case 'google': return <Chrome size={20} />;
                case 'twitter': return <span style={{ fontSize: 20, fontWeight: 'bold' }}>𝕏</span>;
                case 'discord': return <MessageCircle size={20} />;
                default: return <LinkIcon size={20} />;
              }
            };

            const getAccountLabel = (type, account) => {
              switch (type) {
                case 'email': return 'Email';
                case 'phone': return 'Phone';
                case 'wallet': 
                  if (account.walletClientType === 'privy') {
                    return `Embedded ${account.chainType === 'ethereum' ? 'Ethereum' : 'Solana'} Wallet`;
                  }
                  return 'External Wallet';
                case 'google': return 'Google';
                case 'twitter': return 'X (Twitter)';
                case 'discord': return 'Discord';
                default: return type;
              }
            };

            const getAccountValue = (account) => {
              switch (account.type) {
                case 'email': return account.address;
                case 'phone': return account.number;
                case 'wallet': return account.address;
                case 'google': return account.email;
                case 'twitter': return account.username;
                case 'discord': return account.username;
                default: return account.address || account.email || account.username;
              }
            };

            return (
              <div key={index} className="account-item">
                <div className="account-info">
                  <div className="account-header">
                    {getAccountIcon(account.type)}
                    <strong>{getAccountLabel(account.type, account)}</strong>
                  </div>
                  <span className="account-value">{getAccountValue(account)}</span>
                </div>
                <button 
                  className="unlink-button"
                  onClick={() => handleUnlinkAccount(account.type, account)}
                  title="Unlinking is not available in this version"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  <Unlink size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {embeddedWallets.length > 0 ? (
        <div>
          <div className="wallet-list">
            <h3>📱 Your Embedded Wallets:</h3>
            
            {ethereumWallets.length > 0 && (
              <div className="wallet-section">
                <h4>
                  <Coins size={20} />
                  Ethereum Wallets
                </h4>
                {ethereumWallets.map((wallet, index) => (
                  <div key={`eth-${index}`} className="wallet-item">
                    <div className="wallet-info">
                      <div className="wallet-header">
                        <Coins size={20} />
                        <strong>Ethereum Wallet</strong>
                      </div>
                      <span className="wallet-address">{wallet.address}</span>
                    </div>
                    <button 
                      className="export-button"
                      onClick={() => handleExportWallet(wallet)}
                      disabled={exportingWallet === wallet.address}
                      title="Opens wallet selection modal"
                    >
                      {exportingWallet === wallet.address ? (
                        <>
                          <div className="loading" style={{width: '16px', height: '16px', margin: '0'}}></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          <Key size={16} />
                          Export ETH Wallet
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {solanaWallets.length > 0 && (
              <div className="wallet-section">
                <h4>
                  <Circle size={20} />
                  Solana Wallets
                </h4>
                {solanaWallets.map((wallet, index) => (
                  <div key={`sol-${index}`} className="wallet-item">
                    <div className="wallet-info">
                      <div className="wallet-header">
                        <Circle size={20} />
                        <strong>Solana Wallet</strong>
                      </div>
                      <span className="wallet-address">{wallet.address}</span>
                    </div>
                    <button 
                      className="export-button"
                      onClick={() => handleExportWallet(wallet)}
                      disabled={exportingWallet === wallet.address}
                      title="Opens wallet selection modal"
                    >
                      {exportingWallet === wallet.address ? (
                        <>
                          <div className="loading" style={{width: '16px', height: '16px', margin: '0'}}></div>
                          Opening...
                        </>
                      ) : (
                        <>
                          <Key size={16} />
                          Export SOL Wallet
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="security-warning">
            <div className="warning-header">
              <AlertTriangle size={20} />
              <strong>SECURITY WARNING</strong>
            </div>
            <p>Exporting your private key gives full access to your wallet. Anyone with this key can:</p>
            <ul>
              <li>Transfer all your funds</li>
              <li>Access all your assets</li>
              <li>Control your wallet completely</li>
            </ul>
            <p><strong>Only proceed if you understand the risks!</strong></p>
          </div>
        </div>
      ) : (
        <div className="status error">
          <p>❌ No embedded wallets found</p>
          <p className="error-detail">
            Please create an embedded wallet first in the PRIMAPE app.
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletExportApp;
