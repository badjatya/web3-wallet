import axios from "axios";
import toast from "react-hot-toast";

const ETH_RPC_URL = process.env.NEXT_PUBLIC_ETH_RPC!;

const useEth = () => {
	const getBalance = async (publicKey: string) => {
		try {
			const res = await axios.post(ETH_RPC_URL, {
				jsonrpc: "2.0",
				id: 1,
				method: "eth_getBalance",
				params: [publicKey, "latest"],
			});
			const balance = parseInt(res.data.result, 16) / 10 ** 18;
			return balance;
		} catch (error) {
			toast.error("Failed to get balance");
			console.error(error);
		}
	};
	return { getBalance };
};

export default useEth;
