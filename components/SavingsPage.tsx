import React, { useState } from 'react';
import { SavingsGoal } from '../types';

interface SavingsPageProps {
  goals: SavingsGoal[];
  onContribute: (goalId: string, amount: number) => boolean;
  onCreateGoal: (name: string, targetAmount: number) => void;
}

const SavingsGoalCard: React.FC<{ goal: SavingsGoal; onContribute: (goalId: string, amount: number) => boolean }> = ({ goal, onContribute }) => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
    const amountLeft = goal.targetAmount - goal.currentAmount;

    const handleContribute = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const contributionAmount = parseFloat(amount);
        if (isNaN(contributionAmount) || contributionAmount <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        const success = onContribute(goal.id, contributionAmount);
        if (success) {
            setAmount('');
        } else {
            setError('Contribution failed. Check your balance.');
        }
    };

    return (
        <div className="bg-white dark:bg-green-900 rounded-2xl p-4 mb-4 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{goal.name}</h3>
                    {progress < 100 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            ₦{amountLeft.toLocaleString()} left to save
                        </p>
                    )}
                </div>
                <span className={`text-sm font-semibold ${progress >= 100 ? 'text-green-500 dark:text-green-400' : 'text-gray-600 dark:text-gray-300'}`}>
                    {progress >= 100 ? 'Completed!' : `${Math.floor(progress)}%`}
                </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-green-800 rounded-full h-3 mb-2">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-right text-sm text-gray-600 dark:text-gray-300 mb-4">
                ₦{goal.currentAmount.toLocaleString()} / ₦{goal.targetAmount.toLocaleString()}
            </p>
            { progress < 100 && (
                 <form onSubmit={handleContribute} className="flex space-x-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setError(''); }}
                        placeholder="Amount"
                        className="flex-grow bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        aria-label={`Amount to contribute to ${goal.name}`}
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Add Funds
                    </button>
                </form>
            )}
           
            {error && <p className="text-red-500 dark:text-red-400 text-xs mt-2 text-center">{error}</p>}
        </div>
    );
};


const SavingsPage: React.FC<SavingsPageProps> = ({ goals, onContribute, onCreateGoal }) => {
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [formError, setFormError] = useState('');

    const handleCreateGoal = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        const targetAmount = parseFloat(newGoalTarget);
        if (!newGoalName.trim() || isNaN(targetAmount) || targetAmount <= 0) {
            setFormError('Please enter a valid name and target amount.');
            return;
        }
        onCreateGoal(newGoalName, targetAmount);
        setNewGoalName('');
        setNewGoalTarget('');
    };

    return (
        <div className="h-full pt-4">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">My Savings Goals</h1>
            <div className="mb-8">
                {goals.length > 0 ? (
                    goals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} onContribute={onContribute} />)
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">You haven't set any savings goals yet. Create one below!</p>
                )}
            </div>

            <div className="bg-white dark:bg-green-900 rounded-2xl p-4 shadow-sm dark:shadow-none">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Set a New Goal</h2>
                <form onSubmit={handleCreateGoal} className="space-y-4">
                    <div>
                        <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
                        <input
                            type="text"
                            id="goalName"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            placeholder="e.g., New Laptop"
                            className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (₦)</label>
                        <input
                            type="number"
                            id="targetAmount"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            placeholder="e.g., 500000"
                            className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                        />
                    </div>
                    {formError && <p className="text-red-500 dark:text-red-400 text-sm text-center">{formError}</p>}
                    <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Set Goal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SavingsPage;