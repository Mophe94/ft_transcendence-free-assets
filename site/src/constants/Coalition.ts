import trojanLogo from '../assets/coalitions/trojan_logo.png';
import spartanLogo from '../assets/coalitions/spartan_logo.png';
import athenianLogo from '../assets/coalitions/athenian_logo.png';

export const Coalitions = {
  52: {
    name: 'The Spartans',
    coalLogo: spartanLogo,
    colorkey: 'spartan',
    textColor: 'text-[rgb(141,4,2)]',
    },
  53: {
    name: 'The Athenians',
    coalLogo: athenianLogo,
    colorkey: 'athenian',
    textColor: 'text-[rgb(26,98,0)]',
    },
  54: {
    name: 'The Trojans',
    coalLogo: trojanLogo,
    colorkey: 'trojan',
    textColor: 'text-[rgb(53,92,157)]',
    },
  'default': {
    name: 'No Coalition',
    coalLogo: null,
    colorkey: '',
    textColor: '',
  }
}