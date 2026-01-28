'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SetPinPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { user, savePin } = useAuth();
  
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'set' | 'confirm'>('set');
  const [error, setError] = useState('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePinChange = (index: number, value: string, isConfirm: boolean = false) => {
    if (!/^\d*$/.test(value)) return;

    const currentPin = isConfirm ? [...confirmPin] : [...pin];
    currentPin[index] = value;
    
    if (isConfirm) {
      setConfirmPin(currentPin);
    } else {
      setPin(currentPin);
    }
    
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const refs = isConfirm ? confirmRefs : inputRefs;
      refs.current[index + 1]?.focus();
    }

    // Auto-proceed when all digits entered
    if (index === 5 && value && currentPin.every(digit => digit)) {
      if (!isConfirm && step === 'set') {
        setTimeout(() => {
          setStep('confirm');
          confirmRefs.current[0]?.focus();
        }, 100);
      } else if (isConfirm && step === 'confirm') {
        handleSavePin(currentPin.join(''));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>, isConfirm: boolean = false) => {
    const currentPin = isConfirm ? confirmPin : pin;
    const refs = isConfirm ? confirmRefs : inputRefs;
    
    if (e.key === 'Backspace' && !currentPin[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handleSavePin = (confirmedPin: string) => {
    const originalPin = pin.join('');
    
    if (originalPin !== confirmedPin) {
      setError('PINs do not match. Please try again.');
      setStep('set');
      setPin(['', '', '', '', '', '']);
      setConfirmPin(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
      return;
    }

    if (!user?.phone) {
      setError('User phone not found');
      return;
    }

    savePin(user.phone, originalPin);
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'set' ? t('pin.set_title') : 'Confirm PIN'}
          </h1>
          <p className="text-gray-600">
            {step === 'set' 
              ? 'Create a 6-digit PIN for quick login' 
              : 'Re-enter your PIN to confirm'}
          </p>
        </div>

        {/* PIN Input */}
        {step === 'set' ? (
          <div className="flex justify-center gap-3 mb-6">
            {pin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value, false)}
                onKeyDown={(e) => handleKeyDown(index, e, false)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                autoFocus={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center gap-3 mb-6">
            {confirmPin.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { confirmRefs.current[index] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value, true)}
                onKeyDown={(e) => handleKeyDown(index, e, true)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
                autoFocus={index === 0}
              />
            ))}
          </div>
        )}

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Back button for confirm step */}
        {step === 'confirm' && (
          <button
            onClick={() => {
              setStep('set');
              setConfirmPin(['', '', '', '', '', '']);
              setError('');
              setTimeout(() => inputRefs.current[0]?.focus(), 100);
            }}
            className="w-full py-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Change PIN
          </button>
        )}

        {/* Skip button */}
        <button
          onClick={() => router.push('/')}
          className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
