import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white text-center py-6 mt-10">
      <p>&copy; {new Date().getFullYear()} CodeShare. All rights reserved.</p>
      <div className="flex justify-center gap-6 mt-2">
        <a href="#about" className="hover:text-blue-400">About</a>
        <a href="#github" className="hover:text-blue-400">GitHub</a>
        <a href="#docs" className="hover:text-blue-400">Docs</a>
        <a href="#contact" className="hover:text-blue-400">Contact</a>
      </div>
      <p className="mt-4 text-gray-400">Built with 💛 by Shivshankar Ghyar</p>
    </footer>
  );
};

export default Footer;