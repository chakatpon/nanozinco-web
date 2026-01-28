'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { requestOTP } from '@/services/otpService';

export default function LoginPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await requestOTP(phoneNumber);
      
      console.log('OTP request result:', result);
      
      // Check if OTP was sent successfully
      if (result.token) {
        // Store phone number for OTP verification
        sessionStorage.setItem('otp_phone', phoneNumber);
        sessionStorage.setItem('otp_token', result.token);
        if (result.ref) {
          sessionStorage.setItem('otp_ref', result.ref);
        }
        router.push('/otp');
      } else {
        setError(result.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers
    const cleaned = value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Language Selector */}
        <div className="flex justify-end mb-6 gap-2">
          <button
            onClick={() => setLanguage('th')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              language === 'th'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ไทย
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              language === 'en'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              language === 'zh'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            中文
          </button>
        </div>

        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">NZ</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nano Zinco</h1>
          <p className="text-gray-600">{t('login.title')}</p>
        </div>

        {/* Phone Input */}
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            {t('login.phone')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500">🇹🇭 +66</span>
            </div>
            <input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="910792775"
              maxLength={10}
              className="w-full pl-24 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              disabled={loading}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          disabled={loading || !phoneNumber}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg"
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
            t('login.send_otp')
          )}
        </button>

        {/* Info */}
        <p className="mt-6 text-center text-sm text-gray-500">
          {language === 'th' && 'เราจะส่งรหัส OTP ไปยังหมายเลขโทรศัพท์ของคุณ'}
          {language === 'en' && 'We will send an OTP code to your phone number'}
          {language === 'zh' && '我们会向您的手机号码发送验证码'}
        </p>
      </div>
    </div>
  );
}
