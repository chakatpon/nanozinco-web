const OTP_API_BASE_URL = process.env.NEXT_PUBLIC_OTP_API_URL || 'https://apicall.deesmsx.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_OTP_API_KEY || '';
const SECRET_KEY = process.env.NEXT_PUBLIC_OTP_SECRET_KEY || '';
const SENDER_NAME = process.env.NEXT_PUBLIC_OTP_SENDER_NAME || 'NANO-ZINCO';

/**
 * Format phone number to international format
 * Converts Thai phone number (0XXXXXXXXX) to international format (66XXXXXXXXX)
 */
const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) {
    throw new Error('Phone number is required');
  }
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, remove it and add 66 (Thailand country code)
  if (cleaned.startsWith('0')) {
    cleaned = '66' + cleaned.substring(1);
  }
  // If doesn't start with 66, add it
  else if (!cleaned.startsWith('66')) {
    cleaned = '66' + cleaned;
  }
  
  return cleaned;
};

interface SendSMSRequest {
  to: string;
  msg: string;
  sender?: string;
}

interface SendSMSResponse {
  status: string;
  message?: string;
  detail?: string;
}

interface RequestOTPRequest {
  to: string;
  lang?: 'th' | 'en';
  isShowRef?: '0' | '1';
  sender?: string;
}

interface RequestOTPResponse {
  status: string;
  token?: string;
  ref?: string;
  ref_code?: string;
  message?: string;
  msg?: string;
  detail?: string;
  code?: string;
}

interface VerifyOTPRequest {
  token: string;
  pin: string;
}

interface VerifyOTPResponse {
  status: string;
  message?: string;
  msg?: string;
  detail?: string;
  code?: string;
}

/**
 * Send SMS message
 */
export const sendSMS = async (request: SendSMSRequest): Promise<SendSMSResponse> => {
  try {
    const formattedPhone = formatPhoneNumber(request.to);
    
    const response = await fetch(`${OTP_API_BASE_URL}/SMSWebService`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secretKey: SECRET_KEY,
        apiKey: API_KEY,
        to: formattedPhone,
        sender: request.sender || SENDER_NAME,
        msg: request.msg,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Send SMS error:', error);
    throw new Error('Failed to send SMS');
  }
};

/**
 * Request OTP code
 */
export const requestOTP = async (phoneNumberOrRequest: string | RequestOTPRequest): Promise<RequestOTPResponse> => {
  try {
    // Handle both string and object inputs
    const request: RequestOTPRequest = typeof phoneNumberOrRequest === 'string' 
      ? { to: phoneNumberOrRequest }
      : phoneNumberOrRequest;
    
    const formattedPhone = formatPhoneNumber(request.to);
    
    console.log('=== Request OTP Payload ===');
    const payload = {
      secretKey: SECRET_KEY,
      apiKey: API_KEY,
      to: formattedPhone,
      sender: request.sender || SENDER_NAME,
      lang: request.lang || 'th',
      isShowRef: request.isShowRef || '1',
    };
    console.log(JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${OTP_API_BASE_URL}/otp/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('=== Request OTP Response ===');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    // Check for success status - DeeSMS returns code: "0" for success
    if (data.status === 'success' || data.status === '200' || data.code === '200' || data.code === '0') {
      // Extract token and ref from nested result object if present
      const token = data.result?.token || data.token;
      const ref = data.result?.ref || data.ref || data.ref_code;
      
      return {
        status: data.status,
        token: token,
        ref: ref,
        message: data.msg || data.message,
        code: data.code,
      };
    } else {
      const errorMsg = data.msg || data.message || `API Error: ${data.status || data.code}`;
      console.log('Request OTP failed:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Request OTP error:', error);
    throw error;
  }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (
  phoneNumberOrRequest: string | VerifyOTPRequest,
  otpCode?: string,
  tokenValue?: string
): Promise<VerifyOTPResponse> => {
  try {
    // Handle both object and individual parameters
    let request: VerifyOTPRequest;
    
    if (typeof phoneNumberOrRequest === 'string') {
      // Called with (phoneNumber, otpCode, token)
      if (!otpCode || !tokenValue) {
        throw new Error('OTP code and token are required');
      }
      request = {
        token: tokenValue,
        pin: otpCode,
      };
    } else {
      // Called with request object
      request = phoneNumberOrRequest;
    }
    
    console.log('=== Verify OTP Payload ===');
    const payload = {
      secretKey: SECRET_KEY,
      apiKey: API_KEY,
      token: request.token,
      pin: request.pin,
    };
    console.log(JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${OTP_API_BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('=== Verify OTP Response ===');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(data, null, 2));
    
    // Check for success - DeeSMS returns code: "0" for success
    if (data.status === 'success' || data.status === '200' || data.code === '200' || data.code === '0' || data.code === 0) {
      return {
        status: data.status,
        message: data.msg || data.message,
        code: data.code,
      };
    } else {
      const errorMsg = data.msg || data.message || 'Invalid OTP code';
      console.log('Verify OTP failed:', errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
};
