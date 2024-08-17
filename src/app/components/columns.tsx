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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Account = {
	accountName: string;
	publicKey: string;
	privateKey: string;
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
						<DropdownMenuItem>View Balance</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

const PrivateKeyCell = ({ key }: { key: string }) => {
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
