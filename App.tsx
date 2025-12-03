import React, { useState, useCallback, useEffect } from 'react';
import { View, Transaction, Service, SavingsGoal, User, RecurringPayment } from './types';
import { SERVICES, ADD_FUNDS_SERVICE } from './constants';
import { authService } from './services/authService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Assistant from './components/Assistant';
import BottomNav from './components/BottomNav';
import ServiceModal from './components/ServiceModal';
import SavingsPage from './components/SavingsPage';
import AuthPage from './components/AuthPage';
import TransactionReceiptModal from './components/TransactionReceiptModal';
import RecurringPaymentsPage from './components/RecurringPaymentsPage';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingRecurringPayment, setEditingRecurringPayment] = useState<RecurringPayment | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveView(View.DASHBOARD);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const handleServiceClick = useCallback((service: Service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  }, []);

  const handleTransactionClick = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  }, []);
  
  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    authService.updateUser(updatedUser);
  };

  const handleDebitTransaction = useCallback(async (amount: number, description: string, serviceId?: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (currentUser.balance >= amount) {
      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'debit',
        description,
        amount,
        date: new Date().toISOString(),
        icon: serviceId || currentService?.id || 'default',
        status: 'completed',
        reference: `JPTXN-${Date.now()}`
      };
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance - amount,
        transactions: [newTransaction, ...currentUser.transactions],
      };
      updateUser(updatedUser);
      return true;
    }
    alert("Insufficient funds!");
    return false;
  }, [currentUser, currentService]);

  const handleCreditTransaction = useCallback(async (amount: number, description: string, serviceId?: string): Promise<boolean> => {
    if (!currentUser) return false;
     const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'credit',
        description,
        amount,
        date: new Date().toISOString(),
        icon: serviceId || currentService?.id || 'addFunds',
        status: 'completed',
        reference: `JPTXN-${Date.now()}`
      };
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance + amount,
        transactions: [newTransaction, ...currentUser.transactions],
      };
      updateUser(updatedUser);
      return true;
  }, [currentUser, currentService]);
  
  const handleP2PTransfer = async (recipientAccountNumber: string, amount: number, description: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    const res = await authService.performP2PTransfer(currentUser.phone, recipientAccountNumber, amount, description);
    
    if (res.success && res.updatedSender) {
        setCurrentUser(res.updatedSender); // Update state with the returned user data
        return true;
    } else {
        alert(res.message || "Transfer failed!");
        return false;
    }
  }

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setCurrentService(null);
    setEditingRecurringPayment(null);
  }, []);


  const handleVerifyPassword = async (password: string): Promise<boolean> => {
    if (!currentUser) return false;
    return await authService.verifyCurrentUserPassword(currentUser.phone, password);
  }
  
  const handleContributeToGoal = useCallback((goalId: string, amount: number) => {
    if (!currentUser) return false;
    const goal = currentUser.savingsGoals.find(g => g.id === goalId);
    if (!goal) return false;
    
    if (currentUser.balance >= amount) {
       const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'debit',
        description: `Contribution to ${goal.name}`,
        amount,
        date: new Date().toISOString(),
        icon: 'savings',
        status: 'completed',
        reference: `JPTXN-${Date.now()}`
      };
      const updatedUser = {
        ...currentUser,
        balance: currentUser.balance - amount,
        transactions: [newTransaction, ...currentUser.transactions],
        savingsGoals: currentUser.savingsGoals.map(g => 
          g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
        ),
      };
      updateUser(updatedUser);
      return true;
    }
    alert("Insufficient funds!");
    return false;
  }, [currentUser]);

  const handleCreateGoal = useCallback((name: string, targetAmount: number) => {
    if (!currentUser) return;
    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name,
      targetAmount,
      currentAmount: 0,
    };
    const updatedUser = {
      ...currentUser,
      savingsGoals: [...currentUser.savingsGoals, newGoal],
    };
    updateUser(updatedUser);
  }, [currentUser]);

  const handleCreateRecurringPayment = useCallback((paymentData: Omit<RecurringPayment, 'id' | 'nextDueDate'>) => {
    if (!currentUser) return;

    const calculateNextDueDate = (frequency: RecurringPayment['frequency']): string => {
        const now = new Date();
        if (frequency === 'daily') now.setDate(now.getDate() + 1);
        if (frequency === 'weekly') now.setDate(now.getDate() + 7);
        if (frequency === 'monthly') now.setMonth(now.getMonth() + 1);
        return now.toISOString();
    }

    const newPayment: RecurringPayment = {
        ...paymentData,
        id: `rp-${Date.now()}`,
        nextDueDate: calculateNextDueDate(paymentData.frequency),
    };

    const updatedUser: User = {
        ...currentUser,
        recurringPayments: [...currentUser.recurringPayments, newPayment],
    };
    updateUser(updatedUser);
    handleCloseModal();
  }, [currentUser, handleCloseModal]);
  
  const handleEditRecurringPayment = useCallback((payment: RecurringPayment) => {
    const service = SERVICES.find(s => s.id === payment.serviceId) || null;
    if (service) {
        setEditingRecurringPayment(payment);
        setCurrentService(service);
        setIsModalOpen(true);
    } else {
        console.error("Service for recurring payment not found");
        alert("Sorry, this payment type cannot be edited.");
    }
  }, []);
  
  const handleUpdateRecurringPayment = useCallback((updatedPayment: RecurringPayment) => {
    if (!currentUser) return;

    const calculateNextDueDate = (frequency: RecurringPayment['frequency']): string => {
        const now = new Date();
        if (frequency === 'daily') now.setDate(now.getDate() + 1);
        if (frequency === 'weekly') now.setDate(now.getDate() + 7);
        if (frequency === 'monthly') now.setMonth(now.getMonth() + 1);
        return now.toISOString();
    }

    const finalPayment = {
        ...updatedPayment,
        nextDueDate: calculateNextDueDate(updatedPayment.frequency),
    }

    const updatedUser = {
        ...currentUser,
        recurringPayments: currentUser.recurringPayments.map(p =>
            p.id === finalPayment.id ? finalPayment : p
        ),
    };
    updateUser(updatedUser);
    handleCloseModal();
  }, [currentUser, handleCloseModal]);


  const handleDeleteRecurringPayment = useCallback((paymentId: string) => {
    if (!currentUser) return;
    if (window.confirm("Are you sure you want to cancel this recurring payment?")) {
        const updatedUser = {
            ...currentUser,
            recurringPayments: currentUser.recurringPayments.filter(p => p.id !== paymentId),
        };
        updateUser(updatedUser);
    }
  }, [currentUser]);


  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard 
                  balance={currentUser.balance} 
                  transactions={currentUser.transactions} 
                  services={SERVICES} 
                  onServiceClick={handleServiceClick} 
                  savingsGoals={currentUser.savingsGoals}
                  onNavigateToSavings={() => setActiveView(View.SAVINGS)}
                  onAddFunds={() => handleServiceClick(ADD_FUNDS_SERVICE)}
                  onTransactionClick={handleTransactionClick}
                />;
      case View.ASSISTANT:
        return <Assistant />;
      case View.SAVINGS:
        return <SavingsPage
                  goals={currentUser.savingsGoals}
                  onContribute={handleContributeToGoal}
                  onCreateGoal={handleCreateGoal}
                />;
      case View.RECURRING:
        return <RecurringPaymentsPage 
                  payments={currentUser.recurringPayments}
                  onDelete={handleDeleteRecurringPayment}
                  onEdit={handleEditRecurringPayment}
                />;
      case View.PROFILE:
        return <ProfilePage 
                  currentUser={currentUser}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  onLogout={handleLogout}
                  onUpdateUser={updateUser}
               />;
      default:
        return <Dashboard 
                  balance={currentUser.balance} 
                  transactions={currentUser.transactions} 
                  services={SERVICES} 
                  onServiceClick={handleServiceClick} 
                  savingsGoals={currentUser.savingsGoals}
                  onNavigateToSavings={() => setActiveView(View.SAVINGS)}
                  onAddFunds={() => handleServiceClick(ADD_FUNDS_SERVICE)}
                   onTransactionClick={handleTransactionClick}
                />;
    }
  };

  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-green-950 font-sans text-gray-900 dark:text-white">
      <div className="max-w-md mx-auto bg-gray-50 dark:bg-green-950 flex flex-col h-screen">
        <Header userName={currentUser.name} profilePictureUrl={currentUser.profilePictureUrl || `https://i.pravatar.cc/150?u=${currentUser.id}`} />
        <main className="flex-1 overflow-y-auto pb-20 px-4">
          {renderContent()}
        </main>
        <BottomNav activeView={activeView} setActiveView={setActiveView} />
      </div>
      {isModalOpen && currentService && (
        <ServiceModal
          service={currentService}
          onClose={handleCloseModal}
          onDebitTransaction={handleDebitTransaction}
          onCreditTransaction={handleCreditTransaction}
          onP2PTransfer={handleP2PTransfer}
          onVerifyPassword={handleVerifyPassword}
          onSchedulePayment={handleCreateRecurringPayment}
          editingPayment={editingRecurringPayment}
          onUpdatePayment={handleUpdateRecurringPayment}
        />
      )}
      {isReceiptModalOpen && (
        <TransactionReceiptModal
            transaction={selectedTransaction}
            onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;