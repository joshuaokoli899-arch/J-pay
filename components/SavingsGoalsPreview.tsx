import React from 'react';
import { SavingsGoal } from '../types';

interface SavingsGoalsPreviewProps {
  goals: SavingsGoal[];
  onNavigate: () => void;
}

const SavingsGoalsPreview: React.FC<SavingsGoalsPreviewProps> = ({ goals, onNavigate }) => {
  const goal = goals[0]; // Preview the first goal

  return (
    <div className="bg-white dark:bg-green-900 rounded-2xl p-4 shadow-sm dark:shadow-none">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Savings Goals</h2>
        <button onClick={onNavigate} className="text-sm text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 font-semibold">
          View All
        </button>
      </div>
      {goal ? (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
            <span className="text-gray-600 dark:text-gray-300">
              ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-green-800 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full"
              style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            <p>You have no active savings goals.</p>
            <button onClick={onNavigate} className="mt-2 text-green-600 dark:text-green-400 font-semibold">
                Create one now!
            </button>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsPreview;