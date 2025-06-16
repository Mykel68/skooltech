'use client';

import React, { useState } from 'react';
import {
	ChevronDown,
	Search,
	MessageCircle,
	Shield,
	Zap,
	Clock,
	Star,
	Smartphone,
	HelpCircle,
} from 'lucide-react';

export default function ModernFAQUI() {
	const [activeIndex, setActiveIndex] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const faqs = [
		{
			question:
				'What makes SkoolTech different from other school management systems?',
			answer: 'SkoolTech stands out with its focus on exam and result management, intuitive user interface, and comprehensive analytics. Our system is designed by educators for educators, ensuring it meets real classroom needs.',
			icon: Star,
			category: 'Features',
			color: 'from-purple-500 to-pink-500',
		},
		{
			question: 'How secure is student data on your platform?',
			answer: 'We take data security extremely seriously. SkoolTech employs enterprise-grade encryption, regular security audits, and strict access controls. We are compliant with major educational data privacy regulations and never share student data with third parties.',
			icon: Shield,
			category: 'Security',
			color: 'from-green-500 to-emerald-500',
		},
		{
			question:
				'Can SkoolTech integrate with our existing school systems?',
			answer: 'Yes! SkoolTech is designed with integration in mind. We offer APIs and connectors for popular school information systems, learning management systems, and financial software. Our team can help with custom integrations as needed.',
			icon: Zap,
			category: 'Integration',
			color: 'from-blue-500 to-cyan-500',
		},
		{
			question: 'How long does implementation typically take?',
			answer: 'Most schools are up and running with SkoolTech within 2-4 weeks. Our implementation team handles data migration, system configuration, and provides comprehensive training for staff. We work around your schedule to ensure minimal disruption.',
			icon: Clock,
			category: 'Implementation',
			color: 'from-orange-500 to-red-500',
		},
		{
			question: 'Do you offer support for custom grading systems?',
			answer: "Absolutely. SkoolTech supports a wide range of grading scales and assessment methods. Whether you use letter grades, percentages, GPA, or custom rubrics, our system can be configured to match your school's specific requirements.",
			icon: Star,
			category: 'Features',
			color: 'from-indigo-500 to-purple-500',
		},
		{
			question: 'Is there a mobile app for parents and students?',
			answer: 'Yes, we offer mobile apps for both iOS and Android devices. Parents and students can access grades, assignments, and school communications on the go. The app also supports push notifications for important updates.',
			icon: Smartphone,
			category: 'Mobile',
			color: 'from-pink-500 to-rose-500',
		},
	];

	const filteredFaqs = faqs.filter(
		(faq) =>
			faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
			faq.category.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const categories = [...new Set(faqs.map((faq) => faq.category))];

	const toggleAccordion = (index: any) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<div
			id='faq'
			className='min-h-screen md:px-6 lg:px-12 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden'
		>
			{/* Animated background elements */}
			<div className='absolute inset-0'>
				<div className='absolute top-32 left-16 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
				<div className='absolute top-60 right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
				<div className='absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000'></div>
			</div>

			{/* Floating question marks */}
			<div className='absolute inset-0 overflow-hidden'>
				{[...Array(15)].map((_, i) => (
					<div
						key={i}
						className='absolute text-white/10 text-2xl animate-float'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 3}s`,
							animationDuration: `${3 + Math.random() * 2}s`,
						}}
					>
						?
					</div>
				))}
			</div>

			<div className='relative z-10 px-6 py-20'>
				{/* Header */}
				<div className='text-center mb-16'>
					<div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6'>
						<HelpCircle className='w-4 h-4 text-blue-400' />
						<span className='text-sm font-medium text-white'>
							Frequently Asked Questions
						</span>
					</div>

					<h1 className='text-5xl md:text-7xl font-bold text-white mb-6'>
						<span className='bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent'>
							Got Questions?
						</span>
						<br />
						<span className='text-white'>We've Got Answers</span>
					</h1>

					<p className='text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8'>
						Find answers to common questions about SkoolTech and how
						it can benefit your institution
					</p>

					{/* Search bar */}
					<div className='max-w-md mx-auto relative'>
						<Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
						<input
							type='text'
							placeholder='Search FAQs...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300'
						/>
					</div>
				</div>

				{/* Category filters */}
				<div className='flex flex-wrap justify-center gap-3 mb-12'>
					{categories.map((category) => (
						<div
							key={category}
							className='px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-white hover:bg-white/10 transition-all duration-300 cursor-pointer'
						>
							{category}
						</div>
					))}
				</div>

				{/* FAQ List */}
				<div className='max-w-4xl mx-auto'>
					{filteredFaqs.length === 0 ? (
						<div className='text-center py-16'>
							<MessageCircle className='w-16 h-16 text-gray-400 mx-auto mb-4' />
							<p className='text-gray-400 text-lg'>
								No FAQs found matching your search.
							</p>
						</div>
					) : (
						<div className='space-y-4'>
							{filteredFaqs.map((faq, index) => {
								const Icon = faq.icon;
								const isActive = activeIndex === index;

								return (
									<div
										key={index}
										className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 cursor-pointer ${
											isActive
												? 'bg-white/10 border-white/30 shadow-xl'
												: 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
										}`}
										onClick={() => toggleAccordion(index)}
									>
										{/* Gradient overlay */}
										<div
											className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${faq.color}`}
										/>

										<div className='relative p-6 backdrop-blur-sm'>
											{/* Question */}
											<div className='flex items-center gap-4'>
												<div
													className={`w-12 h-12 rounded-xl bg-gradient-to-r ${faq.color} flex items-center justify-center shadow-lg`}
												>
													<Icon className='w-6 h-6 text-white' />
												</div>

												<div className='flex-1'>
													<div className='flex items-center justify-between'>
														<h3 className='text-lg font-semibold text-white pr-4'>
															{faq.question}
														</h3>
														<div
															className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 ${
																isActive
																	? 'rotate-180'
																	: ''
															}`}
														>
															<ChevronDown className='w-4 h-4 text-white' />
														</div>
													</div>

													<div className='flex items-center gap-2 mt-2'>
														<span
															className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${faq.color} text-white`}
														>
															{faq.category}
														</span>
													</div>
												</div>
											</div>

											{/* Answer */}
											<div
												className={`overflow-hidden transition-all duration-500 ${
													isActive
														? 'max-h-96 opacity-100 mt-6'
														: 'max-h-0 opacity-0'
												}`}
											>
												<div className='pl-16 pr-8'>
													<div className='w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4' />
													<p className='text-gray-300 leading-relaxed text-base'>
														{faq.answer}
													</p>
												</div>
											</div>
										</div>

										{/* Active indicator */}
										<div
											className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${
												faq.color
											} transition-all duration-500 ${
												isActive
													? 'opacity-100'
													: 'opacity-0'
											}`}
										/>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Contact section */}
				<div className='text-center mt-20'>
					<div className='max-w-md mx-auto p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10'>
						<MessageCircle className='w-12 h-12 text-blue-400 mx-auto mb-4' />
						<h3 className='text-xl font-semibold text-white mb-2'>
							Still have questions?
						</h3>
						<p className='text-gray-400 mb-6'>
							Our support team is here to help you succeed
						</p>
						<div className='inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer'>
							<span>Contact Support</span>
							<MessageCircle className='w-4 h-4' />
						</div>
					</div>
				</div>
			</div>

			<style jsx>{`
				@keyframes float {
					0%,
					100% {
						transform: translateY(0px);
					}
					50% {
						transform: translateY(-20px);
					}
				}
				.animate-float {
					animation: float 3s ease-in-out infinite;
				}
			`}</style>
		</div>
	);
}
