'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import NigerianReportCard from './ReportCard';
import TabsSection from './TabsSection';

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
	subjects: {
		name: string;
		components: ComponentScore[];
		total: number;
		grade: string;
		remark: string;
		position: number;
	}[];
};

function getGradeFromScore(score: number): string {
	if (score >= 75) return 'A1';
	if (score >= 70) return 'B2';
	if (score >= 65) return 'B3';
	if (score >= 60) return 'C4';
	if (score >= 55) return 'C5';
	if (score >= 50) return 'C6';
	if (score >= 45) return 'D7';
	if (score >= 40) return 'E8';
	return 'F9';
}

export function transformToStudents(apiData: APIStudent[]): Student[] {
	return apiData.map((stu) => {
		const fullName = `${stu.first_name} ${stu.last_name}`;
		const cs = stu.class_students[0];
		const subjectEntries = stu.student_scores.map((s) => ({
			name: s.subject.name,
			components: s.scores,
			total: s.total_score,
			grade: s.grade ?? getGradeFromScore(s.total_score),
			remark: s.remark,
			position: s.position || 1,
		}));
		const totalScore = subjectEntries.reduce((acc, s) => acc + s.total, 0);
		const average = totalScore / subjectEntries.length;

		return {
			id: stu.user_id,
			name: fullName,
			class: cs.Class.name,
			session: cs.Session.name,
			term: cs.Term.name,
			admissionNumber: stu.user_id.slice(0, 6),
			average,
			totalScore,
			subjects: subjectEntries,
		};
	});
}

const ExamReportBuilder = () => {
	const [activeTab, setActiveTab] = useState('reports');
	const [selectedStudent, setSelectedStudent] = useState(null);
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
