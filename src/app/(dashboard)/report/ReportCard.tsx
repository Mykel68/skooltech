// NigerianReportCard.tsx
'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { Student } from './page';

interface Props {
	student: Student;
	schoolInfo: {
		name: string;
		address: string;
		phone_number: string;
		email: string;
		motto: string;
		school_image: string;
	};
	onClose: () => void;
}

export default function NigerianReportCard({
	student,
	schoolInfo,
	onClose,
}: Props) {
	const reportRef = useRef<HTMLDivElement>(null);
	const userEmail = useUserStore((s) => s.email);

	// get all unique component names from first subject
	const componentNames =
		student.subjects[0]?.components.map((c) => c.component_name) || [];

	const handlePrint = () => window.print();
	const getGradeColor = (g: string) =>
		g === 'A1'
			? 'text-green-700'
			: ['B2', 'B3'].includes(g)
			? 'text-blue-700'
			: ['C4', 'C5', 'C6'].includes(g)
			? 'text-yellow-700'
			: 'text-red-700';

	const suffix = (p: number) =>
		p === 1 ? 'st' : p === 2 ? 'nd' : p === 3 ? 'rd' : 'th';

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto'>
				{/* Header */}
				<div className='p-4 border-b flex justify-between items-center print:hidden'>
					<h3 className='text-lg font-semibold'>
						Student Report Card
					</h3>
					<div className='flex gap-2'>
						<Button
							onClick={handlePrint}
							size='sm'
						>
							<Printer className='w-4 h-4 mr-2' /> Print
						</Button>
						<Button
							onClick={onClose}
							variant='outline'
							size='sm'
						>
							Close
						</Button>
					</div>
				</div>

				{/* Content */}
				<div
					ref={reportRef}
					className='p-8 print:p-4'
				>
					{/* School Header */}
					<div className='text-center border-b-2 border-black pb-4 mb-6'>
						<img
							src={schoolInfo.school_image}
							alt='Logo'
							className='mx-auto w-20 h-20 rounded-full object-cover mb-2'
						/>
						<p className='text-3xl font-bold uppercase'>
							{schoolInfo.name}
						</p>
						<p className='text-sm'>{schoolInfo.address}</p>
						<p className='text-sm'>
							Tel: {schoolInfo.phone_number} | Email: {userEmail}
						</p>
						<p className='text-sm italic mt-1'>
							"{schoolInfo.motto}"
						</p>
					</div>

					{/* Student Info */}
					<div className='grid grid-cols-2 gap-6 mb-6 text-sm'>
						<div className='space-y-1'>
							<div>
								<strong>NAME:</strong> {student.name}
							</div>
							<div>
								<strong>CLASS:</strong> {student.class}
							</div>
							<div>
								<strong>SESSION:</strong> {student.session}
							</div>
							<div>
								<strong>TERM:</strong> {student.term}
							</div>
						</div>
						<div className='space-y-1'>
							<div>
								<strong>ADM. NO:</strong>{' '}
								{student.admissionNumber}
							</div>
							<div>
								<strong>AVERAGE:</strong>{' '}
								{student.average.toFixed(1)}%
							</div>
							<div>
								<strong>TOTAL:</strong> {student.totalScore}
							</div>
						</div>
					</div>

					{/* Scores Table */}
					<div className='overflow-x-auto'>
						<table className='w-full border-collapse border border-black text-sm'>
							<thead>
								<tr className='bg-gray-100'>
									{[
										'SUBJECT',
										...componentNames.map((n) =>
											n.toUpperCase()
										),
										'TOTAL (100)',
										'GRADE',
										'REMARK',
										'POSITION',
									].map((hdr) => (
										<th
											key={hdr}
											className='border border-black p-2 text-center font-medium'
										>
											{hdr}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{student.subjects.map((subj) => (
									<tr key={subj.name}>
										<td className='border border-black p-2'>
											{subj.name}
										</td>
										{componentNames.map((cn) => {
											const comp = subj.components.find(
												(c) => c.component_name === cn
											);
											return (
												<td
													key={cn}
													className='border border-black p-2 text-center'
												>
													{comp?.score ?? '—'}
												</td>
											);
										})}
										<td className='border border-black p-2 text-center font-bold'>
											{subj.total}
										</td>
										<td
											className={`border border-black p-2 text-center font-bold ${getGradeColor(
												subj.grade
											)}`}
										>
											{subj.grade}
										</td>
										<td className='border border-black p-2 text-center'>
											{subj.remark}
										</td>
										<td className='border border-black p-2 text-center'>
											{subj.position}
											{suffix(subj.position)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
