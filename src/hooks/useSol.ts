import axios from "axios";
import toast from "react-hot-toast";
import {
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
	Keypair,
	PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";

const SOL_RPC_URL = process.env.NEXT_PUBLIC_SOL_RPC!;

const useSol = () => {
	// Function to get balance
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

	// Function to send SOL
	const sendSol = async (
		privateKey: string,
		recipientPublicKey: string,
		amount: number
	) => {
		try {
			// Step 1: Decode the private key
			const fromKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
			const toPublicKey = new PublicKey(recipientPublicKey);

			// Step 2: Get the recent blockhash
			const { data: recentBlockhashResponse } = await axios.post(
				SOL_RPC_URL,
				{
					jsonrpc: "2.0",
					id: 1,
					method: "getRecentBlockhash",
				}
			);
			const recentBlockhash =
				recentBlockhashResponse.result.value.blockhash;

			// Step 3: Create the transaction
			const transaction = new Transaction({ recentBlockhash }).add(
				SystemProgram.transfer({
					fromPubkey: fromKeypair.publicKey,
					toPubkey: toPublicKey,
					lamports: amount * LAMPORTS_PER_SOL, // Convert SOL to lamports
				})
			);

			// Step 4: Sign the transaction
			transaction.sign(fromKeypair);

			// Step 5: Serialize and encode the transaction
			const serializedTransaction = transaction.serialize();
			const base58Transaction = bs58.encode(serializedTransaction);

			// Step 6: Send the transaction
			const { data: sendTransactionResponse } = await axios.post(
				SOL_RPC_URL,
				{
					jsonrpc: "2.0",
					id: 1,
					method: "sendTransaction",
					params: [base58Transaction],
				}
			);

			toast.success("Transaction successful!");
			console.log(
				"Transaction signature:",
				sendTransactionResponse.result
			);
			return sendTransactionResponse.result;
		} catch (error) {
			toast.error("Transaction failed");
			console.error("Error:", error);
		}
	};

	return { getBalance, sendSol };
};

export default useSol;
