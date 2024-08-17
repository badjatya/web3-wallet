"use client";

import { useState, useEffect } from "react";
import { Account, columns } from "./columns";
import { DataTable } from "./data-table";

import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

const path = {
	sol: "m/44'/501'/0'/0'",
	eth: "m/44'/60'/0'/0'",
};

export default function CryptoTable() {
	const [data, setData] = useState<{ [key: string]: Account[] }>({
		sol: [],
		eth: [],
	});
	const [seed, setSeed] = useState<string>("");
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
		const solAccountCount = localStorage.getItem("solAccountCount") || "0";
		const ethAccountCount = localStorage.getItem("ethAccountCount") || "0";

		setSeed(seed);
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
				const privateKey =
					nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
				const publicKey =
					Keypair.fromSecretKey(privateKey).publicKey.toBase58();
				solAccounts.push({ accountName, publicKey, privateKey });
			}
		} else if (selectedCrypto === "eth") {
			// for (let i = 0; i < parseInt(ethAccountCount); i++) {
			// 	const accountName = `Account ${i + 1}`;
			// 	const publicKey = `ETH Account ${i + 1} Public Key`;
			// 	const privateKey = `ETH Account ${i + 1} Private Key`;
			// 	ethAccounts.push({ accountName, publicKey, privateKey });
			// }
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
