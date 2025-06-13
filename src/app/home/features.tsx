'use client';

import { motion } from 'framer-motion';
import {
	BarChart3,
	Calendar,
	FileText,
	GraduationCap,
	LineChart,
	MessageSquare,
	ShieldCheck,
	Smartphone,
} from 'lucide-react';

export default function Features() {
	const features = [
		{
			icon: FileText,
			title: 'Automated Report Cards',
			description:
				'Generate professional report cards with just a few clicks, saving hours of manual work.',
		},
		{
			icon: BarChart3,
			title: 'Performance Analytics',
			description:
				'Gain insights into student performance with comprehensive analytics and visualizations.',
		},
		{
			icon: Calendar,
			title: 'Exam Scheduling',
			description:
				'Create and manage exam timetables with conflict detection and automated notifications.',
		},
		{
			icon: ShieldCheck,
			title: 'Secure Data Storage',
			description:
				'Keep all your academic records secure with enterprise-grade encryption and backups.',
		},
		{
			icon: Smartphone,
			title: 'Mobile Access',
			description:
				'Access the system from anywhere using our responsive web interface and mobile app.',
		},
		{
			icon: MessageSquare,
			title: 'Parent Communication',
			description:
				'Keep parents informed with automated notifications about results and school events.',
		},
		{
			icon: LineChart,
			title: 'Progress Tracking',
			description:
				'Track student progress over time with detailed historical performance data.',
		},
		{
			icon: GraduationCap,
			title: 'Custom Grading Systems',
			description:
				"Configure custom grading scales and assessment criteria to match your school's needs.",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<section
			id='features'
			className='py-20 px-4 md:px-6 lg:px-12'
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
							Features
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Powerful Tools for Modern Schools
						</h2>
						<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Our comprehensive suite of features is designed to
							streamline school operations and enhance educational
							outcomes.
						</p>
					</div>
				</motion.div>

				<motion.div
					className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12'
					variants={containerVariants}
					initial='hidden'
					whileInView='visible'
					viewport={{ once: true }}
				>
					{features.map((feature, i) => (
						<motion.div
							key={i}
							className='group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all duration-300'
							variants={itemVariants}
						>
							<div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4'>
								<feature.icon className='h-6 w-6' />
							</div>
							<h3 className='text-lg font-bold'>
								{feature.title}
							</h3>
							<p className='text-sm text-muted-foreground mt-2'>
								{feature.description}
							</p>
							<div className='absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full'></div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
