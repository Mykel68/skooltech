import { APIStudent, Student } from "@/app/(dashboard)/report/page";

function getGradeFromScore(score: number): string {
  if (score >= 75) return "A1";
  if (score >= 70) return "B2";
  if (score >= 65) return "B3";
  if (score >= 60) return "C4";
  if (score >= 55) return "C5";
  if (score >= 50) return "C6";
  if (score >= 45) return "D7";
  if (score >= 40) return "E8";
  return "F9";
}

export function transformToStudents(apiData: any): Student[] {
  const rawData = apiData;

  if (!rawData || !Array.isArray(rawData.students)) return [];

  const totalSchoolDays = rawData.total_school_days ?? 0;
  const nextTermStarts = rawData.next_term_starts_on ?? "";

  return rawData.students.map((stu: any) => {
    const firstName = `${stu.first_name}`;
    const lastName = `${stu.last_name}`;

    const fullName = `${stu.first_name} ${stu.last_name}`;
    const cs = stu.class_students?.[0];

    const termStarts = cs?.Term?.start_date ?? "";
    const termEnds = cs?.Term?.end_date ?? "";

    const subjectEntries = (stu.student_scores ?? []).map((s: any) => ({
      name: s.subject.name,
      components: s.scores,
      total: s.total_score,
      grade: s.grade ?? getGradeFromScore(s.total_score),
      remark: s.remark ?? "",
      position: s.position ?? 1,
    }));

    const totalScore = subjectEntries.reduce(
      (acc: number, s: any) => acc + s.total,
      0
    );
    const average = subjectEntries.length
      ? totalScore / subjectEntries.length
      : 0;

    const daysPresent = stu.attendances?.[0]?.days_present ?? 0;

    return {
      id: stu.user_id,
      name: fullName,
      firstName: firstName,
      lastName: lastName,
      class: cs?.Class?.name ?? "",
      grade_level: cs?.Class?.grade_level ?? "",
      session: cs?.Session?.name ?? "",
      gender: stu.gender ?? "",
      term: cs?.Term?.name ?? "",
      admissionNumber: stu.admission_number ?? "",
      average,
      totalScore,
      subjects: subjectEntries,
      position: 1, // or replace with actual rank logic
      termStarts,
      termEnds,
      nextTermBegins: nextTermStarts,
      attendance: {
        timesPresent: daysPresent,
        timesAbsent: totalSchoolDays - daysPresent,
        totalDays: totalSchoolDays,
      },
    };
  });
}
