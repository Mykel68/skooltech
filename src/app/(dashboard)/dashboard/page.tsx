'use client';

import { useUserStore } from '@/stores/userStore';
import SessionSetupForm from './SessionSetupForm';
import AdminDashboardPage from './dashboard';
// import AdminWelcomeDashboard from "./AdminWelcomeDashboard";

const AdminDashboard = () => {
	const session_id = useUserStore((s) => s.session_id);
	const term_id = useUserStore((s) => s.term_id);

	const isSchoolSetupComplete = !!session_id && !!term_id;

	return isSchoolSetupComplete ? (
		<AdminDashboardPage />
	) : (
		<SessionSetupForm />
	);
};

export default AdminDashboard;
