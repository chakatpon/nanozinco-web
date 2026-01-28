/**
 * Unit Tests for CartContext
 * Following TDD methodology
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { Product } from '@/types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  image: '/test.jpg',
  imageUrl: '/test.jpg',
  category: 'test',
  stock: 10,
};

const mockProduct2: Product = {
  id: '2',
  name: 'Test Product 2',
  description: 'Test Description 2',
  price: 200,
  image: '/test2.jpg',
  imageUrl: '/test2.jpg',
  category: 'test',
  stock: 5,
};

describe('CartContext - TDD Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initial State', () => {
    it('should start with empty cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });
    });

    it('should start with zero total items', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.getTotalItems()).toBe(0);
      });
    });

    it('should start with zero total price', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.getTotalPrice()).toBe(0);
      });
    });

    it('should restore cart from localStorage', async () => {
      const savedCart = [
        { product: mockProduct, quantity: 2 },
      ];
      localStorage.setItem('zinco_cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual(savedCart);
        expect(result.current.getTotalItems()).toBe(2);
      });
    });
  });

  describe('Add to Cart', () => {
    it('should add product to empty cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product).toEqual(mockProduct);
      expect(result.current.items[0].quantity).toBe(1);
    });

    it('should increase quantity if product already in cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it('should add multiple different products', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.items).toHaveLength(2);
      expect(result.current.getTotalItems()).toBe(2);
    });

    it('should add product with specified quantity', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct, 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.getTotalItems()).toBe(5);
    });

    it('should persist cart in localStorage after adding', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      const stored = localStorage.getItem('zinco_cart');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].product.id).toBe(mockProduct.id);
    });
  });

  describe('Remove from Cart', () => {
    it('should remove product from cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      expect(result.current.items).toHaveLength(1);

      act(() => {
        result.current.removeFromCart(mockProduct.id);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should not affect other products when removing one', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      act(() => {
        result.current.removeFromCart(mockProduct.id);
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].product.id).toBe(mockProduct2.id);
    });

    it('should handle removing non-existent product gracefully', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.removeFromCart('non-existent-id');
      });

      expect(result.current.items).toHaveLength(1);
    });
  });

  describe('Update Quantity', () => {
    it('should update product quantity', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5);
      });

      expect(result.current.items[0].quantity).toBe(5);
      expect(result.current.getTotalItems()).toBe(5);
    });

    it('should remove item if quantity is set to 0', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, 0);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('should handle negative quantity by removing item', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.updateQuantity(mockProduct.id, -1);
      });

      expect(result.current.items).toHaveLength(0);
    });
  });

  describe('Clear Cart', () => {
    it('should clear all items from cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
        result.current.addToCart(mockProduct2);
      });

      expect(result.current.items).toHaveLength(2);

      act(() => {
        result.current.clearCart();
      });

      expect(result.current.items).toHaveLength(0);
      expect(result.current.getTotalItems()).toBe(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('should clear cart from localStorage', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct);
      });

      act(() => {
        result.current.clearCart();
      });

      const stored = localStorage.getItem('zinco_cart');
      expect(stored).toBe('[]');
    });
  });

  describe('Cart Calculations', () => {
    it('should calculate correct total items', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct, 3);
        result.current.addToCart(mockProduct2, 2);
      });

      expect(result.current.getTotalItems()).toBe(5);
    });

    it('should calculate correct total price', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct, 2); // 100 * 2 = 200
        result.current.addToCart(mockProduct2, 3); // 200 * 3 = 600
      });

      expect(result.current.getTotalPrice()).toBe(800);
    });

    it('should recalculate totals after quantity update', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct, 2);
      });

      expect(result.current.getTotalPrice()).toBe(200);

      act(() => {
        result.current.updateQuantity(mockProduct.id, 5);
      });

      expect(result.current.getTotalPrice()).toBe(500);
    });
  });

  describe('Get Item Count', () => {
    it('should return 0 for product not in cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      const item = result.current.items.find(i => i.product.id === mockProduct.id);
      expect(item?.quantity || 0).toBe(0);
    });

    it('should return correct count for product in cart', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        result.current.addToCart(mockProduct, 7);
      });

      const item = result.current.items.find(i => i.product.id === mockProduct.id);
      expect(item?.quantity || 0).toBe(7);
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data', async () => {
      localStorage.setItem('zinco_cart', 'invalid-json');

      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });
    });

    it('should handle adding same product rapidly', async () => {
      const { result } = renderHook(() => useCart(), { wrapper });

      await waitFor(() => {
        expect(result.current.items).toEqual([]);
      });

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addToCart(mockProduct);
        }
      });

      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(10);
    });
  });
});
