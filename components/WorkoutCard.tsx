
import React from 'react';
import { Workout } from '../types';

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const getIcon = (workoutType: string) => {
    if (workoutType.toLowerCase().includes('rust')) return '😴'; // Sleepy face for Rest
    if (workoutType.toLowerCase().includes('duurloop') || workoutType.toLowerCase().includes('easy run')) return '🏃‍♂️'; // Person running
    if (workoutType.toLowerCase().includes('interval')) return '⏱️'; // Stopwatch for Interval
    if (workoutType.toLowerCase().includes('tempo')) return '💨'; // Wind for Tempo
    if (workoutType.toLowerCase().includes('kracht') || workoutType.toLowerCase().includes('strength')) return '💪'; // Flexed biceps for Strength
    if (workoutType.toLowerCase().includes('cross')) return '🚲'; // Bicycle for Cross-training (example)
    return '⚡'; // Generic lightning for other activities
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out h-full flex flex-col">
      <div className="flex items-center mb-2">
        <span className="text-3xl mr-3">{getIcon(workout.workoutType)}</span>
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase">{workout.day}</h4>
          <h3 className="text-lg font-bold text-blue-700">{workout.workoutType}</h3>
        </div>
      </div>
      
      {workout.workoutType.toLowerCase() !== 'rust' && workout.workoutType.toLowerCase() !== 'rest' && (
        <div className="space-y-1 text-sm text-slate-600 mb-3">
          {workout.duration && <p><span className="font-semibold">Duur:</span> {workout.duration}</p>}
          {workout.distance && <p><span className="font-semibold">Afstand:</span> {workout.distance}</p>}
          {workout.intensity && <p><span className="font-semibold">Intensiteit:</span> {workout.intensity}</p>}
        </div>
      )}
      <p className="text-sm text-slate-700 mt-auto flex-grow">{workout.description}</p>
    </div>
  );
};

export default WorkoutCard;
    