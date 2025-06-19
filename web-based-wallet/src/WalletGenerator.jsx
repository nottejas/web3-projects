// bip39 - generate mnemonics
// bip32 - hd key derivation
// ether.js - show eth compatible addresses

import { Buffer } from "buffer";
window.Buffer = Buffer; // injects buffer for bips to work in browser 
import * as bip39 from "bip39";
import BIP32Factory from "bip32";
import * as ecc from "tiny-secp256k1";
import { ethers } from "ethers";

const bip32 = BIP32Factory(ecc);
import { useState } from "react"
import React from "react";
const WalletGenerator = () => {
    const [mnemonic, setMnemonic] = useState("");
    const [wallets, setWallets] = useState([]);

    const generateMnemonic = () => {
        const phrase = bip39.generateMnemonic();
        setMnemonic(phrase);
        setWallets([])
    }

    const addWallet = () => {
        if (!mnemonic) return;

        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const root = bip32.fromSeed(seed);

        const index = wallets.length;
        const path = `m/44'/60'/0'/0/${index}`;
        const child = root.derivePath(path);

        if (!child.privateKey) {
            console.error("No private key found for path:", path);
            return;
        }

        const privateKeyHex = ethers.hexlify(child.privateKey); // safer
        const wallet = new ethers.Wallet(privateKeyHex);

        setWallets([...wallets, { path, publicKey: wallet.address }]);
    };




    return (
        <div className="p-4 space-y-4">
            <button onClick={generateMnemonic} className="bg-blue-600 text-white px-4 py-2 rounded">
                Generate Mnemonic
            </button>
            {mnemonic && (
                <div className="border p-3 bg-gray-100 rounded">
                    <strong>Mnemonic:</strong>  <br />
                    <span>{mnemonic}</span>
                </div>
            )}
            {mnemonic && (
                <button onClick={addWallet} className="bg-green-600 text-white px-4 py-2 rounded">
                    Add wallet
                </button>
            )}
            <div>
                {wallets.map((w, i) => (
                    <div key={i} className="p-2 border-b">
                        <div><strong>Wallet {i}</strong></div>
                        <div><code>{w.path}</code></div>
                        <div>Public Key (Address): <code>{w.publicKey}</code></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WalletGenerator