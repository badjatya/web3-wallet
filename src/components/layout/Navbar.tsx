import { ModeToggle } from "../theme-toggle";

type Props = {};

const Navbar = (props: Props) => {
	return (
		<div>
			<nav className='flex justify-between items-center p-4'>
				<h1 className='text-2xl font-bold'>Web3 Wallet</h1>
				<ModeToggle />
			</nav>
		</div>
	);
};

export default Navbar;
