"use client";
import { useState, useEffect } from "react";
import { ModeToggle } from "../theme-toggle";
import { Button } from "../ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import toast from "react-hot-toast";

type Props = {};

const Navbar = (props: Props) => {
	const [mnemonic, setMnemonic] = useState<string | null>(null);
	const [showDialog, setShowDialog] = useState(true);

	useEffect(() => {
		const mn = localStorage.getItem("mnemonic");
		if (mn) {
			setMnemonic(mn);
			setShowDialog(false);
		}
	}, []);

	const handleCreateMnemonic = async () => {
		const mn = generateMnemonic();
		setMnemonic(mn);
	};

	const handleCopyMnemonic = () => {
		if (mnemonic) {
			navigator.clipboard.writeText(mnemonic);
		}
	};

	const handleCreateWallet = async () => {
		if (mnemonic) {
			toast.success("Wallet created successfully");
			localStorage.setItem("mnemonic", mnemonic);
			localStorage.setItem(
				"seed",
				mnemonicToSeedSync(mnemonic).toString("hex")
			);
			localStorage.setItem("solAccountCount", "0");
			localStorage.setItem("ethAccountCount", "0");
			setShowDialog(false);
		}
	};

	const handleDeleteWallet = () => {
		localStorage.removeItem("mnemonic");
		localStorage.removeItem("seed");
		localStorage.removeItem("solAccountCount");
		localStorage.removeItem("ethAccountCount");
		setMnemonic(null);
		setShowDialog(true);
		window.location.reload();
	};
	return (
		<nav className='flex justify-between items-center'>
			<h1 className='text-xl font-bold lg:text-2xl'>Web3 Wallet</h1>
			<div className='flex items-center gap-4 lg:gap-8'>
				<Button size='sm' variant='outline' asChild>
					<a
						href='https://github.com/badjatya/web3-wallet'
						target='_blank'
						rel='noopener noreferrer'
						aria-label='GitHub'
						className='text-primary  transition-colors'>
						Source Code
					</a>
				</Button>
				{!showDialog && (
					<Button
						size='sm'
						variant={"destructive"}
						onClick={handleDeleteWallet}>
						Delete Wallet
					</Button>
				)}
				{showDialog && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button size='sm' onClick={handleCreateMnemonic}>
								Create Wallet
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle className='text-3xl'>
									Create web3 wallet
								</AlertDialogTitle>
								<AlertDialogDescription>
									Write down these words in this exact order.
									You can use them to access your wallet, make
									sure you protect them. Click on the words to
									copy
								</AlertDialogDescription>
								<div className='p-6 border rounded-lg flex items-center gap-4  flex-wrap bg-gradient-to-r justify-stretch from-indigo-500 via-purple-500 to-pink-500 cursor-pointer'>
									{mnemonic
										?.split(" ")
										?.map((word, index) => (
											<div
												key={index}
												onClick={handleCopyMnemonic}
												className='flex items-center p-2 rounded-lg border border-transparent bg-white text-gray-800 font-semibold text-center shadow-md transition transform hover:-translate-y-1 hover:shadow-lg gap-2'>
												<span className='text-xs text-indigo-500'>
													{index + 1}.
												</span>
												<p className='text-sm'>
													{word}
												</p>
											</div>
										))}
								</div>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={handleCreateWallet}>
									Create
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				)}

				<ModeToggle />
			</div>
		</nav>
	);
};

export default Navbar;
