'use client';

import { motion } from 'framer-motion';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Services() {
	const services = [
		{
			title: 'Exam Management',
			description:
				'Our flagship service for creating, scheduling, and grading exams with ease.',
			features: [
				'Question bank management',
				'Automated exam generation',
				'Online examination portal',
				'Secure assessment environment',
				'Instant grading and feedback',
			],
			image: '/placeholder.svg?height=200&width=300&text=Exam+Management',
			popular: true,
		},
		{
			title: 'Result Processing',
			description:
				'Comprehensive result calculation and report card generation system.',
			features: [
				'Custom grading scales',
				'Automated calculations',
				'Performance analytics',
				'Digital report cards',
				'Historical data tracking',
			],
			image: '/placeholder.svg?height=200&width=300&text=Result+Processing',
			popular: false,
		},
		{
			title: 'Fee Management',
			description:
				'Streamlined payment processing and financial tracking for schools.',
			features: [
				'Online payment gateway',
				'Fee structure management',
				'Payment reminders',
				'Financial reporting',
				'Receipt generation',
			],
			image: '/placeholder.svg?height=200&width=300&text=Fee+Management',
			popular: false,
		},
	];

	return (
		<section
			id='services'
			className='py-20 bg-muted/50'
		>
			<div className='container px-4 md:px-6'>
				<motion.div
					className='flex flex-col items-center justify-center space-y-4 text-center'
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<div className='space-y-2'>
						<div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
							Our Services
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Comprehensive School Management Solutions
						</h2>
						<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Choose the services that best fit your institution's
							needs and scale as you grow.
						</p>
					</div>
				</motion.div>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-3 mt-12'>
					{services.map((service, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.5 }}
						>
							<Card
								className={`h-full flex flex-col overflow-hidden ${
									service.popular
										? 'border-primary shadow-lg'
										: ''
								}`}
							>
								{service.popular && (
									<div className='bg-primary text-primary-foreground text-center py-1 text-sm font-medium'>
										Most Popular
									</div>
								)}
								<div className='relative h-48 w-full'>
									<Image
										src={
											service.image || '/placeholder.svg'
										}
										alt={service.title}
										fill
										className='object-cover'
									/>
								</div>
								<CardHeader>
									<CardTitle>{service.title}</CardTitle>
									<CardDescription>
										{service.description}
									</CardDescription>
								</CardHeader>
								<CardContent className='flex-grow'>
									<ul className='space-y-2'>
										{service.features.map((feature, j) => (
											<motion.li
												key={j}
												className='flex items-start gap-2'
												initial={{ opacity: 0, x: -10 }}
												whileInView={{
													opacity: 1,
													x: 0,
												}}
												viewport={{ once: true }}
												transition={{
													delay: 0.1 * j,
													duration: 0.3,
												}}
											>
												<CheckCircle className='h-5 w-5 text-primary shrink-0 mt-0.5' />
												<span className='text-sm'>
													{feature}
												</span>
											</motion.li>
										))}
									</ul>
								</CardContent>
								<CardFooter>
									<Button
										className='w-full group'
										asChild
									>
										<Link href='#contact'>
											Learn More
											<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
										</Link>
									</Button>
								</CardFooter>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
