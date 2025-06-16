
import React, { useState } from 'react';
import { RunningLevel, RaceDistance } from '../types';
import { StravaIcon } from '../constants.tsx'; // Corrected import path

interface ProgramFormProps {
  onSubmit: (level: RunningLevel, distance: RaceDistance, preferredTrainingDays: number) => void;
  isLoading: boolean;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ onSubmit, isLoading }) => {
  const [level, setLevel] = useState<RunningLevel>(RunningLevel.BEGINNER);
  const [distance, setDistance] = useState<RaceDistance>(RaceDistance.FIVE_K);
  const [preferredTrainingDays, setPreferredTrainingDays] = useState<number>(4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(level, distance, preferredTrainingDays);
  };

  const handleStravaClick = () => {
    alert("Strava-integratie is gepland voor een toekomstige update. Deze knop is momenteel een demo en koppelt nog niet daadwerkelijk met Strava.");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl space-y-8 max-w-2xl mx-auto my-8 border border-slate-200" id="program-form-container">
      <div>
        <h2 className="text-2xl font-semibold text-slate-700 mb-6 text-center">Stel jouw hardloopschema samen</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-1">
            Jouw huidige hardloopniveau:
          </label>
          <select
            id="level"
            name="level"
            value={level}
            onChange={(e) => setLevel(e.target.value as RunningLevel)}
            className="mt-1 block w-full py-3 px-4 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            aria-describedby="level-description"
          >
            {Object.values(RunningLevel).map((lvl) => (
              <option key={lvl} value={lvl} className="capitalize">
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </option>
            ))}
          </select>
          {/* Example of aria-describedby if there was a visible description element */}
          {/* <p id="level-description" className="text-xs text-slate-500 mt-1">Kies het niveau dat het beste bij je past.</p> */}
        </div>

        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-slate-700 mb-1">
            Jouw doelafstand:
          </label>
          <select
            id="distance"
            name="distance"
            value={distance}
            onChange={(e) => setDistance(e.target.value as RaceDistance)}
            className="mt-1 block w-full py-3 px-4 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          >
            {Object.values(RaceDistance).map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="trainingDays" className="block text-sm font-medium text-slate-700 mb-1">
            Gewenst aantal trainingsdagen per week:
          </label>
          <select
            id="trainingDays"
            name="trainingDays"
            value={preferredTrainingDays}
            onChange={(e) => setPreferredTrainingDays(parseInt(e.target.value, 10))}
            className="mt-1 block w-full py-3 px-4 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          >
            {[3, 4, 5, 6].map((days) => (
              <option key={days} value={days}>
                {days} dagen
              </option>
            ))}
          </select>
           <p className="text-xs text-slate-500 mt-1">Het schema probeert dit aantal aan te houden, maar kan afwijken op basis van je niveau en doel.</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-lg font-medium text-slate-700 mb-2">Niveau inschatting (optioneel)</h3>
        <button
          type="button"
          onClick={handleStravaClick}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
          aria-describedby="strava-description"
        >
          <StravaIcon />
          <span className="ml-2">Koppel je Strava (Demo)</span>
        </button>
        <p id="strava-description" className="text-xs text-slate-500 mt-2 text-center">Een toekomstige update zal echte Strava-integratie mogelijk maken voor een nog accurater schema.</p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 transition-colors"
        >
          {isLoading ? 'Bezig met genereren...' : 'Genereer mijn schema'}
        </button>
      </div>
    </form>
  );
};

export default ProgramForm;
