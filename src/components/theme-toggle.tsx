"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();

	const isDarkMode = theme === "dark";

	const handleToggle = () => {
		setTheme(isDarkMode ? "light" : "dark");
	};

	return (
		<div className='flex items-center space-x-4'>
			<Label className='flex items-center'>
				<Sun className='h-5 w-5 text-yellow-500' />
				<span className='sr-only'>Light Mode</span>
			</Label>

			<Switch
				checked={isDarkMode}
				onCheckedChange={handleToggle}
				className='bg-gray-200 dark:bg-blue-500'
			/>

			<Label className='flex items-center'>
				<Moon className='h-5 w-5 text-gray-600 dark:text-white' />
				<span className='sr-only'>Dark Mode</span>
			</Label>
		</div>
	);
}
