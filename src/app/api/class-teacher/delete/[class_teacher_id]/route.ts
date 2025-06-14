import { NextResponse } from 'next/server';
import { z } from 'zod';
import axios from 'axios';
import { cookies } from 'next/headers';
import { backendClient } from '@/lib/backendClient';

export async function DELETE(
	request: Request,
	// tell TS that params is a Promise
	{
		params,
	}: {
		params: Promise<{
			class_teacher_id: string;
		}>;
	}
) {
	try {
		// await params before destructuring
		const { class_teacher_id } = await params;
		const backendUrl = process.env.MAIN_BACKEND_URL!;
		const token = (await cookies()).get('user_id')?.value;
		if (!token) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const resp = await backendClient.delete(
			`${backendUrl}/api/class-teachers/remove/${class_teacher_id}`,
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
