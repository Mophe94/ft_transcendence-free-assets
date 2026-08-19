import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { theme } = useTheme();

  return (
	<footer
	  className="z-10 mt-auto w-full bg-[#ffffffa3]"
	>
	  <div className="
		w-9/10
		text-sm sm:text-2xl md:text-3xl
		italic font-semibold
		grid grid-cols-3 text-center items-center
		p-4"
	  >
	    <Link
		  to="/cookies_policy"
		  className={`hover:underline ${theme.fontColor}`}
		>
	      Cookies Policy
	    </Link>
	    <Link
		  to="/private_policy"
		  className={`hover:underline ${theme.fontColor}`}
		>
	      Privacy Policy
	    </Link>
		<Link
		  to="/terms_conditions"
		  className={`hover:underline ${theme.fontColor}`}
		>
	      Terms & Conditions
	    </Link>
	  </div>
	</footer>
  );
}
