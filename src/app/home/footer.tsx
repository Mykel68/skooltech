'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/seperator';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = [
		{
			title: 'Product',
			links: [
				{ name: 'Features', href: '#features' },
				{ name: 'Services', href: '#services' },
				{ name: 'Pricing', href: '#' },
				{ name: 'Demo', href: '#demo' },
				{ name: 'Roadmap', href: '#' },
			],
		},
		{
			title: 'Company',
			links: [
				{ name: 'About Us', href: '#about' },
				{ name: 'Careers', href: '#' },
				{ name: 'Blog', href: '#' },
				{ name: 'Press', href: '#' },
				{ name: 'Partners', href: '#' },
			],
		},
		{
			title: 'Resources',
			links: [
				{ name: 'Documentation', href: '#' },
				{ name: 'Tutorials', href: '#' },
				{ name: 'Support', href: '#' },
				{ name: 'FAQ', href: '#faq' },
				{ name: 'Community', href: '#' },
			],
		},
		{
			title: 'Legal',
			links: [
				{ name: 'Privacy Policy', href: '#' },
				{ name: 'Terms of Service', href: '#' },
				{ name: 'Cookie Policy', href: '#' },
				{ name: 'GDPR', href: '#' },
				{ name: 'Contact', href: '#contact' },
			],
		},
	];

	return (
		<footer className='bg-muted/50 border-t'>
			<div className='container px-4 md:px-6 py-12'>
				<div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6'>
					<motion.div
						className='col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<Link
							href='/'
							className='flex items-center space-x-2 mb-4'
						>
							<div className='bg-primary rounded-md p-1'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='h-6 w-6 text-primary-foreground'
								>
									<path d='M22 10v6M2 10l10-5 10 5-10 5z' />
									<path d='M6 12v5c0 2 2 3 6 3s6-1 6-3v-5' />
								</svg>
							</div>
							<span className='font-bold text-xl'>SkoolTech</span>
						</Link>
						<p className='text-sm text-muted-foreground mb-4'>
							Revolutionizing school management with innovative
							technology solutions for exam management, result
							processing, and more.
						</p>
						<div className='space-y-4'>
							<p className='text-sm font-medium'>
								Subscribe to our newsletter
							</p>
							<div className='flex gap-2'>
								<Input
									placeholder='Enter your email'
									className='max-w-[220px]'
								/>
								<Button>Subscribe</Button>
							</div>
							<div className='flex space-x-4'>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground'
								>
									<Facebook className='h-5 w-5' />
									<span className='sr-only'>Facebook</span>
								</Link>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground'
								>
									<Twitter className='h-5 w-5' />
									<span className='sr-only'>Twitter</span>
								</Link>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground'
								>
									<Instagram className='h-5 w-5' />
									<span className='sr-only'>Instagram</span>
								</Link>
								<Link
									href='#'
									className='text-muted-foreground hover:text-foreground'
								>
									<Linkedin className='h-5 w-5' />
									<span className='sr-only'>LinkedIn</span>
								</Link>
							</div>
						</div>
					</motion.div>

					{footerLinks.map((group, i) => (
						<motion.div
							key={i}
							className='space-y-4'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 * i, duration: 0.5 }}
						>
							<h3 className='text-sm font-medium'>
								{group.title}
							</h3>
							<ul className='space-y-2'>
								{group.links.map((link, j) => (
									<li key={j}>
										<Link
											href={link.href}
											className='text-sm text-muted-foreground hover:text-foreground hover:underline'
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>
					))}
				</div>

				<Separator className='my-8' />

				<div className='flex flex-col sm:flex-row justify-between items-center'>
					<p className='text-xs text-muted-foreground'>
						&copy; {currentYear} SkoolTech. All rights reserved.
					</p>
					<p className='text-xs text-muted-foreground mt-2 sm:mt-0'>
						Designed and developed with ❤️ for educational
						institutions worldwide
					</p>
				</div>
			</div>
		</footer>
	);
}
