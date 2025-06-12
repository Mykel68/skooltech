'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';

type Subject = {
	name: string;
	total: number;
	grade: string;
};

type Student = {
	name: string;
	class: string;
	session: string;
	term: string;
	admissionNumber: string;
	average: number;
	subjects: Subject[];
};

type SchoolInfo = {
	name: string;
	address: string;
	phone_number: string;
	motto: string;
	school_image: string;
};

interface NigerianReportCardProps {
	student: Student;
	schoolInfo: SchoolInfo;
	onClose: () => void;
}

export default function NigerianReportCard({
	student,
	schoolInfo,
	onClose,
}: NigerianReportCardProps) {
	const reportRef = useRef<HTMLDivElement>(null);
	const userEmail = useUserStore((s) => s.email);

	const handlePrint = () => window.print();

	const getGradeColor = (g: string) =>
		g === 'A1'
			? 'text-green-700'
			: ['B2', 'B3'].includes(g)
			? 'text-blue-700'
			: ['C4', 'C5', 'C6'].includes(g)
			? 'text-yellow-700'
			: 'text-red-700';

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto'>
				{/* Modal Header */}
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
						<div className='flex items-center justify-center gap-4 mb-2 p-4'>
							<img
								src={schoolInfo.school_image}
								alt='Logo'
								className='w-20 h-20 rounded-full object-cover'
							/>
						</div>
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
						</div>
					</div>

					{/* Subjects Table */}
					<table className='w-full border-collapse border border-black text-sm mb-6'>
						<thead>
							<tr className='bg-gray-100'>
								{['SUBJECT', 'TOTAL (100)', 'GRADE'].map(
									(hdr) => (
										<th
											key={hdr}
											className='border border-black p-2 text-center font-medium'
										>
											{hdr}
										</th>
									)
								)}
							</tr>
						</thead>
						<tbody>
							{student.subjects.map((subj) => (
								<tr key={subj.name}>
									<td className='border border-black p-2'>
										{subj.name}
									</td>
									<td className='border border-black p-2 text-center'>
										{subj.total}
									</td>
									<td
										className={`border border-black p-2 text-center font-bold ${getGradeColor(
											subj.grade
										)}`}
									>
										{subj.grade}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
