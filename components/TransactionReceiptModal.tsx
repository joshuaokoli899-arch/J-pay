import React from 'react';
import { Transaction } from '../types';
import { ICONS } from '../constants';

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const IconComponent = ICONS[transaction.icon] || ICONS.default;
  const isCredit = transaction.type === 'credit';
  const statusColor = transaction.status === 'completed' ? 'text-green-500 bg-green-100 dark:bg-green-900 dark:text-green-400' :
                      transaction.status === 'pending' ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400' :
                      'text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-400';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-green-900 rounded-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="text-center mb-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${isCredit ? 'bg-green-100 dark:bg-green-800' : 'bg-red-100 dark:bg-red-800'}`}>
                <IconComponent className={`w-8 h-8 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
            </div>
            <p className={`text-3xl font-bold mt-4 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isCredit ? '+' : '-'}₦{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-gray-800 dark:text-white font-semibold mt-1">{transaction.description}</p>
        </div>

        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className={`font-semibold capitalize px-2 py-1 rounded-full text-xs ${statusColor}`}>
                    {transaction.status}
                </span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Reference</span>
                <span className="font-semibold text-gray-800 dark:text-white">{transaction.reference}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="font-semibold text-gray-800 dark:text-white">
                    {new Date(transaction.date).toLocaleString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                </span>
            </div>
        </div>
        
        <button onClick={onClose} className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
            Done
        </button>
      </div>
    </div>
  );
};

export default TransactionReceiptModal;