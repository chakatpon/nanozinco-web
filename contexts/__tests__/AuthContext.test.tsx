/**
 * Unit Tests for AuthContext
 * Following TDD methodology - testing authentication state management
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { User } from '@/types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext - TDD Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should start with unauthenticated state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('should restore authenticated state from localStorage', async () => {
      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('zinco_auth', 'true');
      localStorage.setItem('zinco_user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });
  });

  describe('Login Functionality', () => {
    it('should successfully log in a user', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      act(() => {
        result.current.login(mockUser);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(localStorage.getItem('zinco_auth')).toBe('true');
      expect(localStorage.getItem('zinco_user')).toBe(JSON.stringify(mockUser));
    });

    it('should save last user info on login', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        profilePicture: 'https://example.com/avatar.jpg',
        createdAt: new Date().toISOString(),
      };

      act(() => {
        result.current.login(mockUser);
      });

      expect(result.current.lastUser).toEqual({
        phone: '66812345678',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
      });
    });
  });

  describe('Logout Functionality', () => {
    it('should successfully log out a user', async () => {
      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('zinco_auth', 'true');
      localStorage.setItem('zinco_user', JSON.stringify(mockUser));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(localStorage.getItem('zinco_auth')).toBeNull();
      expect(localStorage.getItem('zinco_user')).toBeNull();
    });

    it('should keep last user info after logout', async () => {
      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser);
      });

      const lastUserBeforeLogout = result.current.lastUser;

      act(() => {
        result.current.logout();
      });

      expect(result.current.lastUser).toEqual(lastUserBeforeLogout);
    });
  });

  describe('PIN Management', () => {
    it('should save PIN for a phone number', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.savePin('66812345678', '123456');
      });

      expect(result.current.hasStoredPin('66812345678')).toBe(true);
    });

    it('should verify correct PIN', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.savePin('66812345678', '123456');
      });

      const isValid = result.current.verifyPin('66812345678', '123456');
      expect(isValid).toBe(true);
    });

    it('should reject incorrect PIN', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.savePin('66812345678', '123456');
      });

      const isValid = result.current.verifyPin('66812345678', '999999');
      expect(isValid).toBe(false);
    });

    it('should update existing PIN for same phone number', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.savePin('66812345678', '123456');
      });

      act(() => {
        result.current.savePin('66812345678', '654321');
      });

      const isOldValid = result.current.verifyPin('66812345678', '123456');
      const isNewValid = result.current.verifyPin('66812345678', '654321');

      expect(isOldValid).toBe(false);
      expect(isNewValid).toBe(true);
    });

    it('should store multiple PINs for different phone numbers', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.savePin('66812345678', '123456');
        result.current.savePin('66887654321', '654321');
      });

      expect(result.current.hasStoredPin('66812345678')).toBe(true);
      expect(result.current.hasStoredPin('66887654321')).toBe(true);
      expect(result.current.verifyPin('66812345678', '123456')).toBe(true);
      expect(result.current.verifyPin('66887654321', '654321')).toBe(true);
    });

    it('should persist PINs in localStorage', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.savePin('66812345678', '123456');
      });

      const storedPins = localStorage.getItem('zinco_user_pins');
      expect(storedPins).toBeTruthy();
      const parsed = JSON.parse(storedPins!);
      expect(parsed).toEqual([{ phone: '66812345678', pin: '123456' }]);
    });
  });

  describe('Profile Update', () => {
    it('should update user profile', async () => {
      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser);
      });

      act(() => {
        result.current.updateProfile({
          name: 'Updated Name',
          email: 'updated@example.com',
        });
      });

      expect(result.current.user?.name).toBe('Updated Name');
      expect(result.current.user?.email).toBe('updated@example.com');
      expect(result.current.user?.phone).toBe('66812345678'); // Should keep unchanged fields
    });

    it('should not update if user is not logged in', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.updateProfile({ name: 'New Name' });
      });

      expect(result.current.user).toBeNull();
    });
  });

  describe('Clear Last User', () => {
    it('should clear last user info', async () => {
      const mockUser: User = {
        id: 'test-id-123',
        phone: '66812345678',
        name: 'Test User',
        createdAt: new Date().toISOString(),
      };

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.login(mockUser);
      });

      expect(result.current.lastUser).toBeTruthy();

      act(() => {
        result.current.clearLastUser();
      });

      expect(result.current.lastUser).toBeNull();
      expect(localStorage.getItem('zinco_last_user')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem('zinco_auth', 'true');
      localStorage.setItem('zinco_user', 'invalid-json');

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Should not crash and return safe defaults
      expect(result.current.user).toBeNull();
    });

    it('should return null for non-existent PIN', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const pin = result.current.getPinForPhone('66999999999');
      expect(pin).toBeNull();
    });

    it('should return false when checking PIN for non-existent phone', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const hasPin = result.current.hasStoredPin('66999999999');
      expect(hasPin).toBe(false);
    });
  });
});
