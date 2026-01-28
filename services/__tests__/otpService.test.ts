/**
 * Unit Tests for OTP Service
 * Following TDD methodology - tests define expected behavior
 */

import { formatPhoneNumber, requestOTP, verifyOTP } from '../otpService';

// Set test environment variables
process.env.NEXT_PUBLIC_OTP_API_URL = 'https://test-api.com';
process.env.NEXT_PUBLIC_OTP_API_KEY = 'test-key';
process.env.NEXT_PUBLIC_OTP_SECRET_KEY = 'test-secret';
process.env.NEXT_PUBLIC_OTP_SENDER_NAME = 'TEST';

// Mock fetch API
global.fetch = jest.fn();

describe('OTP Service - TDD Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe('formatPhoneNumber', () => {
    it('should convert Thai mobile number starting with 0 to 66 format', () => {
      const result = formatPhoneNumber('0812345678');
      expect(result).toBe('66812345678');
    });

    it('should keep number already in 66 format', () => {
      const result = formatPhoneNumber('66812345678');
      expect(result).toBe('66812345678');
    });

    it('should throw error for empty phone number', () => {
      expect(() => formatPhoneNumber('')).toThrow('Phone number is required');
    });

    it('should throw error for undefined phone number', () => {
      expect(() => formatPhoneNumber(undefined as any)).toThrow('Phone number is required');
    });

    it('should throw error for null phone number', () => {
      expect(() => formatPhoneNumber(null as any)).toThrow('Phone number is required');
    });

    it('should throw error for invalid phone format (too short)', () => {
      expect(() => formatPhoneNumber('081234')).toThrow('Invalid phone number format');
    });

    it('should throw error for invalid phone format (contains letters)', () => {
      expect(() => formatPhoneNumber('08123abc78')).toThrow('Invalid phone number format');
    });

    it('should handle phone number with spaces', () => {
      const result = formatPhoneNumber('0812345678'.replace(/\s/g, ''));
      expect(result).toBe('66812345678');
    });
  });

  describe('requestOTP - TDD Approach', () => {
    const mockSuccessResponse = {
      code: '0',
      result: {
        token: 'test-token-123',
        ref: 'ABC123',
      },
      message: 'OTP sent successfully',
    };

    it('should successfully request OTP with phone number string', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await requestOTP('0812345678');

      expect(result).toEqual({
        status: 'success',
        token: 'test-token-123',
        ref: 'ABC123',
        code: '0',
        message: 'OTP sent successfully',
      });
    });

    it('should successfully request OTP with request object', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      const result = await requestOTP({ to: '0812345678' });

      expect(result).toEqual({
        status: 'success',
        token: 'test-token-123',
        ref: 'ABC123',
        code: '0',
        message: 'OTP sent successfully',
      });
    });

    it('should handle API error response with code !== 0', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: '1',
          message: 'Invalid phone number',
        }),
      });

      const result = await requestOTP('0812345678');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid phone number');
    });

    it('should handle network failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(requestOTP('0812345678')).rejects.toThrow('Network error');
    });

    it('should format phone number before sending request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      await requestOTP('0812345678');

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.phoneNumber).toBe('66812345678');
    });

    it('should include API credentials in request', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSuccessResponse,
      });

      await requestOTP('0812345678');

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody).toHaveProperty('apiKey');
      expect(requestBody).toHaveProperty('secretKey');
    });
  });

  describe('verifyOTP - TDD Approach', () => {
    const mockVerifySuccessResponse = {
      code: '0',
      message: 'OTP verified successfully',
      status: 'success',
    };

    it('should successfully verify OTP with separate parameters', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVerifySuccessResponse,
      });

      const result = await verifyOTP('0812345678', '123456', 'test-token');

      expect(result).toEqual({
        status: 'success',
        code: '0',
        message: 'OTP verified successfully',
      });
    });

    it('should successfully verify OTP with request object', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVerifySuccessResponse,
      });

      const result = await verifyOTP('0812345678', '123456', 'test-token');

      expect(result).toEqual({
        status: 'success',
        code: '0',
        message: 'OTP verified successfully',
      });
    });

    it('should handle invalid OTP code', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: '1',
          message: 'Invalid OTP code',
          status: 'error',
        }),
      });

      const result = await verifyOTP('0812345678', '999999', 'test-token');

      expect(result.status).toBe('error');
      expect(result.message).toBe('Invalid OTP code');
    });

    it('should handle expired OTP token', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: '2',
          message: 'OTP token expired',
          status: 'error',
        }),
      });

      const result = await verifyOTP('0812345678', '123456', 'expired-token');

      expect(result.status).toBe('error');
      expect(result.message).toBe('OTP token expired');
    });

    it('should format phone number before verification', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockVerifySuccessResponse,
      });

      await verifyOTP('0812345678', '123456', 'test-token');

      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      expect(requestBody.phoneNumber).toBe('66812345678');
    });

    it('should throw error when required fields are missing', async () => {
      await expect(verifyOTP('', '123456', 'test-token')).rejects.toThrow();
    });
  });
});
