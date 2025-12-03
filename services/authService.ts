import { User, Transaction, SavingsGoal, RecurringPayment } from '../types';

// In-memory database and OTP store
const users = new Map<string, User>();
const otps = new Map<string, { otp: string; expires: number }>();

const BIOMETRIC_STORAGE_KEY = 'jpay_biometric_user';

// Mocking a password hash function
const hashPassword = (password: string) => `hashed_${password}`;
const verifyPassword = (password: string, hash: string) => hash === `hashed_${password}`;

// Initialize Mock Users for P2P Testing
const MOCK_USERS: User[] = [
  {
    id: 'user-destiny',
    name: 'Destiny Ogedengbe',
    phone: '08012345678',
    passwordHash: hashPassword('password'),
    isVerified: true,
    balance: 55000.00,
    transactions: [],
    savingsGoals: [],
    recurringPayments: [],
    accountNumber: '2024202424',
    profilePictureUrl: '',
    biometricsEnabled: false,
  },
  {
    id: 'user-sarah',
    name: 'Sarah Connor',
    phone: '08087654321',
    passwordHash: hashPassword('password'),
    isVerified: true,
    balance: 120000.50,
    transactions: [],
    savingsGoals: [],
    recurringPayments: [],
    accountNumber: '3030303030',
    profilePictureUrl: '',
    biometricsEnabled: false,
  }
];

MOCK_USERS.forEach(user => users.set(user.phone, user));

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'debit', description: 'DSTV Subscription', amount: 12500, date: new Date('2024-07-28').toISOString(), icon: 'tv', status: 'completed', reference: 'JPTXN-12345-001' },
  { id: '2', type: 'credit', description: 'Salary Deposit', amount: 250000.00, date: new Date('2024-07-25').toISOString(), icon: 'transfer', status: 'completed', reference: 'JPTXN-12345-002' },
  { id: '3', type: 'debit', description: 'Uber Ride', amount: 3500, date: new Date('2024-07-22').toISOString(), icon: 'transport', status: 'completed', reference: 'JPTXN-12345-003' },
  { id: '4', type: 'debit', description: 'Chicken Republic', amount: 4200, date: new Date('2024-07-21').toISOString(), icon: 'food', status: 'completed', reference: 'JPTXN-12345-004' },

];

const DEFAULT_SAVINGS_GOALS: SavingsGoal[] = [
    { id: 'goal-1', name: 'New Phone', targetAmount: 450000, currentAmount: 120000 }
];

const generateOtp = () => '123456'; // For simulation purposes

// Mock recipient names for account verification
const MOCK_NAMES = ['Adekunle Adebayo', 'Chiamaka Nwosu', 'Musa Ibrahim', 'Fatima Bello'];

class AuthService {
  
  // Sign up a new user
  async signUp(name: string, phone: string, password: string): Promise<{ success: boolean; message: string; otp?: string }> {
    if (users.has(phone)) {
      return { success: false, message: 'User with this phone number already exists.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      phone,
      passwordHash: hashPassword(password),
      isVerified: false,
      balance: 12540.75, // Starting balance
      transactions: [...DEFAULT_TRANSACTIONS],
      savingsGoals: [...DEFAULT_SAVINGS_GOALS],
      recurringPayments: [], // Initialize recurring payments
      profilePictureUrl: '', // Initialize profile picture
      accountNumber: Math.random().toString().slice(2, 12), // Generate a random 10-digit account number
      biometricsEnabled: false,
    };
    users.set(phone, newUser);
    
    // Send OTP
    const otp = generateOtp();
    otps.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 minute expiry
    
    console.log(`[AuthService] OTP for ${phone}: ${otp}`); // Log OTP for simulation
    return { success: true, message: 'Sign up successful. Please verify your account.', otp };
  }
  
  // Verify user's phone with OTP
  async verifyAccount(phone: string, otp: string): Promise<{ success: boolean; message: string; user?: User }> {
    const storedOtp = otps.get(phone);
    const user = users.get(phone);

    if (!user || !storedOtp || storedOtp.otp !== otp || storedOtp.expires < Date.now()) {
      return { success: false, message: 'Invalid or expired OTP.' };
    }
    
    user.isVerified = true;
    users.set(phone, user);
    otps.delete(phone); // OTP is used
    
    return { success: true, message: 'Account verified successfully.', user };
  }
  
  // Log in a user
  async login(phone: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    const user = users.get(phone);
    if (!user) {
      return { success: false, message: 'User not found.' };
    }
    if (!user.isVerified) {
        return { success: false, message: 'Account not verified. Please check for a verification code.' };
    }
    if (!verifyPassword(password, user.passwordHash)) {
      return { success: false, message: 'Incorrect password.' };
    }
    
    // If biometrics are enabled, store user for next time
    if(user.biometricsEnabled) {
        localStorage.setItem(BIOMETRIC_STORAGE_KEY, user.phone);
    }

    return { success: true, message: 'Login successful.', user };
  }

  async loginWithBiometrics(): Promise<{ success: boolean; message: string; user?: User }> {
    const phone = localStorage.getItem(BIOMETRIC_STORAGE_KEY);
    if (!phone) {
        return { success: false, message: "No biometric user found. Please log in with your password first." };
    }
    const user = users.get(phone);
     if (!user) {
      return { success: false, message: 'User not found.' };
    }
    // Simulate successful biometric scan
    await new Promise(res => setTimeout(res, 500));
    return { success: true, message: 'Biometric login successful.', user };
  }

  // Request a password reset OTP
  async requestPasswordReset(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
      if (!users.has(phone)) {
          return { success: false, message: 'No account found with this phone number.' };
      }
      const otp = generateOtp();
      otps.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });
      console.log(`[AuthService] Password Reset OTP for ${phone}: ${otp}`);
      return { success: true, message: 'Password reset OTP sent.', otp };
  }

  // Reset password with OTP
  async resetPassword(phone: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> {
      const storedOtp = otps.get(phone);
      const user = users.get(phone);
      if (!user || !storedOtp || storedOtp.otp !== otp || storedOtp.expires < Date.now()) {
          return { success: false, message: 'Invalid or expired OTP.' };
      }
      user.passwordHash = hashPassword(newPassword);
      users.set(phone, user);
      otps.delete(phone);
      return { success: true, message: 'Password has been reset successfully.' };
  }

  // Update user data (for transactions, savings, etc.)
  async updateUser(user: User): Promise<void> {
    if (users.has(user.phone)) {
      users.set(user.phone, user);
      // Update local storage if biometrics settings change
      if (user.biometricsEnabled) {
          localStorage.setItem(BIOMETRIC_STORAGE_KEY, user.phone);
      } else {
          // If the currently stored user is this one, remove them
          if (localStorage.getItem(BIOMETRIC_STORAGE_KEY) === user.phone) {
              localStorage.removeItem(BIOMETRIC_STORAGE_KEY);
          }
      }
    }
  }

  async logout(): Promise<void> {
    // We don't remove the biometric user on logout
    // so they can use it next time they open the app.
    // In a real app with secure keychain storage, this would be handled differently.
  }

  // --- NEW METHODS FOR SECURE TRANSACTIONS ---

  /**
   * Simulates verifying a bank account number.
   * @returns A promise that resolves with the recipient's name or an error message.
   */
  async verifyAccountNumber(accountNumber: string, bankName: string): Promise<{ success: boolean; name?: string; message?: string }> {
    console.log(`Verifying account ${accountNumber} at ${bankName}...`);
    await new Promise(res => setTimeout(res, 1000)); // Simulate network delay

    if (bankName === 'jpay') {
        for (const user of users.values()) {
            if (user.accountNumber === accountNumber) {
                return { success: true, name: user.name };
            }
        }
        return { success: false, message: 'J pay user not found.' };
    }

    if (accountNumber.length !== 10) {
      return { success: false, message: 'Invalid account number format.' };
    }

    // Simulate success for external banks
    const randomIndex = Math.floor(Math.random() * MOCK_NAMES.length);
    const recipientName = MOCK_NAMES[randomIndex];
    return { success: true, name: recipientName };
  }

  /**
   * Verifies the current user's password.
   * @returns A promise that resolves to true if the password is correct, false otherwise.
   */
  async verifyCurrentUserPassword(phone: string, password: string): Promise<boolean> {
    const user = users.get(phone);
    if (!user) {
      return false;
    }
    return verifyPassword(password, user.passwordHash);
  }

  async performP2PTransfer(senderPhone: string, recipientAccountNumber: string, amount: number, description: string): Promise<{ success: boolean; updatedSender?: User; message?: string }> {
    const sender = users.get(senderPhone);
     if (!sender) {
        return { success: false, message: 'Sender not found.' };
    }
    if (sender.balance < amount) {
        return { success: false, message: 'Insufficient funds.' };
    }

    let recipient: User | null = null;
    for (const user of users.values()) {
        if (user.accountNumber === recipientAccountNumber) {
            recipient = user;
            break;
        }
    }

    if (!recipient) {
        return { success: false, message: 'Recipient not found.' };
    }
    
    if (sender.phone === recipient.phone) {
        return { success: false, message: "You cannot transfer to yourself." };
    }

    // Update Sender State (Immutable)
    const senderTransaction: Transaction = {
        id: `tx-${Date.now()}-d`,
        type: 'debit',
        description: `Transfer to ${recipient.name}. ${description}`,
        amount,
        date: new Date().toISOString(),
        icon: 'jpayTransfer',
        status: 'completed',
        reference: `JPTXN-${Date.now()}-S`
    };
    
    const updatedSender: User = {
        ...sender,
        balance: sender.balance - amount,
        transactions: [senderTransaction, ...sender.transactions]
    };

    // Update Recipient State (Immutable)
    const recipientTransaction: Transaction = {
        id: `tx-${Date.now()}-c`,
        type: 'credit',
        description: `Transfer from ${sender.name}. ${description}`,
        amount,
        date: new Date().toISOString(),
        icon: 'jpayTransfer',
        status: 'completed',
        reference: `JPTXN-${Date.now()}-R`
    };

    const updatedRecipient: User = {
        ...recipient,
        balance: recipient.balance + amount,
        transactions: [recipientTransaction, ...recipient.transactions]
    };

    // Persist updates to mock DB
    users.set(sender.phone, updatedSender);
    users.set(recipient.phone, updatedRecipient);

    // Return a new object reference for React state updates
    return { success: true, updatedSender };
  }
}

export const authService = new AuthService();