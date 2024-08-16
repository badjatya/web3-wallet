"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
	},
	{
		accessorKey: "privateKey",
		header: "Private Key",
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
							onClick={() =>
								navigator.clipboard.writeText(privateKey)
							}>
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
