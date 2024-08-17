"use client";

import { useState, useEffect } from "react";
import { Account, columns } from "./columns";
import { DataTable } from "./data-table";

import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Wallet, HDNodeWallet } from "ethers";
import nacl from "tweetnacl";
import { mnemonicToSeedSync } from "bip39";
import getPrivateKey from "./privateKey";

export default function CryptoTable() {
	const [data, setData] = useState<{ [key: string]: Account[] }>({
		sol: [],
		eth: [],
	});
	const [seed, setSeed] = useState<string>("");
	const [mnemonic, setMnemonic] = useState<string>("");
	const [cryptos, setCryptos] = useState<string[]>(["sol", "eth"]);
	const [selectedCrypto, setSelectedCrypto] = useState<string>("sol");
	const [accountCount, setAccountCount] = useState<{
		sol: number;
		eth: number;
	}>({
		sol: 0,
		eth: 0,
	});

	useEffect(() => {
		const seed = localStorage.getItem("seed") || "";
		const mne = localStorage.getItem("mnemonic") || "";
		const solAccountCount = localStorage.getItem("solAccountCount") || "0";
		const ethAccountCount = localStorage.getItem("ethAccountCount") || "0";

		setSeed(seed);
		setMnemonic(mne);
		setAccountCount({
			sol: parseInt(solAccountCount),
			eth: parseInt(ethAccountCount),
		});
	}, []);

	useEffect(() => {
		const solAccounts: Account[] = [];
		const ethAccounts: Account[] = [];
		if (selectedCrypto === "sol") {
			for (let i = 0; i < accountCount.sol; i++) {
				const accountName = `Account ${i + 1}`;
				const path = `m/44'/501'/${i}'/0'`;
				const derivedSeed = derivePath(path, seed).key;
				const privateKeyUInt8Array =
					nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
				const privateKey = getPrivateKey({
					privateKey: privateKeyUInt8Array,
				});
				const publicKey =
					Keypair.fromSecretKey(
						privateKeyUInt8Array
					).publicKey.toBase58();
				solAccounts.push({ accountName, publicKey, privateKey });
			}
		} else if (selectedCrypto === "eth") {
			for (let i = 0; i < accountCount.eth; i++) {
				const accountName = `Account ${i + 1}`;
				const path = `m/44'/60'/${i}'/0'`;
				const ethSeed = mnemonicToSeedSync(mnemonic);
				const hdNode = HDNodeWallet.fromSeed(ethSeed);
				const child = hdNode.derivePath(path);
				const privateKey = child.privateKey;
				const wallet = new Wallet(privateKey);
				const publicKey = wallet.address;
				ethAccounts.push({
					accountName,
					publicKey,
					privateKey,
				});
			}
		}
		setData({ sol: solAccounts, eth: ethAccounts });
	}, [seed, accountCount.sol, accountCount.eth, selectedCrypto]);

	return (
		<div className='w-full py-4 lg:py-8'>
			<DataTable
				setSelectedCrypto={setSelectedCrypto}
				selectedCrypto={selectedCrypto}
				setAccountCount={setAccountCount}
				accountCount={accountCount}
				cryptos={cryptos}
				columns={columns}
				data={data[selectedCrypto]}
			/>
		</div>
	);
}
