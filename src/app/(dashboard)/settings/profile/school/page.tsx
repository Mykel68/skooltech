'use client';

import { SchoolProfileForm } from '@/components/forms/SchoolProfileForm';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { UserProfileForm } from '@/components/forms/UserProfileForm';

export default function ProfileSettingsPage() {
	return (
		<div className='max-w-6xl mx-auto py-4'>
			<h1 className='text-3xl font-bold mb-6'>Profile Settings</h1>
			<div className='space-y-6'>
				<Card>
					<CardHeader>
						<CardTitle>School Profile</CardTitle>
						<CardDescription>
							Update your school's details here.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<SchoolProfileForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
