"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { adminCopy } from '@/constants/uiCopy';
import { siteLinks } from '@/constants/siteLinks';

interface OrderSummary {
  id: string;
  customer: string;
  total: number;
  status: string;
  createdAt: string;
}

interface LatestPurchase {
  customer: string;
  amount: number;
  time: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const copy = adminCopy[language];
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [latestPurchase, setLatestPurchase] = useState<LatestPurchase | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem('post_auth_redirect', '/admin');
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const baseUrl = siteLinks.adminApiBaseUrl;
    if (!baseUrl) return;

    const load = async () => {
      try {
        const [ordersRes, latestRes] = await Promise.all([
          fetch(`${baseUrl}/orders`),
          fetch(`${baseUrl}/orders/latest`),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData.orders || []);
        }

        if (latestRes.ok) {
          const latestData = await latestRes.json();
          setLatestPurchase(latestData.latest || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      }
    };

    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{copy.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{copy.title}</h1>
          <p className="mt-2 text-gray-500">{copy.subtitle}</p>
          {!siteLinks.adminApiBaseUrl && (
            <p className="mt-3 text-sm text-red-500">{copy.setup}</p>
          )}
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[1fr_0.7fr]">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">{copy.latestOrders}</h2>
          <div className="mt-4 space-y-3">
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500">{copy.empty}</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">฿{order.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{order.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">{copy.latestPurchase}</h2>
          {latestPurchase ? (
            <div className="mt-4 rounded-xl border px-4 py-4">
              <p className="text-sm font-semibold text-gray-900">{latestPurchase.customer}</p>
              <p className="mt-1 text-sm text-gray-500">{latestPurchase.time}</p>
              <p className="mt-3 text-xl font-semibold text-indigo-600">฿{latestPurchase.amount.toLocaleString()}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{copy.empty}</p>
          )}
        </section>
      </main>
    </div>
  );
}
