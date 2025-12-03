import React from 'react';
import { RecurringPayment } from '../types';
import { ICONS } from '../constants';

interface RecurringPaymentsPageProps {
  payments: RecurringPayment[];
  onDelete: (paymentId: string) => void;
  onEdit: (payment: RecurringPayment) => void;
}

const RecurringPaymentsPage: React.FC<RecurringPaymentsPageProps> = ({ payments, onDelete, onEdit }) => {

  const formatDueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  }

  const renderIcon = (iconKey: string) => {
    const IconComponent = ICONS[iconKey] || ICONS.default;
    return <IconComponent className="w-6 h-6" />;
  };

  const EditIcon = ICONS['edit'];

  return (
    <div className="h-full pt-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Recurring Payments</h1>
      
      <div className="space-y-4">
        {payments.length > 0 ? (
          payments.map(payment => (
            <div key={payment.id} className="bg-white dark:bg-green-900 rounded-2xl p-4 shadow-sm dark:shadow-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-green-800 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                    {renderIcon(payment.serviceId)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{payment.description}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ₦{payment.amount.toLocaleString()} <span className="capitalize">/ {payment.frequency}</span>
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                      Next payment: {formatDueDate(payment.nextDueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onEdit(payment)}
                      className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 p-2 rounded-full bg-gray-100 dark:bg-green-800 transition-colors"
                      aria-label={`Edit recurring payment for ${payment.description}`}
                    >
                      <EditIcon className="w-5 h-5"/>
                    </button>
                    <button 
                      onClick={() => onDelete(payment.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full bg-gray-100 dark:bg-green-800 transition-colors"
                      aria-label={`Cancel recurring payment for ${payment.description}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-16">
            <div className="w-20 h-20 bg-gray-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-500">
                <ICONS.recurring className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">No Scheduled Payments</h3>
            <p className="mt-1">You can set up recurring payments after completing a transaction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecurringPaymentsPage;