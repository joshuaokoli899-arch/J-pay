import React from 'react';
import { Service } from './types';

// SVG Icons as React Components
const TransferIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5l-3-3m0 0l-3 3m3-3v8"></path></svg>
);
const AirtimeIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
);
const DataIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.721 15.042l1.327 1.327a2 2 0 002.828 0l1.327-1.327M12 21a9 9 0 110-18 9 9 0 010 18z"></path></svg>
);
const ElectricityIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
);
const SavingsIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
);
const LogoutIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);
const AddFundsIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const SunIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
);
const MoonIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
);
const FoodIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
);
const TransportIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625 7.03 20.25 12 20.25zM12 11.625a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z"></path></svg>
);
const BillsIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);
const TvIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
);
const RecurringIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0121 12h-3a6 6 0 00-7.5-5.9L8 8m8 8l-1.5-1.5A9 9 0 013 12h3a6 6 0 007.5 5.9L16 16"></path></svg>
);
const EditIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
);
const CopyIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
);
const EyeIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
);
const EyeSlashIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
);
const GiftCardIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0h10a2 2 0 012 2M7 16h10"></path></svg>
);


export const ICONS: { [key: string]: React.FC<{className?: string}> } = {
  jpayTransfer: TransferIcon,
  bankTransfer: TransferIcon,
  airtime: AirtimeIcon,
  data: DataIcon,
  electricity: ElectricityIcon,
  tv: TvIcon,
  giftCard: GiftCardIcon,
  savings: SavingsIcon,
  recurring: RecurringIcon,
  logout: LogoutIcon,
  addFunds: AddFundsIcon,
  sun: SunIcon,
  moon: MoonIcon,
  food: FoodIcon,
  transport: TransportIcon,
  bills: BillsIcon,
  edit: EditIcon,
  copy: CopyIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  spotify: () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.237 13.92c-.24.36-.69.48-1.05.24-2.94-1.8-6.6-2.16-11.16-1.2.42-4.56 3.84-8.16 8.4-8.4 1.8.12 3.48.72 4.8 1.8.36.24.48.69.24 1.05-.24.36-.69.48-1.05-.24-1.08-.96-2.52-1.44-4.08-1.56-3.6.24-6.48 3.12-6.96 6.72 3.96-.84 7.08-.48 9.6 1.08.36.24.48.69.24 1.05v.24zm-1.8-3c-.24.3-.6.36-.9.12-2.4-1.5-5.52-1.92-9.24-1.08.24-3.12 2.4-5.52 5.52-5.76 1.32.12 2.52.6 3.48 1.32.3.24.36.6.12.9s-.6.36-.9-.12c-.72-.6-1.68-.96-2.76-1.08-2.4.24-4.32 2.16-4.56 4.56 3.12-.72 5.64-.36 7.68 1.08.3.24.36.6.12.9zm-1.44-2.88c-.24.3-.6.36-.9.12-1.92-1.2-4.56-1.56-7.8-1.08.12-2.16 1.68-3.84 3.84-3.96.96.12 1.8.48 2.52 1.08.3.24.36.6.12.9s-.6.36-.9-.12c-.6-.48-1.2-.72-1.92-.84-1.56.12-2.88 1.44-3 3 2.76-.36 4.92 0 6.6 1.08.3.12.48.48.24.72z"/></svg>,
  default: TransferIcon,
};

const EXTERNAL_BANKS = [
    { value: 'access', label: 'Access Bank' },
    { value: 'first', label: 'First Bank' },
    { value: 'gtb', label: 'GTBank' },
    { value: 'uba', label: 'UBA' },
    { value: 'zenith', label: 'Zenith Bank' },
    { value: 'kuda', label: 'Kuda MFB' },
    { value: 'opay', label: 'Opay' },
];

export const SERVICES: Service[] = [
  {
    id: 'jpayTransfer', name: 'To J pay', icon: <TransferIcon />,
    formFields: [
      { name: 'accountNumber', label: 'Recipient Account Number', type: 'number', placeholder: 'Enter 10-digit account number' },
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
      { name: 'narration', label: 'Narration (Optional)', type: 'text', placeholder: 'For...' },
    ]
  },
  {
    id: 'bankTransfer', name: 'To Bank', icon: <TransferIcon />,
    formFields: [
      { name: 'bankName', label: 'Bank', type: 'select', placeholder: 'Select a bank', options: EXTERNAL_BANKS },
      { name: 'accountNumber', label: 'Account Number', type: 'number', placeholder: '0123456789' },
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
      { name: 'narration', label: 'Narration (Optional)', type: 'text', placeholder: 'For...' },
    ]
  },
  {
    id: 'airtime', name: 'Airtime', icon: <AirtimeIcon />,
    formFields: [
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '08012345678' },
      { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
    ]
  },
  {
    id: 'data', name: 'Data', icon: <DataIcon />,
    formFields: [
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '08012345678' },
      // Data plans are now handled dynamically in the modal
    ]
  },
  {
    id: 'electricity', name: 'Electricity', icon: <ElectricityIcon />,
    formFields: [
        // Fields handled dynamically in modal
    ]
  },
  {
    id: 'tv', name: 'TV/Cable', icon: <TvIcon />,
    formFields: [
        // Fields handled dynamically in modal
    ]
  },
  {
    id: 'giftCard', name: 'Gift Card', icon: <GiftCardIcon />,
    formFields: [
        // Fields handled dynamically in modal
    ]
  },
];

export const ADD_FUNDS_SERVICE: Service = {
  id: 'addFunds',
  name: 'Add Funds via Card',
  icon: <AddFundsIcon />,
  formFields: [
    { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
    { name: 'cardNumber', label: 'Card Number', type: 'text', placeholder: '0000 0000 0000 0000' },
    { name: 'expiryDate', label: 'Expiry Date', type: 'text', placeholder: 'MM/YY' },
    { name: 'cvv', label: 'CVV', type: 'text', placeholder: '123' },
  ]
};

// --- DATA FOR DYNAMIC SERVICES ---

export const J_PAY_COMMISSION_RATE = 0.02; // 2%
export const J_PAY_COMMISSION_ACCOUNT = '7018536467'; // Opay account

export const GIFT_CARD_VENDORS: { [key: string]: { name: string; rate: number; logo: React.ReactNode } } = {
    amazon: { name: 'Amazon', rate: 1450, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12.47 10.39L10.53 14H8.53L10.8 10.39H12.47M15.47 10.39L13.53 14H11.53L13.8 10.39H15.47M20.24 10.39C20.24 10.39 21.39 8.53 22.5 7.74C22.5 7.74 22.5 14 22.5 14H20.24V10.39Z M3 5C3 3.89 3.89 3 5 3H19C20.11 3 21 3.89 21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.11 3 19V5Z M7.11 7.74C5.91 8.53 5.91 8.53 5.91 8.53L4.5 10.39V14H6.76V10.39L8.36 8.53C7.94 8.21 7.5 7.94 7.11 7.74Z"/></svg> },
    steam: { name: 'Steam', rate: 1400, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 4.5C21.3 5.3 21.3 5.3 21.3 5.3L15.3 8.3C15.3 8.3 16.5 6 15.8 5.3C15.1 4.6 12.8 5.8 12.8 5.8L9.8 11.8C9.8 11.8 12.1 13 12.8 12.3C13.5 11.6 12.3 9.3 12.3 9.3L18.3 6.3C18.3 6.3 20.5 4.5 20.5 4.5M3.5 11.8C3.5 12.5 3.5 12.5 3.5 12.5L7.3 14.8C7.3 14.8 6.5 13.6 7.2 12.9C7.9 12.2 9.5 13.1 9.5 13.1L11.8 9.3C11.8 9.3 9.5 8.5 8.8 9.2C8.1 9.9 9.3 11.1 9.3 11.1L5.5 8.8C5.5 8.8 3.5 11.1 3.5 11.8Z"/></svg> },
    apple: { name: 'Apple', rate: 1350, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M17.2,2.8c-1.2-1.2-2.9-1.9-4.7-1.9c-1.8,0-3.5,0.7-4.7,1.9c-1.2,1.2-1.9,2.9-1.9,4.7c0,1,0.2,1.9,0.6,2.8H6v1.9h0.6 c0.3,0.7,0.8,1.4,1.4,1.9c0.6,0.5,1.3,0.9,2.1,1.2V17H9.2v1.9h1.9v0.6h1.9v-0.6h1.9V17h-1.9v-1.9c0.8-0.2,1.5-0.6,2.1-1.2 c0.6-0.5,1.1-1.2,1.4-1.9H18V10.3h-0.6c0.4-0.9,0.6-1.8,0.6-2.8C19.1,5.7,18.4,4,17.2,2.8z M12,4.7c1.4,0,2.6,1.2,2.6,2.6 c0,1.4-1.2,2.6-2.6,2.6c-1.4,0-2.6-1.2,2.6-2.6C9.4,5.8,10.6,4.7,12,4.7z"/></svg> },
    google: { name: 'Google Play', rate: 1300, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M3,12L15,21L15,3L3,12Z M16,3L16,9L22,6L16,3Z M16,15L16,21L22,18L16,15Z"/></svg> },
    netflix: { name: 'Netflix', rate: 1250, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M8.45,7.42H8.42L5.86,16.58H3.42V7.42H5.86V13.3L8.42,7.42H10.86V16.58H8.42V7.42H8.45M15.58,7.42H13.14V16.58H15.58V7.42M20.58,7.42H18.14V16.58H20.58V7.42Z"/></svg> },
    spotify: { name: 'Spotify', rate: 1250, logo: <ICONS.spotify /> },
    visa: { name: 'Visa Gift Card', rate: 1500, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M2,6H22V18H2V6M5,8L3,16H5L7,8H5M10,8L8,16H10L12,8H10M13,8L11,16H13L15,8H13M19,8H15L16,12L14,16H16L17,12L19,8Z" /></svg> },
    razer: { name: 'Razer Gold', rate: 1380, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M8,3V8H3V10H8V11H6V13H8V14H3V16H8V21H10V16H11V14H10V13H12V11H10V8H11V6H13V8H14V10H16V8H18V10H20V8H21V3H8Z" /></svg> },
    playstation: { name: 'PlayStation', rate: 1390, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M10,6V18H8V6H10M14,6V18H12V6H14Z" /></svg> },
    uber: { name: 'Uber', rate: 1320, logo: <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M10,6V11H14V6H10M10,13V18H14V13H10Z" /></svg> },
};

export const TV_PROVIDERS = {
    dstv: {
        name: 'DStv',
        plans: [
            { name: 'Premium', price: 29500 },
            { name: 'Compact Plus', price: 19800 },
            { name: 'Compact', price: 12500 },
            { name: 'Confam', price: 7400 },
            { name: 'Yanga', price: 6000 },
        ]
    },
    gotv: {
        name: 'GOtv',
        plans: [
            { name: 'Supa Plus', price: 16800 },
            { name: 'Supa', price: 11400 },
            { name: 'Max', price: 8500 },
            { name: 'Jolli', price: 5800 },
            { name: 'Smallie', price: 1900 },
        ]
    }
};

export const NETWORK_PROVIDERS = {
  mtn: {
    name: "MTN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/New-mtn-logo.jpg/800px-New-mtn-logo.jpg",
    prefixes: ["0803", "0806", "0703", "0706", "0810", "0813", "0814", "0816", "0903", "0906"],
  },
  glo: {
    name: "Glo",
    logo: "https://www.gloworld.com/ng/wp-content/uploads/2023/04/Glo-logo-High-Res.png",
    prefixes: ["0805", "0807", "0705", "0811", "0815", "0905"],
  },
  airtel: {
    name: "Airtel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Airtel_Nigeria_logo.svg/1280px-Airtel_Nigeria_logo.svg.png",
    prefixes: ["0802", "0808", "0701", "0708", "0812", "0902", "0907"],
  },
  "9mobile": {
    name: "9mobile",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7A/9mobile-Logo.svg/1200px-9mobile-Logo.svg.png",
    prefixes: ["0809", "0817", "0818", "0908", "0909"],
  },
};

export const DATA_PLANS = {
  mtn: {
    daily: [
      { name: "100MB", price: 100, validity: "1 Day" },
      { name: "1GB", price: 300, validity: "1 Day" },
    ],
    weekly: [
      { name: "1.5GB", price: 500, validity: "7 Days" },
      { name: "6GB", price: 1500, validity: "7 Days" },
    ],
    monthly: [
      { name: "4.5GB", price: 2000, validity: "30 Days" },
      { name: "10GB", price: 3500, validity: "30 Days" },
    ],
    yearly: [],
  },
  glo: {
    daily: [{ name: "150MB", price: 100, validity: "1 Day" }],
    weekly: [{ name: "1.2GB", price: 500, validity: "14 Days" }],
    monthly: [
      { name: "5.8GB", price: 2000, validity: "30 Days" },
      { name: "12GB", price: 4000, validity: "30 Days" },
    ],
     yearly: [],
  },
  airtel: {
    daily: [{ name: "100MB", price: 100, validity: "1 Day" }],
    weekly: [{ name: "1GB", price: 500, validity: "7 Days" }],
    monthly: [
      { name: "5GB", price: 2500, validity: "30 Days" },
      { name: "11GB", price: 4000, validity: "30 Days" },
    ],
     yearly: [],
  },
  "9mobile": {
    daily: [{ name: "100MB", price: 100, validity: "1 Day" }],
    weekly: [{ name: "1GB", price: 500, validity: "7 Days" }],
    monthly: [
      { name: "4.5GB", price: 2000, validity: "30 Days" },
      { name: "11GB", price: 4000, validity: "30 Days" },
    ],
     yearly: [],
  },
};

export const NIGERIAN_STATES = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

export const ELECTRICITY_DISCOS: { [key: string]: string } = {
  'Abia': 'Enugu Electricity Distribution Company (EEDC)',
  'Adamawa': 'Yola Electricity Distribution Company (YEDC)',
  'Akwa Ibom': 'Port Harcourt Electricity Distribution Company (PHEDC)',
  'Anambra': 'Enugu Electricity Distribution Company (EEDC)',
  'Bauchi': 'Jos Electricity Distribution Company (JEDC)',
  'Bayelsa': 'Port Harcourt Electricity Distribution Company (PHEDC)',
  'Benue': 'Jos Electricity Distribution Company (JEDC)',
  'Borno': 'Yola Electricity Distribution Company (YEDC)',
  'Cross River': 'Port Harcourt Electricity Distribution Company (PHEDC)',
  'Delta': 'Benin Electricity Distribution Company (BEDC)',
  'Ebonyi': 'Enugu Electricity Distribution Company (EEDC)',
  'Edo': 'Benin Electricity Distribution Company (BEDC)',
  'Ekiti': 'Benin Electricity Distribution Company (BEDC)',
  'Enugu': 'Enugu Electricity Distribution Company (EEDC)',
  'Gombe': 'Jos Electricity Distribution Company (JEDC)',
  'Imo': 'Enugu Electricity Distribution Company (EEDC)',
  'Jigawa': 'Kano Electricity Distribution Company (KEDCO)',
  'Kaduna': 'Kaduna Electricity Distribution Company (KAEDCO)',
  'Kano': 'Kano Electricity Distribution Company (KEDCO)',
  'Katsina': 'Kano Electricity Distribution Company (KEDCO)',
  'Kebbi': 'Kaduna Electricity Distribution Company (KAEDCO)',
  'Kogi': 'Abuja Electricity Distribution Company (AEDC)',
  'Kwara': 'Ibadan Electricity Distribution Company (IBEDC)',
  'Lagos': 'Eko Electricity Distribution Company (EKEDC) / Ikeja Electric (IE)',
  'Nasarawa': 'Abuja Electricity Distribution Company (AEDC)',
  'Niger': 'Abuja Electricity Distribution Company (AEDC)',
  'Ogun': 'Ibadan Electricity Distribution Company (IBEDC)',
  'Ondo': 'Benin Electricity Distribution Company (BEDC)',
  'Osun': 'Ibadan Electricity Distribution Company (IBEDC)',
  'Oyo': 'Ibadan Electricity Distribution Company (IBEDC)',
  'Plateau': 'Jos Electricity Distribution Company (JEDC)',
  'Rivers': 'Port Harcourt Electricity Distribution Company (PHEDC)',
  'Sokoto': 'Kaduna Electricity Distribution Company (KAEDCO)',
  'Taraba': 'Yola Electricity Distribution Company (YEDC)',
  'Yobe': 'Yola Electricity Distribution Company (YEDC)',
  'Zamfara': 'Kaduna Electricity Distribution Company (KAEDCO)',
};