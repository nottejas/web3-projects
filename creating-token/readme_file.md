# 🪙 Solana SPL Token Creator

A Node.js project for creating and minting custom SPL tokens on the Solana blockchain. This project demonstrates the complete token lifecycle from creation to minting on Solana's devnet.

## 🚀 Features

- **Token Mint Creation**: Create custom SPL tokens with configurable decimals
- **Token Minting**: Mint tokens to any wallet address
- **Wallet Management**: Generate and manage Solana keypairs
- **Associated Token Accounts**: Automatic creation of token accounts
- **Comprehensive Logging**: Detailed transaction and error logging
- **Phantom Wallet Integration**: Ready for wallet import and token viewing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Basic understanding of Solana blockchain concepts

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd creating-token
npm install
```

### 2. Generate Wallet (if needed)
```bash
# If you don't have a wallet file yet
solana-keygen new --outfile my-new-wallet.json
```

### 3. Get Devnet SOL
Visit [Solana Devnet Faucet](https://faucet.solana.com/) and request SOL for your wallet address.

### 4. Create Token Mint
```bash
node mint.js
```

### 5. Mint Tokens
```bash
node mintingTokens.js
```

## 📁 Project Structure

```
creating-token/
├── mint.js                 # Creates new token mint
├── mintingTokens.js        # Mints tokens to wallet
├── get-private-key.js      # Extracts private key for Phantom
├── my-new-wallet.json      # Your wallet keypair (DO NOT COMMIT)
├── mint-info.json          # Generated mint information
├── package.json            # Project dependencies
└── README.md              # This file
```

## 🔧 Configuration

### Token Settings (in mint.js)
```javascript
const decimals = 6;              // Token decimals (6 = 1.000000)
const mintAuthority = payer;     // Who can mint more tokens
const freezeAuthority = null;    // Who can freeze accounts (null = nobody)
```

### Minting Amount (in mintingTokens.js)
```javascript
await mintNewTokens(mint, recipientAddress, 100); // Mint 100 tokens
```


## 🔍 Viewing Your Tokens

### Solana Explorer
- [Your Wallet](https://explorer.solana.com/address/6BTe5UJWMkhdzgRDCfGfsyqTEMy5woUnng9Hj3JPSkgL?cluster=devnet)
- [Your Token Mint](https://explorer.solana.com/address/BDPAJnnYzvqi3VXjoEjWaeZhKZjjmfiTzqG88HtY2eRY?cluster=devnet)
- [Your Token Account](https://explorer.solana.com/address/FAabuxfhp9fquz5eSjYS46e6haRLKDLmSzWomxKfepvT?cluster=devnet)

### Phantom Wallet Setup
1. Switch Phantom to **Devnet**
2. Import your wallet using private key from `my-new-wallet.json`

## 🛠️ Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Create Mint | `node mint.js` | Creates a new token mint |
| Mint Tokens | `node mintingTokens.js` | Mints tokens to specified address |
| Get Private Key | `node get-private-key.js` | Extracts private key for wallet import |

## 📦 Dependencies

```json
{
  "@solana/web3.js": "^1.98.2",
  "@solana/spl-token": "^0.4.13",
  "bs58": "^5.0.0"
}
```

## 🔒 Security

- **Never commit** `my-new-wallet.json` - it contains your private key
- **Keep backups** of your wallet file in a secure location  
- **This is devnet** - for testing purposes only
- **Private keys** should never be shared or exposed

## 🧪 Testing

The project runs on Solana's **devnet** which is perfect for testing:
- Free SOL from faucets
- No real money at risk
- Full blockchain functionality
- Easy debugging and exploration

## 🚀 Next Steps

1. **Add Metadata**: Use Metaplex to add name, symbol, and image to your token
2. **Transfer Functions**: Implement token transfer functionality
3. **Burn Tokens**: Add ability to burn (destroy) tokens
4. **Multi-sig**: Implement multi-signature mint authority
5. **Frontend**: Create a web interface for token operations

## 🐛 Troubleshooting

### Common Issues

**"insufficient funds" error**
- Get devnet SOL from [faucet.solana.com](https://faucet.solana.com/)

**"bigint: Failed to load bindings" warning**
- This is just a performance warning, functionality is not affected
- Run `npm run rebuild` if needed

**Cannot read properties of undefined**
- Check that all imports are correct
- Ensure you're using the right function signatures for your @solana/spl-token version

### Getting Help

- [Solana Documentation](https://docs.solana.com/)
- [SPL Token Documentation](https://spl.solana.com/token)
- [Solana Stack Exchange](https://solana.stackexchange.com/)

## 📄 License

MIT License - feel free to use this project as a starting point for your own token projects!

---

**⚠️ Disclaimer**: This project is for educational purposes. Always do your own research before deploying tokens on mainnet.