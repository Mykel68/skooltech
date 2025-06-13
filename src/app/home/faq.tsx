'use client';

import { motion } from 'framer-motion';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

export default function Faq() {
	const faqs = [
		{
			question:
				'What makes SkoolTech different from other school management systems?',
			answer: 'SkoolTech stands out with its focus on exam and result management, intuitive user interface, and comprehensive analytics. Our system is designed by educators for educators, ensuring it meets real classroom needs.',
		},
		{
			question: 'How secure is student data on your platform?',
			answer: 'We take data security extremely seriously. SkoolTech employs enterprise-grade encryption, regular security audits, and strict access controls. We are compliant with major educational data privacy regulations and never share student data with third parties.',
		},
		{
			question:
				'Can SkoolTech integrate with our existing school systems?',
			answer: 'Yes! SkoolTech is designed with integration in mind. We offer APIs and connectors for popular school information systems, learning management systems, and financial software. Our team can help with custom integrations as needed.',
		},
		{
			question: 'How long does implementation typically take?',
			answer: 'Most schools are up and running with SkoolTech within 2-4 weeks. Our implementation team handles data migration, system configuration, and provides comprehensive training for staff. We work around your schedule to ensure minimal disruption.',
		},
		{
			question: 'Do you offer support for custom grading systems?',
			answer: "Absolutely. SkoolTech supports a wide range of grading scales and assessment methods. Whether you use letter grades, percentages, GPA, or custom rubrics, our system can be configured to match your school's specific requirements.",
		},
		{
			question: 'Is there a mobile app for parents and students?',
			answer: 'Yes, we offer mobile apps for both iOS and Android devices. Parents and students can access grades, assignments, and school communications on the go. The app also supports push notifications for important updates.',
		},
	];

	return (
		<section
			id='faq'
			className='py-20 bg-muted/50 px-4 md:px-6 lg:px-12'
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
							FAQ
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Frequently Asked Questions
						</h2>
						<p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
							Find answers to common questions about SkoolTech and
							how it can benefit your institution.
						</p>
					</div>
				</motion.div>

				<motion.div
					className='mx-auto max-w-3xl mt-12'
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<Accordion
						type='single'
						collapsible
						className='w-full'
					>
						{faqs.map((faq, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: i * 0.1, duration: 0.3 }}
							>
								<AccordionItem value={`item-${i}`}>
									<AccordionTrigger className='text-left'>
										{faq.question}
									</AccordionTrigger>
									<AccordionContent>
										{faq.answer}
									</AccordionContent>
								</AccordionItem>
							</motion.div>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	);
}
