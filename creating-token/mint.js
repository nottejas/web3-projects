// mint.js
import { readFileSync } from 'fs';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token';

//  Load the secret key from your wallet file
const secretKey = JSON.parse(readFileSync('./my-new-wallet.json', 'utf8'));
const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));

//  Setup connection to devnet
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

//  Use payer's public key as mint authority
const mintAuthority = payer.publicKey;

//  Optional: Freeze authority (can be null)
const freezeAuthority = null;

//  Decimals for your token (6 = 1.000000)
const decimals = 6;

async function main() {
  try {
    console.log(" Creating token mint...");
    console.log(" Payer address:", payer.publicKey.toBase58());
    
    const mintAddress = await createMint(
      connection,           // Connection
      payer,                // Fee payer (must be Keypair)
      mintAuthority,        // Mint authority (PublicKey)
      freezeAuthority,      // Freeze authority (PublicKey or null)
      decimals,             // Decimals
      undefined,            // Keypair (optional, let it generate)
      undefined,            // Confirm options (optional)
      TOKEN_PROGRAM_ID      // Program ID
    );

    console.log(" Token mint created successfully!");
    console.log("  Mint address:", mintAddress.toBase58());
    console.log(" Mint authority:", mintAuthority.toBase58());
    console.log(" Decimals:", decimals);
    
    // Save mint address to a file for future reference
    const mintInfo = {
      mintAddress: mintAddress.toBase58(),
      mintAuthority: mintAuthority.toBase58(),
      decimals: decimals,
      createdAt: new Date().toISOString()
    };
    
    import('fs').then(fs => {
      fs.writeFileSync('./mint-info.json', JSON.stringify(mintInfo, null, 2));
      console.log(" Mint info saved to mint-info.json");
    });
    
  } catch (error) {
    console.error(" Error creating token mint:");
    console.error("Error message:", error.message);
    
    // More detailed error logging
    if (error.logs) {
      console.error("Transaction logs:", error.logs);
    }
    
    // Check if it's a balance issue
    if (error.message.includes('insufficient funds')) {
      console.log(" Tip: Make sure your wallet has enough SOL for transaction fees");
      console.log("   You can get devnet SOL from: https://faucet.solana.com/");
    }
  }
}

main();