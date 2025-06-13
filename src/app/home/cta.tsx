'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Mail, MessageSquare, Phone } from 'lucide-react';

export default function Cta() {
	return (
		<section
			id='contact'
			className='py-20'
		>
			<div className='container px-4 md:px-6'>
				<div className='grid gap-6 lg:grid-cols-2 lg:gap-12'>
					<motion.div
						className='flex flex-col justify-center space-y-4'
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<div className='space-y-2'>
							<div className='inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground'>
								Contact Us
							</div>
							<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
								Ready to Transform Your School?
							</h2>
							<p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed'>
								Get in touch with our team to schedule a demo or
								learn more about how SkoolTech can benefit your
								institution.
							</p>
						</div>

						<div className='space-y-4 mt-6'>
							<Card>
								<CardContent className='p-4 flex items-center gap-4'>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
										<Mail className='h-5 w-5' />
									</div>
									<div>
										<h3 className='font-medium'>
											Email Us
										</h3>
										<p className='text-sm text-muted-foreground'>
											info@skooltech.com
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className='p-4 flex items-center gap-4'>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
										<Phone className='h-5 w-5' />
									</div>
									<div>
										<h3 className='font-medium'>Call Us</h3>
										<p className='text-sm text-muted-foreground'>
											+1 (555) 123-4567
										</p>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardContent className='p-4 flex items-center gap-4'>
									<div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
										<MessageSquare className='h-5 w-5' />
									</div>
									<div>
										<h3 className='font-medium'>
											Live Chat
										</h3>
										<p className='text-sm text-muted-foreground'>
											Available Monday-Friday, 9am-5pm
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</motion.div>

					<motion.div
						className='rounded-lg border bg-card p-6 shadow-sm'
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<form className='space-y-4'>
							<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
								<div className='space-y-2'>
									<Label htmlFor='first-name'>
										First name
									</Label>
									<Input
										id='first-name'
										placeholder='John'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='last-name'>Last name</Label>
									<Input
										id='last-name'
										placeholder='Doe'
									/>
								</div>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									placeholder='john.doe@example.com'
									type='email'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='school'>
									School/Institution
								</Label>
								<Input
									id='school'
									placeholder='Greenfield Academy'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='message'>Message</Label>
								<Textarea
									id='message'
									placeholder='Tell us about your school and requirements...'
									className='min-h-[120px]'
								/>
							</div>
							<Button
								className='w-full group'
								type='submit'
							>
								Send Message
								<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
							</Button>
							<p className='text-xs text-muted-foreground text-center mt-2'>
								We'll get back to you within 24 hours.
							</p>
						</form>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
