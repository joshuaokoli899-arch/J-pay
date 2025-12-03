import React from 'react';
import { Transaction, Service, SavingsGoal } from '../types';
import BalanceCard from './BalanceCard';
import ServiceGrid from './ServiceGrid';
import TransactionList from './TransactionList';
import SavingsGoalsPreview from './SavingsGoalsPreview';

interface DashboardProps {
  balance: number;
  transactions: Transaction[];
  services: Service[];
  onServiceClick: (service: Service) => void;
  savingsGoals: SavingsGoal[];
  onNavigateToSavings: () => void;
  onAddFunds: () => void;
  onTransactionClick: (transaction: Transaction) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ balance, transactions, services, onServiceClick, savingsGoals, onNavigateToSavings, onAddFunds, onTransactionClick }) => {
  return (
    <div className="space-y-6">
      <BalanceCard balance={balance} onAddFunds={onAddFunds} />
      <ServiceGrid services={services} onServiceClick={onServiceClick} />
      <SavingsGoalsPreview goals={savingsGoals} onNavigate={onNavigateToSavings} />
      <TransactionList transactions={transactions} onTransactionClick={onTransactionClick} />
    </div>
  );
};

export default Dashboard;