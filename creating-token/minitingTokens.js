import { readFileSync } from 'fs';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Keypair, Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

// Load wallet from file (more secure than hardcoding)
const secretKey = JSON.parse(readFileSync('./my-new-wallet.json', 'utf8'));
const payer = Keypair.fromSecretKey(Uint8Array.from(secretKey));

// Fixed typo: mintAuthority (not mintAthority)
const mintAuthority = payer;
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

async function createMintForToken(payer, mintAuthority) {
    console.log("Creating token mint...");
    
    const mint = await createMint(
        connection,
        payer,                    // Fee payer
        mintAuthority,            // Mint authority
        null,                     // Freeze authority (null = no freeze)
        6,                        // Decimals (6 = 1.000000)
        undefined,                // Keypair (let it generate)
        undefined,                // Confirm options
        TOKEN_PROGRAM_ID          // Token program
    );
    
    console.log('Mint created at:', mint.toBase58());
    return mint;
}

async function mintNewTokens(mint, to, amount) {
    console.log(`Minting ${amount} tokens to ${to}...`);
    
    // Get or create associated token account
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,                    // Fee payer
        mint,                     // Mint address
        new PublicKey(to),        // Owner of the token account
        false,                    // Allow owner off curve
        'confirmed',              // Commitment
        undefined,                // Confirm options
        TOKEN_PROGRAM_ID          // Token program
    );
    
    console.log('Token account:', tokenAccount.address.toBase58());
    
    // Mint tokens to the account
    await mintTo(
        connection,
        payer,                    // Fee payer
        mint,                     // Mint address
        tokenAccount.address,     // Destination token account
        mintAuthority,            // Mint authority (must sign)
        amount * Math.pow(10, 6), // Amount (multiply by 10^decimals)
        [],                       // Multi-signers
        'confirmed',              // Commitment
        TOKEN_PROGRAM_ID          // Token program
    );
    
    console.log(`Minted ${amount} tokens to ${tokenAccount.address.toBase58()}`);
    
    return tokenAccount;
}

async function main() {
    try {
        console.log(" Payer address:", payer.publicKey.toBase58());
        console.log(" Mint authority:", mintAuthority.publicKey.toBase58());
        
        // Create the token mint
        const mint = await createMintForToken(payer, mintAuthority.publicKey);
        
        //  Mint 100 tokens to the payer's wallet
        await mintNewTokens(mint, mintAuthority.publicKey.toBase58(), 100);
        
        console.log("\n Token creation and minting completed!");
        console.log("Summary:");
        console.log(`   • Mint address: ${mint.toBase58()}`);
        console.log(`   • Tokens minted: 100`);
        console.log(`   • Recipient: ${mintAuthority.publicKey.toBase58()}`);
        
    } catch (error) {
        console.error("Error:", error.message);
        
        if (error.message.includes('insufficient funds')) {
            console.log("Get devnet SOL from: https://faucet.solana.com/");
        }
    }
}

main();