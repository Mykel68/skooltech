import type React from 'react';
import '@/app/globals.css';
// import { ThemeProvider } from '@/components/theme-provider';
import { Mona_Sans as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata = {
	title: 'SkoolTech - School Management System',
	description:
		'Revolutionizing school management with technology solutions for exam management, result processing, and more.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<head />
			<body
				className={cn(
					'min-h-screen bg-background font-sans antialiased',
					fontSans.variable
				)}
			>
				{/* <ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				> */}
				{children}
				{/* </ThemeProvider> */}
			</body>
		</html>
	);
}
