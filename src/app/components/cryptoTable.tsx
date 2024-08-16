import { Account, columns } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Account[]> {
	// Fetch data from your API here.
	return [
		{
			accountName: "Account 1",
			publicKey: "0x1234567890",
			privateKey: "0x1234567890",
		},
		{
			accountName: "Account 2",
			publicKey: "0x1234567890",
			privateKey: "0x1234567890",
		},
	];
}

export default async function CryptoTable() {
	const data = await getData();

	return (
		<div className='container mx-auto py-10'>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
