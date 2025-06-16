
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProgramForm from './components/ProgramForm';
import ScheduleDisplay from './components/ScheduleDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { RunningLevel, RaceDistance } from './types';
import { generateRunningProgram } from './services/geminiService';

const App = () => {
  const [trainingProgram, setTrainingProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = useCallback(async (level, distance, preferredTrainingDays) => {
    setIsLoading(true);
    setError(null);
    setTrainingProgram(null); 
    try {
      const program = await generateRunningProgram(level, distance, preferredTrainingDays);
      setTrainingProgram(program);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Een onbekende fout is opgetreden bij het genereren van het schema.");
      }
      console.error(err); // Log the full error for debugging
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProgramForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        {isLoading && <LoadingSpinner />}
        <ErrorMessage message={error || ''} />
        {!isLoading && !error && trainingProgram && <ScheduleDisplay program={trainingProgram} />}
        {!isLoading && !error && !trainingProgram && ( // Condition to show initial message
             <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-semibold text-slate-700 mb-2">Klaar om te starten?</h2>
                <p className="text-slate-600">
                  Selecteer je niveau, doelafstand en gewenste trainingsdagen hierboven om jouw persoonlijke hardloopschema te ontvangen.
                  Laat ons je helpen jouw hardloopdoelen te bereiken!
                </p>
             </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;