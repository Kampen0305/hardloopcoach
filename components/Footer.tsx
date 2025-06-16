
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 p-6 mt-12 text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} Hardloopschema Generator. Alle rechten voorbehouden.</p>
        <p className="text-sm mt-1">Gemaakt met React, Tailwind CSS & Gemini API.</p>
      </div>
    </footer>
  );
};

export default Footer;
    