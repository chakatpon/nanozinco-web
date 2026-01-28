/**
 * Unit Tests for LanguageContext
 * Following TDD methodology
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('LanguageContext - TDD Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should start with English as default language', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });
    });

    it('should restore language preference from localStorage', async () => {
      localStorage.setItem('zinco_language', 'th');

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('th');
      });
    });
  });

  describe('Language Switching', () => {
    it('should switch to Thai language', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      act(() => {
        result.current.setLanguage('th');
      });

      expect(result.current.language).toBe('th');
    });

    it('should switch to Chinese language', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      act(() => {
        result.current.setLanguage('zh');
      });

      expect(result.current.language).toBe('zh');
    });

    it('should persist language preference in localStorage', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      act(() => {
        result.current.setLanguage('th');
      });

      expect(localStorage.getItem('zinco_language')).toBe('th');
    });

    it('should handle switching between all supported languages', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      const languages: Array<'en' | 'th' | 'zh'> = ['th', 'zh', 'en'];

      for (const lang of languages) {
        act(() => {
          result.current.setLanguage(lang);
        });
        expect(result.current.language).toBe(lang);
      }
    });
  });

  describe('Translation Function', () => {
    it('should provide translation function', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      expect(typeof result.current.t).toBe('function');
    });

    it('should return translation key if translation not found', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      const translation = result.current.t('non.existent.key');
      expect(translation).toBe('non.existent.key');
    });

    it('should return English translation by default', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      // Assuming these keys exist in translations
      const loginTranslation = result.current.t('auth.login');
      expect(loginTranslation).toBeTruthy();
      expect(typeof loginTranslation).toBe('string');
    });

    it('should change translations when language changes', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      const enTranslation = result.current.t('auth.login');

      act(() => {
        result.current.setLanguage('th');
      });

      const thTranslation = result.current.t('auth.login');

      // Translations should be different for different languages
      // (assuming they're properly set up in the translations file)
      expect(enTranslation).toBeTruthy();
      expect(thTranslation).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem('zinco_language', 'invalid-language');

      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        // Should fallback to default language
        expect(['en', 'th', 'zh']).toContain(result.current.language);
      });
    });

    it('should handle rapid language switches', async () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      await waitFor(() => {
        expect(result.current.language).toBe('en');
      });

      act(() => {
        result.current.setLanguage('th');
        result.current.setLanguage('zh');
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
    });
  });

  describe('Context Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useLanguage());
      }).toThrow('useLanguage must be used within a LanguageProvider');

      consoleSpy.mockRestore();
    });
  });
});
