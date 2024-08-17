import axios from "axios";
import toast from "react-hot-toast";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const SOL_RPC_URL = process.env.NEXT_PUBLIC_SOL_RPC!;

const useSol = () => {
	const getBalance = async (publicKey: string) => {
		try {
			const res = await axios.post(SOL_RPC_URL, {
				jsonrpc: "2.0",
				id: 1,
				method: "getBalance",
				params: [publicKey],
			});
			const balance = res.data.result.value / LAMPORTS_PER_SOL;
			return balance;
		} catch (error) {
			toast.error("Failed to get balance");
			console.error(error);
		}
	};
	return { getBalance };
};

export default useSol;
