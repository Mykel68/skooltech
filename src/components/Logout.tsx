// In a logout component or hook
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogout() {
	const clearUser = useUserStore((state) => state.clearUser);
	const router = useRouter();

	const logout = async () => {
		try {
			await fetch('/api/logout', { method: 'POST' }); // Clears cookie
			clearUser();
			router.push('/login');
		} catch (error) {
			toast.error('Logout failed. Please try again.');
		}
	};

	return logout;
}
