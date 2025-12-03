import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { ICONS } from '../constants';

const PasswordInput = ({ name, placeholder, isVisible, onToggle, value, onChange }: any) => {
    const EyeIcon = ICONS['eye'];
    const EyeSlashIcon = ICONS['eyeSlash'];
    return (
        <div className="relative">
            <input
                name={name}
                type={isVisible ? "text" : "password"}
                placeholder={placeholder}
                required
                className="auth-input pr-10"
                value={value}
                onChange={onChange}
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
                {isVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
        </div>
    )
}

enum AuthView {
  LOGIN,
  SIGNUP,
  OTP_VERIFICATION,
  FORGOT_PASSWORD,
  RESET_PASSWORD
}

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [authView, setAuthView] = useState<AuthView>(AuthView.LOGIN);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  
  const [formValues, setFormValues] = useState({
      name: '',
      phone: '',
      password: '',
      confirmPassword: '',
      otp: '',
  });

  // Store phone number between steps
  const [phoneForVerification, setPhoneForVerification] = useState('');

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    // Check if a biometric user is available on load
    const checkBiometrics = async () => {
        const res = await authService.loginWithBiometrics();
        if (res.user) {
            setShowBiometric(true);
        }
    };
    checkBiometrics();
  }, [])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
          ...formValues,
          [e.target.name]: e.target.value
      })
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { phone, password } = formValues;

    const res = await authService.login(phone, password);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };
  
  const handleBiometricLogin = async () => {
    setError('');
    setIsLoading(true);
    const res = await authService.loginWithBiometrics();
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const { name, phone, password, confirmPassword } = formValues;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    const res = await authService.signUp(name, phone, password);
    if (res.success) {
      setPhoneForVerification(phone);
      setMessage(`For demo purposes, your OTP is: ${res.otp}`);
      setAuthView(AuthView.OTP_VERIFICATION);
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };
  
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      const { otp } = formValues;
      
      const res = await authService.verifyAccount(phoneForVerification, otp);
      if (res.success && res.user) {
          onLoginSuccess(res.user);
      } else {
          setError(res.message);
      }
      setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    const { phone } = formValues;
    
    const res = await authService.requestPasswordReset(phone);
    if (res.success) {
        setMessage(`For demo purposes, your reset OTP is: ${res.otp}`);
        setPhoneForVerification(phone);
        setAuthView(AuthView.RESET_PASSWORD);
    } else {
        setError(res.message);
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    const { otp, password, confirmPassword } = formValues;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const res = await authService.resetPassword(phoneForVerification, otp, password);
    if (res.success) {
        setMessage(res.message + ' Please log in.');
        setFormValues({ name: '', phone: phoneForVerification, password: '', confirmPassword: '', otp: '' });
        setAuthView(AuthView.LOGIN);
    } else {
        setError(res.message);
    }
    setIsLoading(false);
  }

  const renderView = () => {
    switch (authView) {
      case AuthView.SIGNUP:
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-white mb-6">Create Account</h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <input name="name" type="text" placeholder="Full Name" required className="auth-input" value={formValues.name} onChange={handleChange} />
              <input name="phone" type="tel" placeholder="Phone Number" required className="auth-input" value={formValues.phone} onChange={handleChange} />
              <PasswordInput name="password" placeholder="Password" isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} value={formValues.password} onChange={handleChange} />
              <PasswordInput name="confirmPassword" placeholder="Confirm Password" isVisible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} value={formValues.confirmPassword} onChange={handleChange} />
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
            <p className="text-center mt-4 text-gray-300">
              Already have an account? <button onClick={() => setAuthView(AuthView.LOGIN)} className="text-green-400 hover:underline">Log In</button>
            </p>
          </>
        );
      case AuthView.LOGIN:
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-white mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input name="phone" type="tel" placeholder="Phone Number" required className="auth-input" value={formValues.phone} onChange={handleChange} />
              <PasswordInput name="password" placeholder="Password" isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} value={formValues.password} onChange={handleChange} />
              <div className="text-right">
                <button type="button" onClick={() => setAuthView(AuthView.FORGOT_PASSWORD)} className="text-sm text-green-400 hover:underline">Forgot Password?</button>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" className="auth-button" disabled={isLoading}>
                {isLoading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
            
            {showBiometric && (
                 <button onClick={handleBiometricLogin} className="w-full mt-4 bg-white bg-opacity-10 hover:bg-opacity-20 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.858.571-4.182m5.607 9.608c-.55-.27-1.06-.59-1.535-.945m6.633-2.826c.232-.64.43-1.305.588-1.993" />
                    </svg>
                    <span>Log in with Biometrics</span>
                </button>
            )}

            <p className="text-center mt-6 text-gray-300">
              Don't have an account? <button onClick={() => setAuthView(AuthView.SIGNUP)} className="text-green-400 hover:underline">Sign Up</button>
            </p>
          </>
        );
      case AuthView.OTP_VERIFICATION:
        return (
          <>
             <h2 className="text-2xl font-bold text-center text-white mb-6">Verification</h2>
             <p className="text-center text-gray-300 mb-6">{message || 'Please enter the OTP sent to your phone.'}</p>
             <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input name="otp" type="text" placeholder="Enter OTP" required className="auth-input text-center tracking-widest text-xl" value={formValues.otp} onChange={handleChange} />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className="auth-button" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Account'}
                </button>
             </form>
             <button onClick={() => setAuthView(AuthView.SIGNUP)} className="w-full mt-4 text-gray-400 hover:text-white text-sm">Back to Sign Up</button>
          </>
        );
      case AuthView.FORGOT_PASSWORD:
        return (
            <>
                <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Password</h2>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                    <input name="phone" type="tel" placeholder="Phone Number" required className="auth-input" value={formValues.phone} onChange={handleChange} />
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Sending OTP...' : 'Send Reset OTP'}
                    </button>
                </form>
                 <button onClick={() => setAuthView(AuthView.LOGIN)} className="w-full mt-4 text-gray-400 hover:text-white text-sm">Back to Login</button>
            </>
        );
      case AuthView.RESET_PASSWORD:
        return (
            <>
                 <h2 className="text-2xl font-bold text-center text-white mb-6">New Password</h2>
                 <p className="text-center text-gray-300 mb-6">{message || 'Enter OTP and new password.'}</p>
                 <form onSubmit={handleResetPassword} className="space-y-4">
                    <input name="otp" type="text" placeholder="Enter OTP" required className="auth-input text-center tracking-widest" value={formValues.otp} onChange={handleChange} />
                    <PasswordInput name="password" placeholder="New Password" isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)} value={formValues.password} onChange={handleChange} />
                    <PasswordInput name="confirmPassword" placeholder="Confirm New Password" isVisible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} value={formValues.confirmPassword} onChange={handleChange} />
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button type="submit" className="auth-button" disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                 </form>
                 <button onClick={() => setAuthView(AuthView.LOGIN)} className="w-full mt-4 text-gray-400 hover:text-white text-sm">Back to Login</button>
            </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-black p-4">
        <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                   <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
            </div>
            {renderView()}
        </div>
        
        <style>{`
            .auth-input {
                width: 100%;
                background-color: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                transition: all 0.2s;
            }
            .auth-input:focus {
                outline: none;
                border-color: #22c55e; /* green-500 */
                box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
            }
             .auth-input::placeholder {
                color: rgba(255, 255, 255, 0.5);
            }
            .auth-button {
                width: 100%;
                background-color: #22c55e; /* green-500 */
                color: white;
                font-weight: bold;
                padding: 0.75rem;
                border-radius: 0.5rem;
                transition: background-color 0.2s;
            }
            .auth-button:hover {
                background-color: #16a34a; /* green-600 */
            }
             .auth-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        `}</style>
    </div>
  );
};

export default AuthPage;