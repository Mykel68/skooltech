'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ItemDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	onSubmit: (formData: {
		name: string;
		start_date: string;
		end_date: string;
	}) => void;
	initialData?: {
		name: string;
		start_date: string;
		end_date: string;
	} | null;
	title: string;
	submitLabel: string;
	nameLabel: string;
}

const CreateItemDialog: React.FC<ItemDialogProps> = ({
	open,
	setOpen,
	onSubmit,
	initialData,
	title,
	submitLabel,
	nameLabel,
}) => {
	const [formData, setFormData] = useState({
		name: '',
		start_date: '',
		end_date: '',
	});

	useEffect(() => {
		if (initialData) {
			setFormData({
				name: initialData.name,
				start_date: initialData.start_date.slice(0, 10),
				end_date: initialData.end_date.slice(0, 10),
			});
		} else {
			setFormData({ name: '', start_date: '', end_date: '' });
		}
	}, [initialData, open]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
		setFormData({ name: '', start_date: '', end_date: '' });
	};

	if (!open) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			<div
				className='absolute inset-0 bg-black/20 backdrop-blur-sm'
				onClick={() => setOpen(false)}
			/>

			<div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden'>
				<div className='bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
								<Sparkles className='w-5 h-5' />
							</div>
							<h2 className='text-xl font-bold'>{title}</h2>
						</div>
						<button
							onClick={() => setOpen(false)}
							className='p-2 hover:bg-white/20 rounded-full transition-colors'
						>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className='p-6 space-y-6'
				>
					<div>
						<label className='block text-sm font-semibold text-slate-700 mb-2'>
							{nameLabel}
						</label>
						<input
							type='text'
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
							placeholder={`e.g., 1st Term`}
							required
						/>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-semibold text-slate-700 mb-2'>
								Start Date
							</label>
							<input
								type='date'
								value={formData.start_date}
								onChange={(e) =>
									setFormData({
										...formData,
										start_date: e.target.value,
									})
								}
								className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
								required
							/>
						</div>

						<div>
							<label className='block text-sm font-semibold text-slate-700 mb-2'>
								End Date
							</label>
							<input
								type='date'
								value={formData.end_date}
								onChange={(e) =>
									setFormData({
										...formData,
										end_date: e.target.value,
									})
								}
								className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all'
								required
							/>
						</div>
					</div>

					<div className='flex items-center gap-3 pt-4'>
						<button
							type='button'
							onClick={() => setOpen(false)}
							className='flex-1 px-4 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors'
						>
							Cancel
						</button>
						<button
							type='submit'
							className='flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-200'
						>
							{submitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateItemDialog;
