import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    TOKEN_2022_PROGRAM_ID, 
    getMintLen, 
    createInitializeMetadataPointerInstruction, 
    createInitializeMintInstruction, 
    TYPE_SIZE, 
    LENGTH_SIZE, 
    ExtensionType,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';

export function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();

    async function createToken() {
        if (!wallet.publicKey || !wallet.sendTransaction) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            // Get form values
            const name = document.getElementById("name")?.value || "Default Token";
            const symbol = document.getElementById("symbol")?.value || "DFT";
            const imageUrl = document.getElementById("image")?.value || "";
            const initialSupply = document.getElementById("initialSupply")?.value || "1000000";

            const mintKeypair = Keypair.generate();
            
            // Create metadata object
            const metadata = {
                mint: mintKeypair.publicKey,
                name: name,
                symbol: symbol,
                uri: imageUrl,
                additionalMetadata: [],
            };

            // Calculate space needed
            const mintLen = getMintLen([ExtensionType.MetadataPointer]);
            const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
            const totalSpace = mintLen + metadataLen;
            
            const lamports = await connection.getMinimumBalanceForRentExemption(totalSpace);

            // Create the mint account with metadata
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: totalSpace, // Fixed: use totalSpace instead of just mintLen
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMetadataPointerInstruction(
                    mintKeypair.publicKey, 
                    wallet.publicKey, 
                    mintKeypair.publicKey, 
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeMintInstruction(
                    mintKeypair.publicKey, 
                    9, 
                    wallet.publicKey, 
                    null, 
                    TOKEN_2022_PROGRAM_ID
                ),
                createInitializeInstruction({
                    programId: TOKEN_2022_PROGRAM_ID,
                    mint: mintKeypair.publicKey,
                    metadata: mintKeypair.publicKey,
                    name: metadata.name,
                    symbol: metadata.symbol,
                    uri: metadata.uri,
                    mintAuthority: wallet.publicKey,
                    updateAuthority: wallet.publicKey,
                }),
            );
                
            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);
            
            console.log("Creating mint account...");
            const signature1 = await wallet.sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature1, 'confirmed');
            console.log("Mint created:", mintKeypair.publicKey.toBase58());

            // Create associated token account
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );
            
            console.log("Associated token account:", associatedToken.toBase58());
            
            const transaction2 = new Transaction().add(
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
            );
            
            transaction2.feePayer = wallet.publicKey;
            transaction2.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            
            console.log("Creating associated token account...");
            const signature2 = await wallet.sendTransaction(transaction2, connection);
            await connection.confirmTransaction(signature2, 'confirmed');

            // Mint tokens to the associated token account
            const mintAmount = parseInt(initialSupply) * Math.pow(10, 9); // Convert to smallest units (9 decimals)
            
            const transaction3 = new Transaction().add(
                createMintToInstruction(
                    mintKeypair.publicKey, 
                    associatedToken, 
                    wallet.publicKey, 
                    mintAmount, 
                    [], 
                    TOKEN_2022_PROGRAM_ID
                )
            );
            
            transaction3.feePayer = wallet.publicKey;
            transaction3.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            
            console.log("Minting tokens...");
            const signature3 = await wallet.sendTransaction(transaction3, connection);
            await connection.confirmTransaction(signature3, 'confirmed');

            console.log("Token creation completed!");
            alert(`Token created successfully!
            Mint Address: ${mintKeypair.publicKey.toBase58()}
            Associated Token Account: ${associatedToken.toBase58()}
            Initial Supply: ${initialSupply} tokens minted`);

        } catch (error) {
            console.error("Error creating token:", error);
            alert("Failed to create token. Check console for details.");
        }
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h1>Solana Token Launchpad</h1>
            <input 
                id="name"
                className='inputText' 
                type='text' 
                placeholder='Name'
            />
            <br />
            <input 
                id="symbol"
                className='inputText' 
                type='text' 
                placeholder='Symbol'
            />
            <br />
            <input 
                id="image"
                className='inputText' 
                type='text' 
                placeholder='Image URL'
            />
            <br />
            <input 
                id="initialSupply"
                className='inputText' 
                type='text' 
                placeholder='Initial Supply'
            />
            <br />
            <button onClick={createToken} className='btn'>
                Create a token
            </button>
        </div>
    );
}