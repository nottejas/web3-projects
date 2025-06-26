const { PublicKey } = require('@solana/web3.js');
const { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

// Replace these with your actual values
const userAddress = new PublicKey('9gWuQi3JhYzdjx6EcBeXFc5i9AW5Gzdd1k2H7JKdDfhw');
const tokenMintAddress = new PublicKey('37iyRf34M8y2pjq7RSE87DTWjx3TpRtJY3BpWrhFCjdv');

// Derive the associated token address
const getAssociatedTokenAddress = (mintAddress, ownerAddress) => {
    return PublicKey.findProgramAddressSync(
        [
            ownerAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAddress.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
};

const [associatedTokenAddress, bump] = getAssociatedTokenAddress(tokenMintAddress, userAddress);
console.log(`Associated Token Address: ${associatedTokenAddress.toBase58()}, bump: ${bump}`);

