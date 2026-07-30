import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-3 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} Durgesh Katyayan. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition">
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition">
            <FaLinkedin size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition">
            <FaTwitter size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}