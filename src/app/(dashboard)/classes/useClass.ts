import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export type Class = {
	class_id: string;
	name: string;
	short: string;
	grade_level: string;
	teacher: 'Unknown';
	student_count: number;
	subjects: [];
	created_at: string;
	status: string;
};

const defaultClasses = [
	{ name: 'Junior Secondary School 1', short: 'JSS1', grade_level: 'JSS1' },
	{ name: 'Junior Secondary School 2', short: 'JSS2', grade_level: 'JSS2' },
	{ name: 'Junior Secondary School 3', short: 'JSS3', grade_level: 'JSS3' },
	{ name: 'Senior Secondary School 1', short: 'SS1', grade_level: 'SS1' },
	{ name: 'Senior Secondary School 2', short: 'SS2', grade_level: 'SS2' },
	{ name: 'Senior Secondary School 3', short: 'SS3', grade_level: 'SS3' },
];

export const useClasses = (
	schoolId: string,
	sessionId: string,
	termId: string
) => {
	return useQuery<Class[]>({
		queryKey: ['classes', schoolId, sessionId, termId],
		queryFn: async () => {
			const { data } = await axios.get(
				`/api/class/get-all-classs/${schoolId}/${sessionId}/${termId}`
			);
			// return data.data.classes;
			return (data.data.classes as any[]).map(
				(cls): Class => ({
					class_id: cls.class_id ?? '',
					name: cls.name ?? '',
					short: cls.short ?? '',
					grade_level: cls.grade_level ?? '',
					teacher: cls.teacher ?? 'Unknown',
					student_count: cls.student_count ?? 0,
					subjects: cls.subjects ?? [],
					created_at: cls.created_at ?? '',
					status: cls.status ?? 'active',
				})
			);
		},
		enabled: !!schoolId && !!sessionId && !!termId,
	});
};

export const useCreateClass = (schoolId: string, onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: any) => {
			await axios.post(`/api/class/create-new/${schoolId}`, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['classes', schoolId] });
			onSuccess?.();
		},
	});
};

export const getDefaultClasses = () => defaultClasses;
