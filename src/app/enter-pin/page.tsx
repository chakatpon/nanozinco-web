'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function EnterPinPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, verifyPin, lastUser } = useAuth();
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!user?.phone && !lastUser?.phone) {
      router.push('/login');
    }
  }, [user, lastUser, router]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (index === 5 && value && newPin.every(digit => digit)) {
      handleVerifyPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyPin = (pinCode: string) => {
    const phoneNumber = user?.phone || lastUser?.phone;
    
    if (!phoneNumber) {
      setError('Phone number not found');
      return;
    }

    const isValid = verifyPin(phoneNumber, pinCode);
    
    if (isValid) {
      router.push('/');
    } else {
      setAttempts((prev) => prev + 1);
      setError('Incorrect PIN. Please try again.');
      setPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      if (attempts >= 2) {
        // After 3 failed attempts, redirect to login
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    }
  };

  const displayName = user?.name || lastUser?.name || 'User';
  const displayImage = user?.profilePicture || lastUser?.image;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/login')}
          className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-2 font-medium"
        >
          ← {t('common.back') || 'Use different account'}
        </button>

        {/* User Info */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center overflow-hidden">
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-white">{displayName[0]?.toUpperCase()}</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('pin.enter_title')}</h1>
          <p className="text-gray-600">Welcome back, {displayName}!</p>
        </div>

        {/* PIN Input */}
        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {error}
            {attempts >= 2 && <span className="block mt-1">Too many attempts. Redirecting to login...</span>}
          </p>
        )}

        {/* Forgot PIN */}
        <button
          onClick={() => router.push('/login')}
          className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
        >
          Forgot PIN? Login with OTP
        </button>
      </div>
    </div>
  );
}
