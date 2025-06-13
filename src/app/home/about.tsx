'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
	const stats = [
		{ value: '500+', label: 'Schools' },
		{ value: '250K+', label: 'Students' },
		{ value: '30K+', label: 'Teachers' },
		{ value: '99.9%', label: 'Uptime' },
	];

	const fadeInUpVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.1 * i,
				duration: 0.5,
			},
		}),
	};

	return (
		<section
			id='about'
			className='py-20 bg-muted/50'
		>
			<div className='container px-4 md:px-6'>
				<div className='flex flex-col items-center justify-center space-y-4 text-center'>
					<motion.div
						className='space-y-2'
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
							About SkoolTech
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Transforming Education Management
						</h2>
						<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							SkoolTech is a comprehensive school management
							system designed to streamline administrative tasks
							and enhance educational outcomes.
						</p>
					</motion.div>

					<div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12'>
						<motion.div
							className='space-y-4'
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<h3 className='text-xl font-bold'>Our Mission</h3>
							<p className='text-muted-foreground'>
								To empower educational institutions with
								innovative technology solutions that simplify
								administration, enhance teaching, and improve
								learning outcomes.
							</p>
							<ul className='space-y-2'>
								{[
									'Simplify school administration',
									'Enhance teaching efficiency',
									'Improve student performance tracking',
									'Streamline communication',
								].map((item, i) => (
									<motion.li
										key={i}
										className='flex items-center gap-2'
										custom={i}
										initial='hidden'
										whileInView='visible'
										viewport={{ once: true }}
										variants={fadeInUpVariants}
									>
										<CheckCircle className='h-5 w-5 text-primary' />
										<span>{item}</span>
									</motion.li>
								))}
							</ul>
						</motion.div>
						<motion.div
							className='space-y-4'
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<h3 className='text-xl font-bold'>Our Vision</h3>
							<p className='text-muted-foreground'>
								To be the leading provider of educational
								technology solutions, creating a future where
								every school has access to powerful,
								user-friendly tools that transform education
								management.
							</p>
							<ul className='space-y-2'>
								{[
									'Global accessibility',
									'Continuous innovation',
									'Data-driven insights',
									'Seamless integration',
								].map((item, i) => (
									<motion.li
										key={i}
										className='flex items-center gap-2'
										custom={i}
										initial='hidden'
										whileInView='visible'
										viewport={{ once: true }}
										variants={fadeInUpVariants}
									>
										<CheckCircle className='h-5 w-5 text-primary' />
										<span>{item}</span>
									</motion.li>
								))}
							</ul>
						</motion.div>
					</div>

					<div className='grid grid-cols-2 gap-4 sm:grid-cols-4 mt-12'>
						{stats.map((stat, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1, duration: 0.4 }}
							>
								<Card>
									<CardContent className='flex flex-col items-center justify-center p-6'>
										<div className='text-3xl font-bold'>
											{stat.value}
										</div>
										<div className='text-sm text-muted-foreground'>
											{stat.label}
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
