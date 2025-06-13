import Hero from './home/hero';
import Navbar from './home/navbar';

export default function Home() {
	return (
		<div className='min-h-screen bg-background overflox-x-hidden'>
			<Navbar />
			<main className=' px-4 md:px-6 lg:px-12'>
				<Hero />
			</main>
		</div>
	);
}
