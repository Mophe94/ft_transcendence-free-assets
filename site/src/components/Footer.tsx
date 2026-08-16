import { Link } from 'react-router-dom';

export default function Footer() {
  return (
	<footer className="relative z-10 mt-auto w-full bg-[#ffffffa3]">
	  <div className="
		sm:space-y-4 
		sm:italic text-3xl font-semibold
		grid grid-cols-3 text-center
		sm:border-b-4 p-4"
	  >
	    <Link to="/cookies_policy" className="hover:underline text-black dark:text-[#e7e7e7]">
	      Cookies Policy
	    </Link>
	    <Link to="/private_policy" className="hover:underline text-black dark:text-[#e7e7e7]">
	      Privacy Polity
	    </Link>
	    <Link to="/terms_conditions" className="hover:underline text-black dark:text-[#e7e7e7]">
	      Terms & Conditions
	    </Link>
	  </div>
	</footer>
  );
}
