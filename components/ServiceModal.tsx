import React, { useState, useEffect } from 'react';
import { Service, RecurringPayment } from '../types';
import { NETWORK_PROVIDERS, DATA_PLANS, NIGERIAN_STATES, ELECTRICITY_DISCOS, TV_PROVIDERS, SERVICES, GIFT_CARD_VENDORS, J_PAY_COMMISSION_RATE } from '../constants';
import { authService } from '../services/authService';

type ModalStep = 'form' | 'verify_account' | 'preview' | 'confirm_password';

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
  onDebitTransaction: (amount: number, description: string, serviceId?: string) => Promise<boolean>;
  onCreditTransaction: (amount: number, description: string, serviceId?: string) => Promise<boolean>;
  onP2PTransfer: (recipientAccountNumber: string, amount: number, description: string) => Promise<boolean>;
  onVerifyPassword: (password: string) => Promise<boolean>;
  onSchedulePayment: (payment: Omit<RecurringPayment, 'id' | 'nextDueDate'>) => void;
  editingPayment?: RecurringPayment | null;
  onUpdatePayment?: (payment: RecurringPayment) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onDebitTransaction, onCreditTransaction, onP2PTransfer, onVerifyPassword, onSchedulePayment, editingPayment, onUpdatePayment }) => {
  const isEditMode = !!editingPayment;
  const [step, setStep] = useState<ModalStep>('form');
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactionDescription, setTransactionDescription] = useState('');
  const [userNote, setUserNote] = useState('');

  // Recurring payment state
  const [isRecurring, setIsRecurring] = useState(isEditMode);
  const [frequency, setFrequency] = useState<RecurringPayment['frequency']>('monthly');

  // Transfer specific state
  const [recipientName, setRecipientName] = useState('');

  // Data service
  const [network, setNetwork] = useState<string | null>(null);
  const [planCategory, setPlanCategory] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Electricity service
  const [disco, setDisco] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  
  // TV Service
  const [tvPlans, setTvPlans] = useState<{name: string, price: number}[]>([]);

  // Gift Card Service
  const [giftCardAction, setGiftCardAction] = useState<'buy' | 'sell' | null>(null);
  const [buyCalculation, setBuyCalculation] = useState({ ngnValue: 0 });
  const [sellCalculation, setSellCalculation] = useState({ ngnValue: 0, commission: 0, payout: 0 });
  
  useEffect(() => {
    // Populate form if in edit mode
    if (editingPayment) {
        setFormData(editingPayment.formData);
        setFrequency(editingPayment.frequency);
        const noteMatch = editingPayment.description.match(/ - Note: (.+)/);
        if (noteMatch && noteMatch[1]) {
            setUserNote(noteMatch[1]);
        }
    }
  }, [editingPayment]);


  useEffect(() => {
    // Reset state if service changes (but not on initial load of edit mode)
    if (!isEditMode) {
      setStep('form');
      setFormData({});
      setError('');
      setIsLoading(false);
      setRecipientName('');
      setIsRecurring(false);
      setFrequency('monthly');
      setUserNote('');
      setGiftCardAction(null);
    }
  }, [service, isEditMode]);

  // --- Dynamic Form Logic ---
  useEffect(() => {
    // Data network detection
    if (service.id === 'data' && formData.phoneNumber?.length >= 4) {
      const prefix = formData.phoneNumber.substring(0, 4);
      const foundNetwork = Object.keys(NETWORK_PROVIDERS).find(net => 
        NETWORK_PROVIDERS[net as keyof typeof NETWORK_PROVIDERS].prefixes.includes(prefix)
      );
      setNetwork(foundNetwork || null);
    } else if (service.id !== 'data') {
      setNetwork(null);
    }
    
    // Electricity disco detection
    if (service.id === 'electricity' && formData.state) {
        setDisco(ELECTRICITY_DISCOS[formData.state] || 'N/A');
        setVerifiedName('');
    }
    
    // TV plan detection
    if (service.id === 'tv' && formData.provider) {
        setTvPlans(TV_PROVIDERS[formData.provider as keyof typeof TV_PROVIDERS]?.plans || []);
    }

    const vendor = formData.vendor ? GIFT_CARD_VENDORS[formData.vendor] : null;
    const usdAmount = parseFloat(formData.usdAmount) || 0;

    // Gift card buy calculation
    if (service.id === 'giftCard' && giftCardAction === 'buy' && vendor && usdAmount > 0) {
        const ngnValue = usdAmount * vendor.rate;
        setBuyCalculation({ ngnValue });
    } else {
        setBuyCalculation({ ngnValue: 0 });
    }

    // Gift card sell calculation
    if (service.id === 'giftCard' && giftCardAction === 'sell' && vendor && usdAmount > 0) {
        const ngnValue = usdAmount * vendor.rate;
        const commission = ngnValue * J_PAY_COMMISSION_RATE;
        const payout = ngnValue - commission;
        setSellCalculation({ ngnValue, commission, payout });
    } else {
        setSellCalculation({ ngnValue: 0, commission: 0, payout: 0 });
    }
  }, [formData, service.id, giftCardAction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Auto-format card number
    if (name === 'cardNumber') {
        const numericValue = value.replace(/\D/g, '');
        formattedValue = numericValue.match(/.{1,4}/g)?.join(' ').slice(0, 19) || '';
    }

    // Auto-format expiry date
    if (name === 'expiryDate') {
        const numericValue = value.replace(/\D/g, '');
        if (numericValue.length > 2) {
            formattedValue = `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}`;
        } else {
            formattedValue = numericValue;
        }
    }
    
    if (name === 'cvv') {
        formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }


    setFormData(prev => {
        const newData = { ...prev, [name]: formattedValue };
        
        // Reset TV fields if provider changes
        if (service.id === 'tv' && name === 'provider') {
            newData.planName = '';
            newData.amount = '';
        }
        
        return newData;
    });
    setError('');
  };

  const handlePlanSelect = (price: number, name: string) => {
      setFormData(prev => ({...prev, amount: price.toString(), planName: name }));
  };
  
  const handleProceedFromForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let amount = parseFloat(formData.amount);
    
    if (service.id === 'addFunds') {
        if (!/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
            setError("Please enter a valid 16-digit card number."); return;
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
            setError("Please use MM/YY format for expiry date."); return;
        }
        if (!/^\d{3}$/.test(formData.cvv)) {
            setError("Please enter a valid 3-digit CVV."); return;
        }
    }
    
    // Set amount from calculation for gift cards
    if (service.id === 'giftCard') {
        if (giftCardAction === 'buy') {
            if (buyCalculation.ngnValue <= 0) {
                setError('Please enter a valid USD amount.');
                return;
            }
            amount = buyCalculation.ngnValue;
        } else if (giftCardAction === 'sell') {
            if (sellCalculation.payout <= 0) {
                setError('Please enter a valid USD amount.');
                return;
            }
            amount = sellCalculation.payout;
        }
    }
     
    if ((!formData.planName && (service.id === 'data' || service.id === 'tv')) && (isNaN(amount) || amount <= 0)) {
        setError('Please enter or select a valid amount.');
        return;
    }
    
    // Persist calculated amount in formData for later steps
    setFormData(prev => ({ ...prev, amount: amount.toString() }));

    // Carry over narration to userNote if present
    if (formData.narration) {
        setUserNote(formData.narration);
    }

    setIsLoading(true);

    if (service.id === 'jpayTransfer' || service.id === 'bankTransfer') {
      const bankToVerify = service.id === 'jpayTransfer' ? 'jpay' : formData.bankName;
      const res = await authService.verifyAccountNumber(formData.accountNumber, bankToVerify);
      if (res.success && res.name) {
        setRecipientName(res.name);
        setStep('preview');
      } else {
        setError(res.message || "Could not verify account details.");
      }
    } else if (service.id === 'electricity') {
      if (!formData.meterNumber) { setError('Meter number is required.'); setIsLoading(false); return; }
      await new Promise(resolve => setTimeout(resolve, 1500));
      if(formData.meterNumber.length < 10) {
          setError("Invalid meter number.");
          setVerifiedName('');
      } else {
          setVerifiedName('John Doe');
          setStep('preview');
      }
    } else {
        setStep('preview');
    }
    
    setIsLoading(false);
  };
  
  const generateDescription = () => {
     let description = service.name;
    if (service.id === 'jpayTransfer' || service.id === 'bankTransfer') {
        const bankName = service.id === 'jpayTransfer' 
            ? 'J pay' 
            : SERVICES.find(s => s.id === 'bankTransfer')?.formFields.find(f => f.name === 'bankName')?.options?.find(o => o.value === formData.bankName)?.label || 'Bank';
        description = `Transfer to ${recipientName || 'recipient'} (${bankName} - ${formData.accountNumber})`;
    } else if (service.id === 'data') {
        description = `${formData.planName || 'Data'} for ${formData.phoneNumber}`;
    } else if (service.id === 'tv') {
        description = `${formData.provider?.toUpperCase()} ${formData.planName} for ${formData.smartCardNumber}`;
    } else if (service.id === 'electricity') {
        description = `Electricity for ${formData.meterNumber} (${verifiedName || 'user'})`;
    } else if (service.id === 'airtime') {
        description = `Airtime for ${formData.phoneNumber}`;
    } else if (service.id === 'addFunds') {
        const last4 = formData.cardNumber?.replace(/\s/g, '').slice(-4) || '****';
        description = `Funds added via Card ending in ${last4}`;
    } else if (service.id === 'giftCard') {
        const vendorName = GIFT_CARD_VENDORS[formData.vendor]?.name || 'Gift Card';
        if (giftCardAction === 'buy') {
            description = `Purchase of $${formData.usdAmount} ${vendorName} Gift Card`;
        } else {
            const last4 = formData.giftCardCode ? ` (Code: ...${formData.giftCardCode.slice(-4)})` : '';
            description = `Sale of $${formData.usdAmount} ${vendorName} Gift Card${last4}`;
        }
    }
    setTransactionDescription(description);
  }
  
  useEffect(() => {
    if (step === 'preview') {
      generateDescription();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, recipientName, verifiedName, formData, giftCardAction]);


  const handleFinalConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const passwordCorrect = await onVerifyPassword(password);

    if (passwordCorrect) {
        const finalDescription = userNote ? `${transactionDescription} - Note: ${userNote}` : transactionDescription;
        
        if (isEditMode && onUpdatePayment) {
            // --- UPDATE LOGIC ---
            const updatedPayment: RecurringPayment = {
                ...editingPayment,
                amount: parseFloat(formData.amount),
                description: finalDescription,
                frequency,
                formData,
            };
            onUpdatePayment(updatedPayment);
        } else {
            // --- CREATE LOGIC ---
            let success = false;
            const amountToTransact = parseFloat(formData.amount);
            const isCreditOperation = service.id === 'addFunds' || (service.id === 'giftCard' && giftCardAction === 'sell');

            if(service.id === 'jpayTransfer') {
                success = await onP2PTransfer(formData.accountNumber, amountToTransact, finalDescription);
            } else if (isCreditOperation) {
                success = await onCreditTransaction(amountToTransact, finalDescription, service.id);
            } else {
                success = await onDebitTransaction(amountToTransact, finalDescription, service.id);
            }

            if (success) {
                if (isRecurring) {
                    onSchedulePayment({
                        serviceId: service.id,
                        amount: amountToTransact,
                        description: finalDescription,
                        frequency,
                        formData,
                    });
                } else {
                    onClose(); 
                }
            } else {
                setStep('preview');
                setError('Transaction failed. Please check your balance or details.');
            }
        }
    } else {
      setError('Incorrect password. Please try again.');
    }
    setIsLoading(false);
  };

  // --- RENDER METHODS ---
  const renderFormContent = () => {
      switch(service.id) {
          case 'data': return renderDataForm();
          case 'electricity': return renderElectricityForm();
          case 'tv': return renderTvForm();
          case 'giftCard': return renderGiftCardForm();
          case 'addFunds': return renderAddFundsForm();
          default: return renderGenericForm();
      }
  }
  
  const renderGenericForm = () => service.formFields.map(field => (
    <div key={field.name} className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
      {field.type === 'select' ? (
        <select
          name={field.name} id={field.name} required value={formData[field.name] || ''} onChange={handleChange}
          className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="" disabled>{field.placeholder}</option>
          {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input
          type={field.type} name={field.name} id={field.name} required={field.name !== 'narration'} onChange={handleChange} value={formData[field.name] || ''} placeholder={field.placeholder}
          className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
      )}
    </div>
  ));

  const renderDataForm = () => (
     <>
      <div className="mb-4">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
        <div className="relative">
            <input type="tel" name="phoneNumber" id="phoneNumber" required onChange={handleChange} value={formData.phoneNumber || ''} placeholder="08012345678" className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"/>
            {network && (<img src={NETWORK_PROVIDERS[network as keyof typeof NETWORK_PROVIDERS].logo} alt={`${network} logo`} className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-auto" />)}
        </div>
      </div>
      {network && DATA_PLANS[network as keyof typeof DATA_PLANS] && (
        <div>
          <div className="flex justify-center border-b border-gray-200 dark:border-green-700 mb-4">
            {(Object.keys(DATA_PLANS[network as keyof typeof DATA_PLANS]) as (keyof typeof DATA_PLANS.mtn)[]).map(cat => (
              <button key={cat} type="button" onClick={() => setPlanCategory(cat)} className={`px-4 py-2 text-sm font-medium capitalize -mb-px border-b-2 transition-colors ${planCategory === cat ? 'border-green-500 text-green-600 dark:text-green-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>{cat}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
            {DATA_PLANS[network as keyof typeof DATA_PLANS][planCategory].map(plan => (
              <button key={plan.name} type="button" onClick={() => handlePlanSelect(plan.price, plan.name)} className={`text-left p-3 rounded-lg border-2 transition-colors ${formData.planName === plan.name ? 'border-green-500 bg-green-50 dark:bg-green-800' : 'border-gray-200 dark:border-green-700 hover:border-green-400'}`}>
                <p className="font-bold text-gray-900 dark:text-white">{plan.name}</p>
                <p className="text-sm text-green-600 dark:text-green-400 font-semibold">₦{plan.price}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{plan.validity}</p>
              </button>
            ))}
          </div>
           <input type="hidden" name="amount" value={formData.amount || ''} />
        </div>
      )}
    </>
  );

  const renderAddFundsForm = () => (
     <>
        <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
            <input
                type="number" name="amount" id="amount" required
                onChange={handleChange} value={formData.amount || ''}
                placeholder="0.00"
                className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
            <input
                type="text" name="cardNumber" id="cardNumber" required
                onChange={handleChange} value={formData.cardNumber || ''}
                placeholder="0000 0000 0000 0000"
                className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
            />
        </div>
        <div className="flex space-x-4">
            <div className="w-1/2">
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                <input
                    type="text" name="expiryDate" id="expiryDate" required
                    onChange={handleChange} value={formData.expiryDate || ''}
                    placeholder="MM/YY"
                    className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
            </div>
            <div className="w-1/2">
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                <input
                    type="text" name="cvv" id="cvv" required
                    onChange={handleChange} value={formData.cvv || ''}
                    placeholder="123"
                    className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
            </div>
        </div>
    </>
  );

  const renderElectricityForm = () => (
     <>
      <div className="mb-4">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
        <select name="state" id="state" required value={formData.state || ''} onChange={handleChange} className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
            <option value="" disabled>Select your state</option>
            {NIGERIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
        </select>
      </div>
      {disco && <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">Provider: <span className="font-semibold">{disco}</span></p>}
      <div className="mb-4">
        <label htmlFor="meterNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meter Number</label>
        <input type="number" name="meterNumber" id="meterNumber" required onChange={handleChange} value={formData.meterNumber || ''} placeholder="1234567890" className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" disabled={!formData.state} />
      </div>
       <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
        <input type="number" name="amount" id="amount" required onChange={handleChange} value={formData.amount || ''} placeholder="0.00" className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"/>
      </div>
    </>
  )
  
  const renderTvForm = () => (
    <>
      <div className="mb-4">
        <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
        <select name="provider" id="provider" required value={formData.provider || ''} onChange={handleChange} className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
            <option value="" disabled>Select Provider</option>
            <option value="dstv">DStv</option>
            <option value="gotv">GOtv</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="smartCardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Smart Card / IUC Number</label>
        <input type="number" name="smartCardNumber" id="smartCardNumber" required value={formData.smartCardNumber || ''} onChange={handleChange} placeholder="Enter your card number" className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
      </div>
       {tvPlans.length > 0 && (
          <div className="mb-4">
            <label htmlFor="planName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Plan</label>
            <select name="planName" id="planName" required value={formData.planName || ''} onChange={(e) => {
                const selectedPlan = tvPlans.find(p => p.name === e.target.value);
                if (selectedPlan) { handlePlanSelect(selectedPlan.price, selectedPlan.name); }
            }} className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                <option value="" disabled>Select a plan</option>
                {tvPlans.map(plan => <option key={plan.name} value={plan.name}>{plan.name} - ₦{plan.price.toLocaleString()}</option>)}
            </select>
          </div>
      )}
       <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
        <input type="number" name="amount" id="amount" required value={formData.amount || ''} onChange={handleChange} placeholder="0.00" readOnly className="w-full bg-gray-200 dark:bg-green-900 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
      </div>
    </>
  );

  const renderGiftCardForm = () => {
    if (!giftCardAction) {
        return (
            <div className="space-y-4">
                 <button onClick={() => setGiftCardAction('buy')} className="w-full text-left p-4 bg-gray-100 dark:bg-green-800 hover:bg-gray-200 dark:hover:bg-green-700 rounded-lg transition-colors group">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Buy Gift Card</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Purchase cards from top vendors.</p>
                </button>
                <button onClick={() => setGiftCardAction('sell')} className="w-full text-left p-4 bg-gray-100 dark:bg-green-800 hover:bg-gray-200 dark:hover:bg-green-700 rounded-lg transition-colors group">
                     <h3 className="font-bold text-lg text-gray-900 dark:text-white">Sell Gift Card</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get instant cash for your gift cards.</p>
                </button>
            </div>
        )
    }
    
    const CalculationDisplay: React.FC<{title: string, lines: {label: string, value: string, highlight?: boolean, bold?: boolean}[]}> = ({title, lines}) => (
        <div className="bg-gray-100 dark:bg-green-800 rounded-lg p-4 mb-4 space-y-2 text-sm">
            <h4 className="font-bold text-center text-gray-800 dark:text-white mb-2">{title}</h4>
            {lines.map((line, index) => (
                <React.Fragment key={index}>
                    {index === lines.length -1 && lines.length > 1 && <hr className="border-gray-300 dark:border-green-700"/>}
                    <div className={`flex justify-between ${line.highlight ? 'text-base text-green-600 dark:text-green-400' : ''}`}>
                        <span className={`text-gray-500 dark:text-gray-400 ${line.bold ? 'font-bold': ''}`}>{line.label}</span>
                        <span className={`font-extrabold ${line.bold ? 'text-gray-900 dark:text-white' : ''}`}>{line.value}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );

    const commonFields = (
        <>
            <button type="button" onClick={() => setGiftCardAction(null)} className="text-sm text-green-500 dark:text-green-400 mb-4">&larr; Back</button>
            <div className="mb-4">
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Vendor</label>
                <select name="vendor" id="vendor" required value={formData.vendor || ''} onChange={handleChange} className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                    <option value="" disabled>Select a gift card</option>
                    {Object.entries(GIFT_CARD_VENDORS).map(([key, {name}]) => <option key={key} value={key}>{name}</option>)}
                </select>
            </div>
             <div className="mb-4">
                <label htmlFor="usdAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Value (USD)</label>
                <input type="number" name="usdAmount" id="usdAmount" required onChange={handleChange} value={formData.usdAmount || ''} placeholder="e.g., 100" className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"/>
            </div>
        </>
    );

    if (giftCardAction === 'buy') {
        return (
            <>
                {commonFields}
                {buyCalculation.ngnValue > 0 && (
                    <CalculationDisplay title="Purchase Summary" lines={[
                        { label: 'Rate', value: `₦${GIFT_CARD_VENDORS[formData.vendor]?.rate.toLocaleString()}/$`, bold: true },
                        { label: 'Total Cost', value: `₦${buyCalculation.ngnValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, highlight: true, bold: true }
                    ]}/>
                )}
            </>
        )
    }

    if (giftCardAction === 'sell') {
        return (
            <>
                {commonFields}
                 <div className="mb-4">
                    <label htmlFor="giftCardCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gift Card Code</label>
                    <input type="text" name="giftCardCode" id="giftCardCode" required onChange={handleChange} value={formData.giftCardCode || ''} placeholder="Enter the gift card code" className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"/>
                </div>
                {sellCalculation.payout > 0 && (
                    <CalculationDisplay title="Payout Summary" lines={[
                        { label: 'Rate', value: `₦${GIFT_CARD_VENDORS[formData.vendor]?.rate.toLocaleString()}/$`, bold: true },
                        { label: 'Value', value: `₦${sellCalculation.ngnValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`, bold: true},
                        { label: `Commission (${J_PAY_COMMISSION_RATE * 100}%)`, value: `- ₦${sellCalculation.commission.toLocaleString(undefined, {minimumFractionDigits: 2})}`},
                        { label: 'You Get', value: `₦${sellCalculation.payout.toLocaleString(undefined, {minimumFractionDigits: 2})}`, highlight: true, bold: true }
                    ]} />
                )}
            </>
        )
    }

    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-green-900 rounded-2xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Payment' : step === 'preview' ? 'Confirm Transaction' : step === 'confirm_password' ? 'Authorize Transaction' : service.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        {isLoading && <div className="text-center p-8"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div> <p className="mt-4 text-gray-600 dark:text-gray-300">Processing...</p> </div>}

        {!isLoading && step === 'form' && (
          <form onSubmit={handleProceedFromForm}>
            {renderFormContent()}
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center my-2">{error}</p>}
            <button type="submit" className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200" disabled={service.id === 'giftCard' && !giftCardAction}>
              {isEditMode ? 'Review Changes' : (service.id === 'jpayTransfer' || service.id === 'bankTransfer') ? 'Verify Account' : 'Proceed'}
            </button>
          </form>
        )}

        {!isLoading && step === 'preview' && (
          <div>
            <div className="bg-gray-100 dark:bg-green-800 rounded-lg p-4 mb-4 space-y-2 text-sm">
                {(service.id === 'jpayTransfer' || service.id === 'bankTransfer') && recipientName && (
                     <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Recipient</span>
                        <span className="font-bold text-green-600 dark:text-green-400 text-right flex items-center justify-end">
                            {recipientName} 
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                        ₦{parseFloat(formData.amount || '0').toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Description</span>
                    <span className="font-bold text-gray-900 dark:text-white text-right max-w-[60%]">{transactionDescription}</span>
                </div>
            </div>
            
            <div className="my-4">
                <label htmlFor="userNote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add a Note (Optional)</label>
                <input
                    type="text" id="userNote" value={userNote} onChange={(e) => setUserNote(e.target.value)} placeholder="e.g., For monthly groceries"
                    className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
            </div>

            {service.id !== 'addFunds' && (
                <div className="my-4 p-3 bg-gray-100 dark:bg-green-800 rounded-lg">
                    <div className="flex items-center">
                        <input id="recurring" type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} disabled={isEditMode || (service.id === 'giftCard' && giftCardAction === 'sell')} className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 disabled:opacity-50"/>
                        <label htmlFor="recurring" className={`ml-2 block text-sm ${isEditMode || (service.id === 'giftCard' && giftCardAction === 'sell') ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {isEditMode ? 'This is a recurring payment' : 'Set as recurring payment'}
                        </label>
                    </div>
                    {isRecurring && (
                        <div className="mt-3">
                            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                            <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as RecurringPayment['frequency'])} className="w-full bg-white dark:bg-green-700 border-gray-300 dark:border-green-600 text-gray-900 dark:text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition">
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    )}
                </div>
            )}
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center my-2">{error}</p>}
            <button onClick={() => setStep('confirm_password')} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
              Continue
            </button>
             <button onClick={() => setStep('form')} className="w-full mt-2 bg-transparent text-gray-600 dark:text-gray-300 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-green-800 transition-colors duration-200">
              Back
            </button>
          </div>
        )}
        
        {!isLoading && step === 'confirm_password' && (
          <form onSubmit={handleFinalConfirm}>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Enter your password to authorize this transaction.</p>
            <div className="mb-4">
                 <label htmlFor="password" className="sr-only">Password</label>
                 <input
                    type="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="Enter your password" required
                    className="w-full bg-gray-100 dark:bg-green-800 border-gray-300 dark:border-green-700 text-gray-900 dark:text-white rounded-lg p-3 text-center focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                 />
            </div>
             {error && <p className="text-red-500 dark:text-red-400 text-sm text-center my-2">{error}</p>}
            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200">
              {isEditMode ? 'Update Payment' : 'Confirm Transaction'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default ServiceModal;