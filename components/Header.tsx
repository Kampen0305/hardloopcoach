
import React from 'react';
import { APP_TITLE } from '../constants.tsx';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 shadow-lg">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 16.5M12.75 3.031L8.25 6.495M16.5 9.75L12.75 12M12.75 3.031L6.75 9.75M16.5 9.75L21 13.218M16.5 9.75L12.75 3.031m4.362 6.427L12.75 6.495m2.098 5.428L12.75 12m2.098-2.098L17.25 7.5M12.75 12l-3.75 3.75" />
        </svg>
        <h1 className="text-3xl font-bold tracking-tight">{APP_TITLE}</h1>
      </div>
    </header>
  );
};

export default Header;