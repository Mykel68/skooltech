import About from './about';
import Cta from './cta';
import Faq from './faq';
import Features from './features';
import Footer from './footer';
import Hero from './hero';
import Navbar from './navbar';
import Services from './services';
import Testimonials from './testimonials';

export default function Home() {
	return (
		<div className='min-h-screen bg-background overflox-x-hidden'>
			<Navbar />
			<main>
				<Hero />
				<About />
				<Features />
				<Services />
				<Testimonials />
				<Faq />
				<Cta />
			</main>
			<Footer />
		</div>
	);
}
