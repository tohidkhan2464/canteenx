'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Sidebar from '@/components/Sidebar';
import { useCart } from '@/context/CartContext';

type Order = {
  _id: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREPARING': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'READY': return 'bg-green-50 text-green-700 border-green-200';
      case 'PICKED_UP': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CANCELLED': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartItemCount={cartItemCount}
        activeHref="/orders"
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
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                My Orders
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {loading ? (
             <div className="flex justify-center p-12">
               <span className="flex items-center gap-2 text-gray-500 font-medium">
                 <svg className="h-5 w-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/></svg>
                 Loading your orders...
               </span>
             </div>
          ) : orders.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <div>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-4xl shadow-inner shadow-indigo-100">
                  📋
                </div>
                <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                  When you place an order, it will appear here so you can track its status.
                </p>
                <Link
                  href="/menu"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300"
                >
                  Order Food
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link href={`/orders/${order._id}`} key={order._id} className="block group">
                  <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600 text-lg">
                          🧾
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className={`self-start sm:self-auto inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                          {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-400">Total</p>
                          <p className="font-bold text-lg text-gray-900">₹{order.totalAmount}</p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-gray-100">
                           <Icon name="arrow" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
