'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import NigerianReportCard from './ReportCard';
import TabsSection from './TabsSection';
import { transformToStudents } from '@/utils/transform';

export type ComponentScore = {
	component_name: string;
	score: number;
};

export type APIStudent = {
	user_id: string;
	first_name: string;
	last_name: string;
	class_students: {
		Session: { name: string };
		Term: { name: string };
		Class: { name: string };
	}[];
	student_scores: {
		subject: { name: string };
		total_score: number;
		grade: string;
		remark: string;
		position: number;
		scores: ComponentScore[];
	}[];
};

export type Student = {
	id: string;
	name: string;
	class: string;
	session: string;
	term: string;
	admissionNumber: string;
	average: number;
	totalScore: number;
	position: number;
	subjects: {
		name: string;
		components: ComponentScore[];
		total: number;
		grade: string;
		remark: string;
		position: number;
	}[];
};

const ExamReportBuilder = () => {
	const [activeTab, setActiveTab] = useState('reports');
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(
		null
	);
	const [showReportCard, setShowReportCard] = useState(false);
	const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

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

	const { data: classes = [], isLoading: classesLoading } = useQuery({
		queryKey: ['classes', schoolId],
		queryFn: async () => {
			const res = await axios.get(
				`/api/class/get-all-classs/${schoolId}`
			);
			return res.data.data.classes;
		},
		enabled: !!schoolId,
	});

	const { data: students = [], isLoading: studentsLoading } = useQuery({
		queryKey: ['students', selectedClassId],
		queryFn: async () => {
			const res = await axios.get(
				`/api/result/${schoolId}/${sessionId}/${termId}/${selectedClassId}`
			);
			return transformToStudents(res.data.data.data);
		},
		enabled: !!schoolId && !!sessionId && !!termId && !!selectedClassId,
	});

	// Mutations
	const generateReportMutation = useMutation({
		mutationFn: api.generateReport,
		onSuccess: () => setShowReportCard(true),
	});

	const handleViewReport = (student: Student) => {
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
				email={email!} // <-- non-null assertion
				schoolId={schoolId!} // <-- non-null assertion
				handleViewReport={handleViewReport}
				generateReportPending={generateReportMutation.isPending}
				selectedClassId={selectedClassId}
				setSelectedClassId={setSelectedClassId}
				classes={classes}
				classesLoading={classesLoading}
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
