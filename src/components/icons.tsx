// components/icons.tsx
import { 
  FaGoogle, 
  FaMicrosoft, 
  FaApple, 
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaBolt,
  FaPuzzlePiece,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaHeadset,
  FaSpinner
} from "react-icons/fa";
import { 
  FiPackage 
} from "react-icons/fi";

export const Icons = {
  // Authentication icons
  google: FaGoogle,
  microsoft: FaMicrosoft,
  apple: FaApple,
  github: FaGithub,
  spinner: FaSpinner,

  // Feature icons
  bolt: FaBolt,
  puzzle: FaPuzzlePiece,
  shield: FaShieldAlt,
  chart: FaChartLine,
  users: FaUsers,
  support: FaHeadset,

  // Social media icons
  twitter: FaTwitter,
  linkedin: FaLinkedin,
  discord: FaDiscord,

  // Brand/logo icon
  logo: FiPackage,
};