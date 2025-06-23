// get-private-key.js
import { readFileSync } from 'fs';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';

// Load your wallet
const secretKey = JSON.parse(readFileSync('./my-new-wallet.json', 'utf8'));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

console.log("Your wallet info for Phantom:");
console.log("Public Key:", keypair.publicKey.toBase58());
console.log("Private Key (Base58):", bs58.encode(keypair.secretKey));
console.log("\n Keep your private key secret!");