'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

export default function Testimonials() {
	const testimonials = [
		{
			quote: 'SkoolTech has completely transformed how we manage exams and process results. What used to take weeks now takes hours.',
			author: 'Sarah Johnson',
			role: 'Principal, Greenfield Academy',
			avatar: 'SJ',
		},
		{
			quote: 'The analytics provided by SkoolTech have given us valuable insights into student performance trends that we never had before.',
			author: 'Michael Chen',
			role: 'Academic Director, Westlake High School',
			avatar: 'MC',
		},
		{
			quote: "Parents love the transparency and immediate access to their children's academic progress. Communication has never been better.",
			author: 'Priya Patel',
			role: 'Vice Principal, Sunshine Elementary',
			avatar: 'PP',
		},
		{
			quote: "The customer support team is exceptional. They're always available to help and have made our transition to digital seamless.",
			author: 'David Okonkwo',
			role: 'IT Administrator, Heritage College',
			avatar: 'DO',
		},
	];

	return (
		<section className='py-20'>
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
							Testimonials
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Trusted by Educators Worldwide
						</h2>
						<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Hear what school administrators and teachers have to
							say about their experience with SkoolTech.
						</p>
					</div>
				</motion.div>

				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-12'>
					{testimonials.map((testimonial, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.5 }}
						>
							<Card className='h-full'>
								<CardContent className='p-6 flex flex-col h-full'>
									<Quote className='h-8 w-8 text-primary/40 mb-4' />
									<p className='flex-grow text-sm italic mb-4'>
										"{testimonial.quote}"
									</p>
									<div className='flex items-center gap-4'>
										<Avatar>
											<AvatarFallback>
												{testimonial.avatar}
											</AvatarFallback>
										</Avatar>
										<div>
											<p className='text-sm font-medium'>
												{testimonial.author}
											</p>
											<p className='text-xs text-muted-foreground'>
												{testimonial.role}
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
