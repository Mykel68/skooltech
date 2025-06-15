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
					className='p-10'
				>
					{/* School Header */}
					<div className='text-center border-b border-black pb-2 mb-2'>
						<img
							src={schoolInfo.school_image}
							alt='Logo'
							className='mx-auto w-16 h-16 object-cover '
						/>
						<p className='font-bold text-xl uppercase'>
							{schoolInfo.name}
						</p>
						<p>{schoolInfo.address}</p>
						<p>
							Tel: {schoolInfo.phone_number} | Email: {userEmail}
						</p>
						<p className='italic'>"{schoolInfo.motto}"</p>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						{/* Student Personal data */}
						<div className='space-y-1'>
							<div className='font-bold p-1 text-center border border'>
								STUDENT'S PERSONAL DATA
							</div>
							<table className='w-full border border-black mb-4'>
								<tbody>
									<tr>
										<td className='border p-1'>
											<strong>NAME</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong className='uppercase'>
												{student.name}
											</strong>
										</td>
									</tr>
									<tr>
										<td className='border p-1'>
											<strong>ADM NO:</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong>
												{student.admissionNumber}
											</strong>{' '}
										</td>
									</tr>
									<tr>
										<td className='border p-1'>
											<strong>CLASS:</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong>{student.class}</strong>{' '}
										</td>
									</tr>
									<tr>
										<td className='border p-1'>
											<strong>SEX:</strong>{' '}
										</td>
										<td className='border p-1'>
											<strong>
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
								<div className='font-bold p-1 text-center border border'>
									ATTENDANCE
								</div>
								<table className='w-full border border-black mb-4'>
									<tbody>
										<tr>
											<td className='border p-1 text-center'>
												<strong>
													Times Sch. Opened
												</strong>{' '}
											</td>
											<td className='border p-1 text-center'>
												<strong className=''>
													Times Present
												</strong>
											</td>
											<td className='border p-1 text-center'>
												<strong className=''>
													Times Absent
												</strong>
											</td>
										</tr>
										<tr>
											<td className='border p-1 text-center'>
												85
											</td>
											<td className='border p-1 text-center'>
												N/A
											</td>
											<td className='border p-1 text-center'>
												N/A
											</td>
										</tr>
									</tbody>
								</table>
							</div>

							{/* Term */}
							<div className='space-y-1'>
								<div className='font-bold p-1 text-center border border'>
									TERMINAL DURATION WEEKS
								</div>
								<table className='w-full border border-black mb-4'>
									<tbody>
										<tr>
											<td className='border p-1 text-center'>
												<strong>Term Begins</strong>{' '}
											</td>
											<td className='border p-1 text-center'>
												<strong className=''>
													Term Ends
												</strong>
											</td>
											<td className='border p-1 text-center'>
												<strong className=''>
													Next Term Begins
												</strong>
											</td>
										</tr>
										<tr>
											<td className='border p-1 text-center'>
												85
											</td>
											<td className='border p-1 text-center'>
												N/A
											</td>
											<td className='border p-1 text-center'>
												N/A
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
									<td className='border p-1'>{subj.name}</td>
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
					<table className='w-full border border-black mb-4'>
						<tbody>
							<tr>
								<td className='border p-1'>
									<strong>ATTENDANCE:</strong> Present: ___ /
									___
								</td>
								<td className='border p-1'>
									<strong>POSITION IN CLASS:</strong>{' '}
									{student.position}
									{suffix(student.position)}
								</td>
							</tr>
							<tr>
								<td className='border p-1'>
									<strong>TOTAL SCORE:</strong>{' '}
									{student.totalScore}
								</td>
								<td className='border p-1'>
									<strong>AVERAGE:</strong>{' '}
									{student.average.toFixed(1)}%
								</td>
							</tr>
						</tbody>
					</table>

					{/* Comments */}
					<div className='mb-2'>
						<p>
							<strong>TEACHER'S REMARK:</strong>{' '}
							__________________________________________
						</p>
						<p>
							<strong>PRINCIPAL'S COMMENT:</strong>{' '}
							_______________________________________
						</p>
					</div>

					<div className='flex justify-between pt-4'>
						<p className='text-sm'>Signature & Date:</p>
						<p className='text-sm'>Next Term Begins: ___________</p>
					</div>
				</div>
			</div>
		</div>
	);
}
