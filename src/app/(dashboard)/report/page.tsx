'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import NigerianReportCard from './ReportCard';
import TabsSection from './TabsSection';

const ExamReportBuilder = () => {
	const [activeTab, setActiveTab] = useState('reports');
	const [selectedStudent, setSelectedStudent] = useState(null);
	const [showReportCard, setShowReportCard] = useState(false);

	const schoolId = useUserStore((s) => s.schoolId);
	const email = useUserStore((s) => s.email);
	const termId = useUserStore((s) => s.term_id);
	const sessionId = useUserStore((s) => s.session_id);

	// Queries
	const { data: schoolInfo = {}, isLoading: schoolLoading } = useQuery({
		queryKey: ['schoolInfo'],
		queryFn: async () => {
			const res = await axios.get(`/api/school/get-profile/${schoolId}`);
			return res.data.data;
		},
		enabled: !!schoolId,
	});

	const { data: students = [], isLoading: studentsLoading } = useQuery({
		queryKey: ['students'],
		queryFn: async () => {
			const res = await axios.get(
				`/api/result/${schoolId}/${sessionId}/${termId}`
			);
			return res.data.data;
		},
		enabled: !!schoolId,
	});

	// Mutations
	const generateReportMutation = useMutation({
		mutationFn: api.generateReport,
		onSuccess: () => setShowReportCard(true),
	});

	const handleViewReport = (student) => {
		setSelectedStudent(student);
		generateReportMutation.mutate(student.id);
	};

	return (
		<div className='p-6 max-w-7xl mx-auto'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold text-gray-900'>
					Report System
				</h1>
				<p className='text-gray-600 mt-2'>Generate report cards</p>
			</div>

			<TabsSection
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				students={students}
				studentsLoading={studentsLoading}
				schoolInfo={schoolInfo}
				schoolLoading={schoolLoading}
				email={email}
				schoolId={schoolId}
				handleViewReport={handleViewReport}
				generateReportPending={generateReportMutation.isPending}
			/>

			{showReportCard && selectedStudent && (
				<NigerianReportCard
					student={selectedStudent}
					schoolInfo={schoolInfo}
					onClose={() => {
						setShowReportCard(false);
						setSelectedStudent(null);
					}}
				/>
			)}
		</div>
	);
};

export default ExamReportBuilder;
