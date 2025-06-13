'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { ModeToggle } from './mode-toggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
	return (
		<motion.header
			className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md'
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='container flex h-20 items-center justify-between'>
				<Link
					href='/'
					className='flex items-center space-x-2'
				>
					<motion.div
						className='bg-primary rounded-md p-1'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
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
					</motion.div>
					<span className='font-bold text-2xl'>SkoolTech</span>
				</Link>

				{/* Desktop Navigation */}
				<div className='hidden md:flex md:items-center md:space-x-32'>
					<NavigationMenu>
						<NavigationMenuList>
							<NavigationMenuItem>
								<Link
									href='#about'
									legacyBehavior
									passHref
								>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										About
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger>
									Services
								</NavigationMenuTrigger>
								<NavigationMenuContent>
									<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]'>
										<ListItem
											href='#services'
											title='Exam Management'
										>
											Comprehensive exam creation,
											scheduling, and grading system
										</ListItem>
										<ListItem
											href='#services'
											title='Result Processing'
										>
											Automated result calculation and
											report card generation
										</ListItem>
										<ListItem
											href='#services'
											title='Fee Management'
										>
											Streamlined school fee payment and
											tracking
										</ListItem>
										<ListItem
											href='#services'
											title='Student Portal'
										>
											Personalized access for students to
											view results and resources
										</ListItem>
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link
									href='#features'
									legacyBehavior
									passHref
								>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										Features
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<Link
									href='#faq'
									legacyBehavior
									passHref
								>
									<NavigationMenuLink
										className={navigationMenuTriggerStyle()}
									>
										FAQ
									</NavigationMenuLink>
								</Link>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
					<div className='flex items-center space-x-2'>
						<ModeToggle />
						<button className='shadow-[inset_0_0_0_2px_#1ED760] text-black px-8 py-3 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#1ED760] hover:text-white dark:text-neutral-200 transition duration-200'>
							Get Started
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				<div className='flex items-center md:hidden space-x-2'>
					<ModeToggle />
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
							>
								<Menu className='h-6 w-6' />
							</Button>
						</SheetTrigger>
						<SheetContent
							side='right'
							className='p-6'
						>
							<nav className='flex flex-col space-y-4 mt-10'>
								<Link
									href='#about'
									className='text-lg font-medium hover:text-primary'
								>
									About
								</Link>
								<Link
									href='#services'
									className='text-lg font-medium hover:text-primary'
								>
									Services
								</Link>
								<Link
									href='#features'
									className='text-lg font-medium hover:text-primary'
								>
									Features
								</Link>
								<Link
									href='#faq'
									className='text-lg font-medium hover:text-primary'
								>
									FAQ
								</Link>
								<Button
									className='mt-4'
									asChild
								>
									<Link href='#contact'>Get Started</Link>
								</Button>
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</motion.header>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<'a'>,
	React.ComponentPropsWithoutRef<'a'> & { title: string }
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
						className
					)}
					{...props}
				>
					<div className='text-sm font-medium leading-none'>
						{title}
					</div>
					<p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = 'ListItem';
