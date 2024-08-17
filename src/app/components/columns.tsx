"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye, EyeOff, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { Row } from "@tanstack/react-table";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSol from "@/hooks/useSol";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@radix-ui/react-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Account = {
	accountName: string;
	publicKey: string;
	privateKey: string;
	balance: number;
};

export const columns: ColumnDef<Account>[] = [
	{
		accessorKey: "accountName",
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}>
					Name
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		accessorKey: "publicKey",
		header: "Public Key",
		cell: ({ row }) => {
			const key = row.original.publicKey;
			const copyToClipboard = async () => {
				try {
					await navigator.clipboard.writeText(key);
					toast("Public key copied to clipboard!");
				} catch (err) {
					toast("Failed to copy the public key.");
				}
			};
			return (
				<div className='flex items-center'>
					<p className='mr-2'>{key}</p>
					<button
						onClick={copyToClipboard}
						className='p-1 ml-2 rounded hover:bg-gray-200 transition'
						aria-label='Copy to Clipboard'>
						<Copy className='w-4 h-4' />
					</button>
				</div>
			);
		},
	},
	{
		accessorKey: "privateKey",
		header: "Private Key",
		cell: ({ row }) => {
			return <PrivateKeyCell row={row} />;
		},
		// cell: ({ row }) => {
		// 	const key = row.original.privateKey;
		// 	const [visible, setVisible] = useState(false);

		// 	const toggleVisibility = () => {
		// 		setVisible(!visible);
		// 	};

		// 	const copyToClipboard = async () => {
		// 		try {
		// 			await navigator.clipboard.writeText(key);
		// 			toast("Private key copied to clipboard!");
		// 		} catch (err) {
		// 			toast("Failed to copy the private key.");
		// 		}
		// 	};
		// 	return (
		// 		<div className='flex items-center'>
		// 			<p className='mr-2'>{visible ? key : "*".repeat(20)}</p>
		// 			<button
		// 				onClick={toggleVisibility}
		// 				className='p-1 rounded hover:bg-gray-200 transition'
		// 				aria-label='Toggle Key Visibility'>
		// 				{visible ? (
		// 					<EyeOff className='w-4 h-4' />
		// 				) : (
		// 					<Eye className='w-4 h-4' />
		// 				)}
		// 			</button>
		// 			<button
		// 				onClick={copyToClipboard}
		// 				className='p-1 ml-2 rounded hover:bg-gray-200 transition'
		// 				aria-label='Copy to Clipboard'>
		// 				<Copy className='w-4 h-4' />
		// 			</button>
		// 		</div>
		// 	);
		// },
	},
	{
		accessorKey: "balance",
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}>
					Balance
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const publicKey = row.original.publicKey;
			const privateKey = row.original.privateKey;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(publicKey)
							}>
							Copy Public key
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => {
								navigator.clipboard.writeText(privateKey);
							}}>
							Copy Private key
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<Send row={row} />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const PrivateKeyCell = ({ row }: { row: Row<Account> }) => {
	const key = row.original.privateKey;
	const [visible, setVisible] = useState(false);

	const toggleVisibility = () => {
		setVisible(!visible);
	};

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(key);
			toast("Private key copied to clipboard!");
		} catch (err) {
			toast("Failed to copy the private key.");
		}
	};

	return (
		<div className='flex items-center'>
			<p className='mr-2'>{visible ? key : "*".repeat(20)}</p>
			<button
				onClick={toggleVisibility}
				className='p-1 rounded hover:bg-gray-200 transition'
				aria-label='Toggle Key Visibility'>
				{visible ? (
					<EyeOff className='w-4 h-4' />
				) : (
					<Eye className='w-4 h-4' />
				)}
			</button>
			<button
				onClick={copyToClipboard}
				className='p-1 ml-2 rounded hover:bg-gray-200 transition'
				aria-label='Copy to Clipboard'>
				<Copy className='w-4 h-4' />
			</button>
		</div>
	);
};

interface SendSolFormInputs {
	publicKey: string;
	amount: number;
}

const Send = ({ row }: { row: Row<Account> }) => {
	const balance = row.original.balance;
	const { sendSol } = useSol();

	const [transactionId, setTransactionId] = useState<string | null>(null);

	const SendSolSchema = z.object({
		publicKey: z.string().min(1, "Public key is required"),
		amount: z
			.number()
			.min(0.00001, "Amount must be at least 0.00001")
			.max(balance, `Amount exceeds available balance (${balance} SOL)`),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SendSolFormInputs>({
		resolver: zodResolver(SendSolSchema),
		defaultValues: {
			publicKey: "",
			amount: 0,
		},
	});

	const onSubmit: SubmitHandler<SendSolFormInputs> = async (data) => {
		const id = await sendSol(
			row.original.privateKey,
			data.publicKey,
			data.amount
		);
		setTransactionId(id);
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(transactionId!);
		toast("Transaction ID copied to clipboard!");
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Send</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold'>
						{transactionId ? "Transaction Successful" : "Send SOL"}
					</DialogTitle>
					{transactionId && (
						<DialogDescription>
							Your transaction has been successfully sent!
						</DialogDescription>
					)}
				</DialogHeader>
				<form className='space-y-4'>
					{!transactionId && (
						<>
							<div className='flex flex-col gap-2'>
								<Label htmlFor='publicKey' className=''>
									Recipient Public Key
								</Label>
								<Input
									id='publicKey'
									{...register("publicKey")}
									className='col-span-3'
									placeholder="Enter recipient's public key"
								/>
								{errors.publicKey && (
									<p className='col-span-4 text-red-500 text-sm'>
										{errors.publicKey.message}
									</p>
								)}
							</div>

							<div className='flex flex-col gap-2'>
								<Label htmlFor='amount' className=''>
									Amount (SOL)
								</Label>
								<Input
									id='amount'
									type='number'
									step='0.00001'
									{...register("amount", {
										valueAsNumber: true,
									})}
									className='col-span-3'
									placeholder='Enter amount to send'
								/>
								{errors.amount && (
									<p className='col-span-4 text-red-500 text-sm'>
										{errors.amount.message}
									</p>
								)}
							</div>
						</>
					)}

					<DialogFooter>
						{transactionId ? (
							<Button onClick={copyToClipboard}>
								Copy Transaction ID
							</Button>
						) : (
							<Button onClick={handleSubmit(onSubmit)}>
								Send
							</Button>
						)}
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
