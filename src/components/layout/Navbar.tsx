import { ModeToggle } from "../theme-toggle";
import { Button } from "../ui/button";

type Props = {};

const Navbar = (props: Props) => {
	return (
		<nav className='flex justify-between items-center'>
			<h1 className='text-xl font-bold lg:text-2xl'>Web3 Wallet</h1>
			<div className='flex items-center gap-4 lg:gap-8'>
				<Button size='sm'>Create Wallet</Button>
				<ModeToggle />
			</div>
		</nav>
	);
};

export default Navbar;
