import React, { useState, useMemo, useEffect } from 'react';
import { Transaction } from '../types';
import { ICONS } from '../constants';

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onTransactionClick }) => {
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem('jpay_transaction_search') || '');
  const [startDate, setStartDate] = useState(() => localStorage.getItem('jpay_transaction_start_date') || '');
  const [endDate, setEndDate] = useState(() => localStorage.getItem('jpay_transaction_end_date') || '');

  useEffect(() => {
    localStorage.setItem('jpay_transaction_search', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (startDate) {
        localStorage.setItem('jpay_transaction_start_date', startDate);
    } else {
        localStorage.removeItem('jpay_transaction_start_date');
    }
  }, [startDate]);
  
  useEffect(() => {
    if (endDate) {
        localStorage.setItem('jpay_transaction_end_date', endDate);
    } else {
        localStorage.removeItem('jpay_transaction_end_date');
    }
  }, [endDate]);

  const handleClearDates = () => {
    setStartDate('');
    setEndDate('');
  };

  const renderIcon = (iconKey: string) => {
    const IconComponent = ICONS[iconKey] || ICONS.default;
    return <IconComponent className="w-6 h-6" />;
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        if (!startDate && !endDate) return true;
        const txDate = new Date(tx.date);
        
        // Adjust start date to the beginning of the day and end date to the end of the day for inclusive filtering
        const start = startDate ? new Date(startDate) : null;
        if(start) start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : null;
        if(end) end.setHours(23, 59, 59, 999);
        
        if (start && txDate < start) return false;
        if (end && txDate > end) return false;
        return true;
      })
      .filter(tx => 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [transactions, searchTerm, startDate, endDate]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }
  
  const exportToCSV = () => {
    const headers = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Status', 'Reference'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      new Date(tx.date).toLocaleString(),
      `"${tx.description.replace(/"/g, '""')}"`, // Handle quotes
      tx.amount,
      tx.type,
      tx.status,
      tx.reference,
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jpay_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h2>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
           <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-28 bg-white dark:bg-green-800 border border-gray-300 dark:border-green-700 text-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
           <div className="flex gap-2">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-green-800 border border-gray-300 dark:border-green-700 text-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"/>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-green-800 border border-gray-300 dark:border-green-700 text-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"/>
            {(startDate || endDate) && <button onClick={handleClearDates} className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500">Clear</button>}
          </div>
          <button onClick={exportToCSV} className="w-full sm:w-auto bg-gray-200 dark:bg-green-800 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-green-700 transition">
            Export
          </button>
        </div>
      </div>
      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map(tx => (
             <div key={tx.id} className="w-full flex items-center justify-between bg-white dark:bg-green-900 p-3 rounded-xl shadow-sm dark:shadow-none">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-green-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                  {renderIcon(tx.icon)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{tx.description}</p>
                   <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${tx.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300'}`}>{tx.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                  {tx.type === 'credit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                </p>
                <button onClick={() => onTransactionClick(tx)} className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1">
                    View Receipt
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;