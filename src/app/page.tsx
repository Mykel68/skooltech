import About from './home/about';
import Cta from './home/cta';
import Faq from './home/faq';
import Features from './home/features';
import Footer from './home/footer';
import Hero from './home/hero';
import Navbar from './home/navbar';
import Services from './home/services';
import Testimonials from './home/testimonials';

export default function Home() {
	return (
		<div className='min-h-screen bg-background overflox-x-hidden'>
			<Navbar />
			<main className=' px-4 md:px-6 lg:px-12'>
				<Hero />
			</main>
			<About />
			<Features />
			{/* <Services /> */}
			<Testimonials />
			<Faq />
			<Cta />
			<Footer />
		</div>
	);
}
