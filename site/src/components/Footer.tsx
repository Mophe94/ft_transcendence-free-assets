import { Link } from 'react-router-dom';

export default function Footer() {
	return (
		<footer className="	
							relative z-10
							mt-auto w-full
							bg-[#ffffffa3]
							text-[#000] dark:text-[#e7e7e7]"
		>
			<div className="
							sm:space-y-4 
							sm:italic text-3xl font-semibold
							grid grid-cols-3 text-center
							sm:border-b-4 p-4"
			>
				<Link to="/cookies_policy" className="hover:underline">
				Cookies Policy
				</Link>
				<Link to="/private_policy" className="hover:underline">
	    		Privacy Polity
				</Link>
				<Link to="/terms_conditions" className="hover:underline">
	    		Terms & Conditions
				</Link>
			</div>
		</footer>
	);
}