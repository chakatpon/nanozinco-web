'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOTP, requestOTP } from '@/services/otpService';
import { User } from '@/types';
import { generateUUID } from '@/utils/uuid';

export default function OTPPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login, hasStoredPin } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [token, setToken] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const phone = sessionStorage.getItem('otp_phone');
    const otpToken = sessionStorage.getItem('otp_token');
    
    if (!phone || !otpToken) {
      router.push('/login');
      return;
    }
    
    setPhoneNumber(phone);
    setToken(otpToken);

    // Start countdown
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6);
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (index + i < 6 && /^\d$/.test(char)) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      
      const nextIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (index === 5 && value && newOtp.every(digit => digit)) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyOTP(phoneNumber, code, token);
      
      console.log('OTP Verification Result:', result);

      // Check if verification was successful (code "0" means success)
      if (result.code === '0' || result.status === '200' || result.status === 'success') {
        // Create user object
        const user: User = {
          id: generateUUID(),
          phone: phoneNumber,
          name: `User ${phoneNumber.slice(-4)}`,
          createdAt: new Date().toISOString(),
        };

        login(user);
        
        // Check if user has PIN
        if (hasStoredPin(phoneNumber)) {
          router.push('/enter-pin');
        } else {
          router.push('/set-pin');
        }
      } else {
        setError(result.message || 'Invalid OTP code');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const result = await requestOTP(phoneNumber);
      
      if (result.status === 'success' || result.status === '200' || result.code === '0') {
        setToken(result.token || '');
        sessionStorage.setItem('otp_token', result.token || '');
        setCanResend(false);
        setResendCountdown(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();

        // Restart countdown
        const timer = setInterval(() => {
          setResendCountdown((prev) => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.message || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/login')}
          className="mb-6 text-indigo-600 hover:text-indigo-700 flex items-center gap-2 font-medium"
        >
          ← {t('common.back') || 'Back'}
        </button>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-3xl">📱</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('otp.title')}</h1>
          <p className="text-gray-600">
            {t('otp.enter_code')} <br />
            <span className="font-semibold">{phoneNumber}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || otp.some(digit => !digit)}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.loading')}
            </span>
          ) : (
            t('otp.verify')
          )}
        </button>

        {/* Resend Button */}
        <button
          onClick={handleResend}
          disabled={!canResend || loading}
          className="w-full py-2 text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {canResend ? t('otp.resend') : `${t('otp.resend')} (${resendCountdown}s)`}
        </button>
      </div>
    </div>
  );
}
