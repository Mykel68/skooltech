'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Hero() {
	return (
		<section className='relative overflow-hidden py-20 md:py-32'>
			{/* Background decoration */}
			<div className='absolute inset-0 -z-10 overflow-hidden'>
				<div className='absolute -top-[40%] right-[20%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]' />
				<div className='absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-secondary/20 blur-[100px]' />
			</div>

			<div className='container px-4 md:px-6'>
				<div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
					<motion.div
						className='flex flex-col justify-center space-y-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className='space-y-4'>
							<motion.h1
								className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.5 }}
							>
								Revolutionizing School Management with
								Technology
							</motion.h1>
							<motion.p
								className='max-w-[600px] text-muted-foreground md:text-xl '
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.4, duration: 0.5 }}
							>
								Streamline exam management, result processing,
								and fee payments with our comprehensive school
								management system.
							</motion.p>
						</div>
						<motion.div
							className='flex flex-col gap-2 min-[400px]:flex-row'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.5 }}
						>
							<Button
								size='lg'
								asChild
							>
								<Link href='#contact'>Get Started</Link>
							</Button>
							<Button
								size='lg'
								variant='outline'
								asChild
							>
								<Link href='#demo'>Request Demo</Link>
							</Button>
						</motion.div>
						<motion.div
							className='flex items-center space-x-4 text-sm'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8, duration: 0.5 }}
						>
							<div className='flex -space-x-2'>
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className='inline-block h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden'
									>
										<Image
											src={`/placeholder.svg?height=32&width=32&text=${i}`}
											alt={`User ${i}`}
											width={32}
											height={32}
										/>
									</div>
								))}
							</div>
							<div className='text-muted-foreground'>
								Trusted by{' '}
								<span className='font-medium text-foreground'>
									500+
								</span>{' '}
								schools
							</div>
						</motion.div>
					</motion.div>
					<motion.div
						className='mx-auto aspect-video overflow-hidden rounded-xl border bg-card p-2 shadow-xl lg:order-last'
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className='relative h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20'>
							<Image
								src='/images/file.svg'
								alt='SkoolTech Dashboard'
								className='object-cover'
								fill
							/>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
