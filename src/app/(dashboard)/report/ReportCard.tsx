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

	const componentNames =
		student.subjects[0]?.components.map((c) => c.component_name) || [];

	const handlePrint = () => window.print();

	const suffix = (p: number) =>
		p === 1 ? 'st' : p === 2 ? 'nd' : p === 3 ? 'rd' : 'th';

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg w-full max-w-5xl max-h-[95vh] overflow-auto text-xs print:text-[10px]'>
				{/* Toolbar */}
				<div className='p-2 border-b flex justify-between items-center print:hidden'>
					<h3 className='text-sm font-semibold'>
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

				{/* Report Content */}
				<div
					ref={reportRef}
					className='p-12 print-area'
				>
					{/* School Header */}
					<div className='flex items-center justify-between border-b border-gray-300 pb-4 mb-6'>
						{/* School Logo - Far Left */}
						<div className='flex-shrink-0 w-24'>
							<img
								src={schoolInfo.school_image}
								alt='School Logo'
								className='w-24 aspect-square object-cover rounded'
							/>
						</div>

						{/* School Info - Centered */}
						<div className='flex-1 px-4 text-center max-w-2xl'>
							<p className='font-bold text-3xl mb-2 text-balance uppercase'>
								{schoolInfo.name}
							</p>
							<p className='text-sm text-balance'>
								{schoolInfo.address}
							</p>
							<p className='text-sm'>
								Tel: {schoolInfo.phone_number} | Email:{' '}
								{userEmail}
							</p>
							<p className='italic text-sm mt-1'>
								"{schoolInfo.motto}"
							</p>
							<i className='text-lg font-semibold mt-2'>
								Continuous Assessment Report - {student.session}
							</i>
						</div>

						{/* Grade Info - Far Right */}
						<div className='flex-shrink-0 pl-4 ml-4'>
							<div className='w-24 aspect-square bg-primary text-white rounded flex flex-col items-center justify-center text-center'>
								<div className='p-1 font-bold text-lg border-b-4 border-black-100 w-full text-center'>
									{student.grade_level}
								</div>
								<div className='p-1 font-semibold text-sm'>
									{student.term}
								</div>
							</div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						{/* Student Personal data */}
						<div className='space-y-3'>
							<div className='font-bold p-1 text-sm text-center border border'>
								STUDENT'S PERSONAL DATA
							</div>
							<table className='w-full border border-black mb-4'>
								<tbody>
									<tr>
										<td className='border p-1'>
											<strong className='text-sm'>
												FULL NAME
											</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong className='uppercase text-sm'>
												{student.name}
											</strong>
										</td>
									</tr>
									<tr>
										<td className='border p-1'>
											<strong className='text-sm'>
												LAST NAME:
											</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong className='text-sm'>
												{student.lastName}
											</strong>{' '}
										</td>
									</tr>

									<tr>
										<td className='border p-1'>
											<strong className='text-sm'>
												ADM NO:
											</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong className='text-sm'>
												{student.admissionNumber}
											</strong>{' '}
										</td>
									</tr>
									<tr>
										<td className='border p-1'>
											<strong className='text-sm'>
												CLASS:
											</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong className='text-sm'>
												{student.class}
											</strong>{' '}
										</td>
									</tr>
									<tr>
										<td className='border p-1'>
											<strong className='text-sm'>
												SEX:
											</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong className='text-sm'>
												{student.admissionNumber}
											</strong>{' '}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div className='space-y-1'>
							{/* Attendance */}
							<div className='space-y-1'>
								<div className='font-bold p-1 text-sm text-center border border'>
									ATTENDANCE
								</div>
								<table className='w-full border border-black mb-4'>
									<tbody>
										<tr>
											<td className='border p-1 text-sm text-center'>
												<strong>
													Times Sch. Opened
												</strong>{' '}
											</td>
											<td className='border p-1 text-sm text-center'>
												<strong className=''>
													Times Present
												</strong>
											</td>
											<td className='border p-1 text-sm text-center'>
												<strong className=''>
													Times Absent
												</strong>
											</td>
										</tr>
										<tr>
											<td className='border p-1 text-center'>
												{student.attendance
													?.totalDays ?? 'N/A'}
											</td>
											<td className='border p-1 text-center'>
												{student.attendance
													?.timesPresent ?? 'N/A'}
											</td>
											<td className='border p-1 text-center'>
												{student.attendance
													?.timesAbsent ?? 'N/A'}
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* Term */}
							<div className='space-y-1'>
								<div className='font-bold p-1 text-center text-sm border border'>
									TERMINAL DURATION WEEKS
								</div>
								<table className='w-full border border-black mb-4'>
									<tbody>
										<tr>
											<td className='border p-1 text-center text-sm'>
												<strong>Term Begins</strong>{' '}
											</td>
											<td className='border p-1 text-center text-sm'>
												<strong className=''>
													Term Ends
												</strong>
											</td>
											<td className='border p-1 text-center text-sm'>
												<strong className=''>
													Next Term Begins
												</strong>
											</td>
										</tr>
										<tr>
											<td className='border p-1 text-center'>
												{formatDate(
													student.termStarts
												) ?? 'N/A'}
											</td>
											<td className='border p-1 text-center'>
												{formatDate(student.termEnds) ??
													'N/A'}
											</td>
											<td className='border p-1 text-center'>
												{formatDate(
													student.nextTermBegins
												) ?? 'N/A'}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* Grade */}
					<div className='space-y-1'>
						<div className='font-bold p-1 text-center border border'>
							GRADES
						</div>
						<table className='w-full border border-black mb-4 text-center'>
							<thead className='bg-gray-100'>
								<tr>
									<th className='border p-1'>A1</th>
									<th className='border p-1'>B2</th>
									<th className='border p-1'>B3</th>
									<th className='border p-1'>C4</th>
									<th className='border p-1'>C5</th>
									<th className='border p-1'>C6</th>
									<th className='border p-1'>D7</th>
									<th className='border p-1'>E8</th>
									<th className='border p-1'>F9</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td className='border p-1'>75 - 100</td>
									<td className='border p-1'>70 - 74</td>
									<td className='border p-1'>65 - 69</td>
									<td className='border p-1'>60 - 64</td>
									<td className='border p-1'>55 - 59</td>
									<td className='border p-1'>50 - 54</td>
									<td className='border p-1'>45 - 49</td>
									<td className='border p-1'>40 - 44</td>
									<td className='border p-1'>0 - 39</td>
								</tr>
								<tr>
									<td className='border p-1'>Excellent</td>
									<td className='border p-1'>Very Good</td>
									<td className='border p-1'>Good</td>
									<td className='border p-1'>Credit</td>
									<td className='border p-1'>Credit</td>
									<td className='border p-1'>Credit</td>
									<td className='border p-1'>Pass</td>
									<td className='border p-1'>Pass</td>
									<td className='border p-1'>Fail</td>
								</tr>
							</tbody>
						</table>
					</div>

					{/* Academic Performance */}
					<table className='w-full border border-black mb-4'>
						<thead className='bg-gray-100'>
							<tr>
								<th className='border p-1 text-sm'>SUBJECT</th>
								{componentNames.map((n) => (
									<th
										key={n}
										className='border p-1 text-sm'
									>
										{n}
									</th>
								))}
								<th className='border p-1 text-sm'>TOTAL</th>
								<th className='border p-1 text-sm'>GRADE</th>
								<th className='border p-1 text-sm'>REMARK</th>
								<th className='border p-1 text-sm'>POSITION</th>
							</tr>
						</thead>
						<tbody>
							{student.subjects.map((subj) => (
								<tr key={subj.name}>
									<td className='border p-1 text-sm'>
										{subj.name}
									</td>
									{componentNames.map((cn) => {
										const comp = subj.components.find(
											(c) => c.component_name === cn
										);
										return (
											<td
												key={cn}
												className='border p-1 text-center'
											>
												{comp?.score ?? '-'}
											</td>
										);
									})}
									<td className='border p-1 text-center font-bold'>
										{subj.total}
									</td>
									<td className='border p-1 text-center'>
										{subj.grade}
									</td>
									<td className='border p-1'>
										{subj.remark}
									</td>
									<td className='border p-1 text-center'>
										{subj.position}
										{suffix(subj.position)}
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{/* Attendance & Remarks */}
					<table className='w-full border border-black mb-4 text-sm'>
						<tbody>
							<tr>
								<td className='border p-2'>
									<strong>ATTENDANCE:</strong> Present:{' '}
									{student.attendance?.timesPresent ?? '___'}{' '}
									/ {student.attendance?.totalDays ?? '___'}
								</td>
								<td className='border p-2'>
									<strong>POSITION IN CLASS:</strong>{' '}
									{student.position}
									{suffix(student.position)}
								</td>
							</tr>
							<tr>
								<td className='border p-2'>
									<strong>TOTAL SCORE:</strong>{' '}
									{student.totalScore}
								</td>
								<td className='border p-2'>
									<strong>AVERAGE:</strong>{' '}
									{student.average.toFixed(1)}%
								</td>
							</tr>
						</tbody>
					</table>

					{/* Comments */}
					<div className='space-y-2'>
						{' '}
						<div className='font-bold p-1 text-sm text-center border border'>
							REMARKS AND CONCLUSION
						</div>
						<div className='mb-6 p-4 rounded-md border border-gray-300 bg-white shadow-sm space-y-4'>
							<div className='flex flex-col'>
								<label className='font-semibold text-sm text-gray-700 mb-1'>
									TEACHER'S REMARK
								</label>
								<div className='border-b border-dashed border-gray-400 h-6' />
							</div>

							<div className='flex flex-col'>
								<label className='font-semibold text-sm text-gray-700 mb-1'>
									PRINCIPAL'S COMMENT
								</label>
								<div className='border-b border-dashed border-gray-400 h-6' />
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className='pt-4 text-xs text-gray-500 border-t border-gray-200 mt-20'>
						This report was electronically generated and does not
						require a signature.
						<br />
						Printed on: {new Date().toLocaleString()}
					</div>
				</div>
			</div>
		</div>
	);
}
