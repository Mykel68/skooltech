'use client';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/userStore';
import { Printer } from 'lucide-react';
import React, { useRef } from 'react';

type Subject = {
	name: string;
	ca1: number;
	ca2: number;
	exam: number;
	total: number;
	grade: string;
	remark: string;
	position: number;
};

type Student = {
	name: string;
	class: string;
	term: string;
	session: string;
	age: number;
	admissionNumber: string;
	sex: 'Male' | 'Female' | string;
	height: string;
	weight: string;
	dateOfBirth: string;
	subjects: Subject[];
	totalScore: number;
	average: number;
};

type SchoolInfo = {
	name: string;
	address: string;
	phone_number: string;
	email: string;
	motto: string;
	school_image: string;
};

type NigerianReportCardProps = {
	student: Student;
	schoolInfo: SchoolInfo;
	onClose: () => void;
};

export default function NigerianReportCard({
	student,
	schoolInfo,
	onClose,
}: NigerianReportCardProps) {
	const reportRef = useRef<HTMLDivElement>(null);
	const email = useUserStore((s) => s.email);

	const handlePrint = () => {
		window.print();
	};

	const getGradeColor = (grade: string) => {
		if (grade === 'A1') return 'text-green-700';
		if (grade === 'B2' || grade === 'B3') return 'text-blue-700';
		if (['C4', 'C5', 'C6'].includes(grade)) return 'text-yellow-700';
		return 'text-red-700';
	};

	const getPositionSuffix = (position: number) => {
		if (position === 1) return 'st';
		if (position === 2) return 'nd';
		if (position === 3) return 'rd';
		return 'th';
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
			<div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto'>
				<div className='p-4 border-b flex justify-between items-center print:hidden'>
					<h3 className='text-lg font-semibold'>
						Student Report Card
					</h3>
					<div className='flex gap-2'>
						<Button
							onClick={handlePrint}
							size='sm'
						>
							<Printer className='w-4 h-4 mr-2' />
							Print
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

				<div
					ref={reportRef}
					className='p-8 bg-white print:p-4'
				>
					{/* School Header */}
					<div className='text-center border-b-2 border-black pb-4 mb-6'>
						<div className='flex items-center justify-center gap-4 mb-2'>
							{/* <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
								<span className='text-xs'>LOGO</span>
							</div> */}
							<img
								src={schoolInfo.school_image}
								className='w-16 aspect-square rounded-full'
							/>
							<div>
								<p className='text-sm'>{schoolInfo.address}</p>
								<p className='text-sm'>
									Tel: {schoolInfo.phone_number} | Email:{' '}
									{email}
								</p>
								<p className='text-sm italic'>
									" {schoolInfo.motto} "
								</p>
							</div>
							<div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center'>
								<span className='text-xs'>COAT OF ARMS</span>
							</div>
						</div>
						<h2 className='text-xl font-bold mt-2'>
							STUDENT'S REPORT CARD
						</h2>
					</div>

					{/* Student Info */}
					<div className='grid grid-cols-2 gap-8 mb-6'>
						<div className='space-y-2'>
							{[
								['NAME:', student.name],
								['CLASS:', student.class],
								['TERM:', student.term],
								['SESSION:', student.session],
								['AGE:', `${student.age} years`],
							].map(([label, value]) => (
								<div
									className='flex'
									key={label}
								>
									<span className='font-semibold w-32'>
										{label}
									</span>
									<span className='border-b border-black flex-1 px-2'>
										{value}
									</span>
								</div>
							))}
						</div>
						<div className='space-y-2'>
							{[
								['ADM. NO:', student.admissionNumber],
								['SEX:', student.sex],
								['HEIGHT:', student.height],
								['WEIGHT:', student.weight],
								['D.O.B:', student.dateOfBirth],
							].map(([label, value]) => (
								<div
									className='flex'
									key={label}
								>
									<span className='font-semibold w-32'>
										{label}
									</span>
									<span className='border-b border-black flex-1 px-2'>
										{value}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Table */}
					<div className='mb-6'>
						<table className='w-full border-2 border-black text-sm'>
							<thead>
								<tr className='bg-gray-100'>
									{[
										'SUBJECTS',
										'1ST C.A (20)',
										'2ND C.A (20)',
										'EXAM (60)',
										'TOTAL (100)',
										'GRADE',
										'REMARK',
										'POSITION',
									].map((header) => (
										<th
											key={header}
											className='border border-black p-2 text-left text-center first:text-left'
										>
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{student.subjects.map((subject, index) => (
									<tr key={index}>
										<td className='border border-black p-2 font-medium'>
											{subject.name}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.ca1}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.ca2}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.exam}
										</td>
										<td className='border border-black p-2 text-center font-bold'>
											{subject.total}
										</td>
										<td
											className={`border border-black p-2 text-center font-bold ${getGradeColor(
												subject.grade
											)}`}
										>
											{subject.grade}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.remark}
										</td>
										<td className='border border-black p-2 text-center'>
											{subject.position}
											{getPositionSuffix(
												subject.position
											)}
										</td>
									</tr>
								))}
								<tr className='bg-gray-100 font-bold'>
									<td className='border border-black p-2'>
										TOTAL
									</td>
									<td
										colSpan={3}
										className='border border-black p-2 text-center'
									></td>
									<td className='border border-black p-2 text-center'>
										{student.totalScore}
									</td>
									<td
										colSpan={3}
										className='border border-black p-2 text-center'
									>
										AVERAGE: {student.average.toFixed(2)}%
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					{/* More sections like grading system, comments, etc. can go here */}
				</div>
			</div>
		</div>
	);
}
