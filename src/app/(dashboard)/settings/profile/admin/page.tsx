import { UserProfileForm } from '@/components/forms/UserProfileForm';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import React from 'react';

export default function page() {
	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>User Profile</CardTitle>
					<CardDescription>
						Update your personal details here.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UserProfileForm />
				</CardContent>
			</Card>
		</div>
	);
}
