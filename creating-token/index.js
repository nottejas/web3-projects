import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl('devnet'));

async function airdrop(publicKey, amount) {
    const airdropSignature = await connection.requestAirdrop(new PublicKey(publicKey), amount)
    connection.confirmTransaction({signature: airdropSignature})
}

airdrop("6BTe5UJWMkhdzgRDCfGfsyqTEMy5woUnng9Hj3JPSkgL", LAMPORTS_PER_SOL).then(signature => {
    console.log('Airdrop signature: ', signature); 
})