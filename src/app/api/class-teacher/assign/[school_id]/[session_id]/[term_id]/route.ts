import { NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';
import { cookies } from 'next/headers';

const classSchemaa = z.object({
	class_id: z.string(),
	teacher_id: z.string(),
});

export async function POST(
	request: Request,
	// tell TS that params is a Promise
	{
		params,
	}: {
		params: Promise<{
			school_id: string;
			session_id: string;
			term_id: string;
		}>;
	}
) {
	try {
		// await params before destructuring
		const { school_id } = await params;
		const { session_id } = await params;
		const { term_id } = await params;

		const body = await request.json();
		// console.log("[POST] Body:", body);
		const validated = classSchemaa.parse(body);

		const backendUrl = process.env.MAIN_BACKEND_URL!;
		const token = (await cookies()).get('user_id')?.value;
		if (!token) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const resp = await axios.post(
			`${backendUrl}/api/class-teachers/${school_id}/assign/teacher?session_id=${session_id}&term_id=${term_id}`,
			validated,
			{ headers: { Authorization: `Bearer ${token}` } }
		);

		return NextResponse.json(resp.data, { status: 200 });
	} catch (err) {
		if (err instanceof z.ZodError) {
			return NextResponse.json({ errors: err.errors }, { status: 400 });
		}
		if (axios.isAxiosError(err)) {
			return NextResponse.json(
				{ error: err.response?.data?.message || 'Update failed' },
				{ status: err.response?.status || 500 }
			);
		}
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
