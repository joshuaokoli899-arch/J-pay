// Fix: Import React to use 'React.ReactNode' type which was causing a namespace error.
import React from 'react';

export enum View {
  DASHBOARD = 'dashboard',
  SAVINGS = 'savings',
  RECURRING = 'recurring',
  ASSISTANT = 'assistant',
  PROFILE = 'profile',
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string; // ISO 8601 format
  icon: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  formFields: {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options?: { value: string; label: string }[]; // For select fields
  }[];
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface RecurringPayment {
    id: string;
    serviceId: string;
    description: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    nextDueDate: string; // ISO 8601 format
    formData: { [key: string]: string };
}

export interface User {
  id: string;
  name: string;
  phone: string;
  passwordHash: string; // In a real app, this would be a bcrypt hash
  isVerified: boolean;
  balance: number;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  recurringPayments: RecurringPayment[];
  profilePictureUrl?: string; // To store base64 data URL for profile picture
  accountNumber: string;
  biometricsEnabled?: boolean;
}