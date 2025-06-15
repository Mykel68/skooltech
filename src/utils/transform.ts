import { APIStudent, Student } from '@/app/(dashboard)/report/page';

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
		const average = subjectEntries.length
			? totalScore / subjectEntries.length
			: 0;

		return {
			id: stu.user_id,
			name: fullName,
			class: cs.Class.name,
			grade_level: cs.Class.grade_level,
			session: cs.Session.name,
			term: cs.Term.name,
			admissionNumber: stu.user_id.slice(0, 6),
			average,
			totalScore,
			subjects: subjectEntries,
			position: 1, // placeholder or use actual if available
		};
	});
}
