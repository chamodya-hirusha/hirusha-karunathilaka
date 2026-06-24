import { Heart } from "lucide-react";
import { FaCode } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative py-8 border-t border-border/50">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            © {new Date().getFullYear()}Chamody Hirusha. Built with
            <FaCode className="h-4 w-4 text-primary animate-glow-pulse" />
            using React & next.js
          </p>
          
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#home" className="hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-primary transition-colors">
              About
            </a>
            <a href="#projects" className="hover:text-primary transition-colors">
              Projects
            </a>
            <a href="#contact" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
