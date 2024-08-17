"use client";

import { useState, useEffect } from "react";
import { Account, columns } from "./columns";
import { DataTable } from "./data-table";

import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

export default function CryptoTable() {
	const seed = localStorage.getItem("seed") || "";
	const solAccountCount = localStorage.getItem("solAccountCount") || "0";
	const ethAccountCount = localStorage.getItem("ethAccountCount") || "0";

	const [data, setData] = useState<{ [key: string]: Account[] }>({
		sol: [],
		eth: [],
	});
	const [selectedCrypto, setSelectedCrypto] = useState<string>("sol");

	useEffect(() => {
		const solAccounts: Account[] = [];
		const ethAccounts: Account[] = [];
		for (let i = 0; i < parseInt(solAccountCount); i++) {
			const accountName = `Account ${i + 1}`;
			const path = `m/44'/501'/${i}'/0'`;
			const derivedSeed = derivePath(path, seed).key;
			const privateKey =
				nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
			const publicKey =
				Keypair.fromSecretKey(privateKey).publicKey.toBase58();
			solAccounts.push({ accountName, publicKey, privateKey });
		}
		// for (let i = 0; i < parseInt(ethAccountCount); i++) {
		// 	const accountName = `Account ${i + 1}`;
		// 	const publicKey = `ETH Account ${i + 1} Public Key`;
		// 	const privateKey = `ETH Account ${i + 1} Private Key`;
		// 	ethAccounts.push({ accountName, publicKey, privateKey });
		// }
		setData({ sol: solAccounts, eth: ethAccounts });
	}, [seed, solAccountCount, ethAccountCount]);

	return (
		<div className='container mx-auto py-10'>
			<DataTable columns={columns} data={data[selectedCrypto]} />
		</div>
	);
}
