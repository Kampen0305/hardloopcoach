import React, { useState } from 'react';
import WorkoutCard from './WorkoutCard.js';

const AccordionIcon = ({ isOpen }) => (
  <svg
    className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
  </svg>
);

const WeekItem = ({ weekData, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  return (
    <div className="mb-6 bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out print-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white hover:from-sky-600 hover:to-indigo-600 transition-colors no-print"
        aria-expanded={isOpen}
        aria-controls={`week-${weekData.week}-content`}
      >
        <div className="text-left">
          <h3 className="text-xl font-semibold">Week {weekData.week}</h3>
          {weekData.summary && <p className="text-sm opacity-90 mt-1">{weekData.summary}</p>}
        </div>
        <AccordionIcon isOpen={isOpen} />
      </button>
      <div id={`week-${weekData.week}-content`} className={`${isOpen ? 'block' : 'hidden'} p-5 border-t border-slate-200 print:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {weekData.days.map((workout, dayIndex) => (
            <WorkoutCard key={`${weekData.week}-${dayIndex}`} workout={workout} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ScheduleDisplay = ({ program }) => {
  if (!program) {
    return <p className="text-center text-slate-600 my-8">Vul het formulier in om een hardloopschema te genereren.</p>;
  }

  const handleSaveJson = () => {
    const jsonString = JSON.stringify(program, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${program.programTitle.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: program.programTitle,
      text: `Hier is mijn hardloopschema voor ${program.programTitle}, voor ${program.totalWeeks} weken. Samenvatting eerste week: ${program.weeklySchedule[0]?.summary || ''}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        alert('Delen wordt niet ondersteund door je browser. Probeer het schema te kopiëren of op te slaan.');
      }
    } catch (error) {
      console.error('Fout bij delen:', error);
      alert('Er ging iets mis bij het delen.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="mt-10" id="schedule-display-section" aria-label="Generated Schedule">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-700">{program.programTitle}</h2>
      <p className="text-center text-slate-600 mb-8">Totaal {program.totalWeeks} weken trainingsplan.</p>

      <div className="space-y-6">
        {program.weeklySchedule.map((weekData, index) => (
          <WeekItem key={weekData.week} weekData={weekData} initialOpen={index < 2} />
        ))}
      </div>

      <div id="action-buttons-container" className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 no-print">
        <button onClick={handleSaveJson} className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">Schema Opslaan (JSON)</button>
        <button onClick={handleShare} className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">Schema Delen</button>
        <button onClick={handlePrint} className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-slate-700 bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors">Print Schema</button>
      </div>
    </section>
  );
};

export default ScheduleDisplay;
