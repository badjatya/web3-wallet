"use client";

import { useState } from "react";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	VisibilityState,
	SortingState,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	selectedCrypto: string;
	setSelectedCrypto: (selectedCrypto: string) => void;
	cryptos: string[];
	accountCount: {
		[s: string]: number;
		sol: number;
		eth: number;
	};
	setAccountCount: (accountCount: { sol: number; eth: number }) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	selectedCrypto,
	setSelectedCrypto,
	cryptos,
	accountCount,
	setAccountCount,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	const addAccount = () => {
		const count = accountCount[selectedCrypto] + 1;
		setAccountCount({ ...accountCount, [selectedCrypto]: count });
		localStorage.setItem(selectedCrypto + "AccountCount", count.toString());
		toast("New Account added!");
	};

	return (
		<div>
			<div className='flex items-center justify-between py-4 gap-4'>
				<div className='flex items-center gap-4'>
					<Select
						value={selectedCrypto}
						onValueChange={(value) => setSelectedCrypto(value)}>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Theme' />
						</SelectTrigger>
						<SelectContent>
							{cryptos.map((crypto) => (
								<SelectItem key={crypto} value={crypto}>
									{crypto}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Input
						placeholder='Filter account...'
						value={
							(table
								.getColumn("accountName")
								?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table
								.getColumn("accountName")
								?.setFilterValue(event.target.value)
						}
						className='max-w-sm'
					/>
				</div>
				<div className='flex items-center gap-4'>
					<Button
						variant={"secondary"}
						onClick={addAccount}
						className='ml-auto'>
						Add Account
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='ml-auto'>
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className='capitalize'
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>
		</div>
	);
}
