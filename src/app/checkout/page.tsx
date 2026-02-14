"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { checkoutCopy } from '@/constants/uiCopy';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const copy = checkoutCopy[language];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [payment, setPayment] = useState<'bank' | 'cod'>('cod');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem('post_auth_redirect', '/checkout');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{copy.loading}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-lg font-semibold text-gray-800">{copy.empty}</p>
        <button
          onClick={() => router.push('/products')}
          className="rounded-full bg-indigo-600 px-6 py-2 text-white"
        >
          {copy.backToProducts}
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    clearCart();
    router.push('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{copy.title}</h1>
            <p className="text-sm text-gray-500">{copy.subtitle}</p>
          </div>
          <button
            onClick={() => router.push('/cart')}
            className="text-sm font-semibold text-indigo-600"
          >
            ← {copy.cart}
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">{copy.shipping}</h2>
            <div className="mt-4 grid gap-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.name}
                className="w-full rounded-lg border border-gray-200 px-4 py-3"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={copy.phone}
                className="w-full rounded-lg border border-gray-200 px-4 py-3"
              />
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={copy.address}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-3"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={copy.note}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-4 py-3"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">{copy.payment}</h2>
            <div className="mt-4 grid gap-3">
              <button
                type="button"
                onClick={() => setPayment('bank')}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${
                  payment === 'bank' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <span className="font-medium text-gray-800">{copy.bank}</span>
                <span className="text-xs text-gray-500">{copy.bankHint}</span>
              </button>
              <button
                type="button"
                onClick={() => setPayment('cod')}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left ${
                  payment === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                }`}
              >
                <span className="font-medium text-gray-800">{copy.cod}</span>
                <span className="text-xs text-gray-500">{copy.codHint}</span>
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">{copy.summary}</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between">
                  <span>{item.product.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4 text-lg font-semibold text-gray-900">
              <span>{copy.total}</span>
              <span>฿{getTotalPrice().toLocaleString()}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="mt-6 w-full rounded-full bg-indigo-600 px-6 py-3 text-white"
              disabled={!name || !phone || !address}
            >
              {copy.placeOrder}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}
