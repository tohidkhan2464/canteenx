'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Sidebar from '@/components/Sidebar';

type PickupSlot = {
  _id: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  currentOrders: number;
  status: string;
};

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetch('/api/pickup-slots')
      .then((res) => res.json())
      .then((data) => {
        setSlots(data.slots || []);
      });
  }, []);

  const getCrowdLevel = (current: number, max: number) => {
    const ratio = current / max;
    if (ratio < 0.33) return { level: 'Low Crowd', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-500' };
    if (ratio < 0.66) return { level: 'Medium Crowd', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', dot: 'bg-yellow-500' };
    return { level: 'High Crowd', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' };
  };

  const handlePlaceOrder = async () => {
    if (!selectedSlot) {
      setError('Please select a pickup slot to continue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totalAmount,
          pickupSlotId: selectedSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      clearCart();
      router.push(`/orders/${data.order._id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">No items to checkout</h2>
        <Link href="/menu" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartItemCount={cartItemCount}
        activeHref="/checkout"
      />

      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50 lg:hidden"
            >
              <Icon name="menu" />
            </button>

            <Link href="/cart" className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50">
              <span className="sr-only">Back</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>

            <div className="min-w-0 flex-1 ml-2">
              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                Checkout
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7 xl:col-span-8">
              
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg">⚠️</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Select Pickup Time</h2>
                <div className="space-y-4">
                  {slots.map((slot) => {
                    const crowd = getCrowdLevel(slot.currentOrders, slot.maxOrders);
                    const isSelected = selectedSlot === slot._id;
                    const isRecommended = crowd.level === 'Low Crowd';
                    
                    return (
                      <label 
                        key={slot._id} 
                        className={`group relative flex cursor-pointer items-start gap-4 rounded-2xl border p-5 transition-all duration-200
                          ${isSelected 
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100/50' 
                            : 'border-gray-200 bg-white hover:border-indigo-200 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center pt-0.5">
                          <input
                            type="radio"
                            name="pickupSlot"
                            value={slot._id}
                            checked={isSelected}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                              {slot.startTime} – {slot.endTime}
                            </span>
                            {isRecommended && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                                ⭐ Recommended
                              </span>
                            )}
                          </div>

                          <div className="mt-3 inline-flex items-center gap-2 rounded-lg px-2.5 py-1 border text-xs font-semibold backdrop-blur-sm"
                               className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs font-semibold ${crowd.bg} ${crowd.color} ${crowd.border}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${crowd.dot}`} />
                            {crowd.level}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-gray-900">Payment Summary</h3>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹0</span>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-100" />

                <div className="mb-6 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total to Pay</span>
                  <span>₹{totalAmount}</span>
                </div>

                <div className="mb-6 rounded-xl bg-gray-50 p-4 border border-gray-100">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm text-lg">💳</span>
                    Mock Payment active
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !selectedSlot}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition 
                    ${loading || !selectedSlot 
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                      : 'bg-indigo-600 shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300 active:scale-95'
                    }
                  `}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/></svg>
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${totalAmount}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
