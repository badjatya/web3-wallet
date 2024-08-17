import React from "react";
import { GithubIcon, LinkedinIcon, Twitter, Globe } from "lucide-react"; // Importing Lucide icons

const Footer: React.FC = () => {
	return (
		<footer className='absolute bottom-0 left-0 right-0 py-4 text-center'>
			<div className='container mx-auto flex items-center justify-center px-4 space-x-4'>
				<p className='text-sm text-primary'>
					Created by Archit Badjatya
				</p>
				<div className='flex space-x-4'>
					<a
						href='https://github.com/badjatya'
						target='_blank'
						rel='noopener noreferrer'
						aria-label='GitHub'
						className='text-primary  transition-colors'>
						<GithubIcon className='w-4 h-4' />
					</a>
					<a
						href='https://linkedin.com/in/badjatya'
						target='_blank'
						rel='noopener noreferrer'
						aria-label='LinkedIn'
						className='text-primary transition-colors'>
						<LinkedinIcon className='w-4 h-4' />
					</a>
					<a
						href='https://twitter.com/architbadjatya'
						target='_blank'
						rel='noopener noreferrer'
						aria-label='Twitter'
						className='text-primary transition-colors'>
						<Twitter className='w-4 h-4' />
					</a>
					<a
						href='https://badjatya.vercel.app'
						target='_blank'
						rel='noopener noreferrer'
						aria-label='Portfolio'
						className='text-primary transition-colors'>
						<Globe className='w-4 h-4' />
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
