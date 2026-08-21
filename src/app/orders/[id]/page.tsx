'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Sidebar from '@/components/Sidebar';
import { useCart } from '@/context/CartContext';

let socket: Socket;

type Order = {
  _id: string;
  orderNumber: string;
  items: any[];
  totalAmount: number;
  status: string;
  pickupSlotId: {
    startTime: string;
    endTime: string;
  };
};

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items } = useCart();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      });

    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io(undefined as any, {
        path: '/api/socket',
      });

      socket.on('connect', () => {
        socket.emit('join-order', id);
      });

      socket.on('order-updated', (updatedData) => {
        if (updatedData.orderId === id) {
          setOrder((prev) => prev ? { ...prev, status: updatedData.status } : null);
        }
      });
    };

    socketInitializer();

    const interval = setInterval(() => {
      fetch(`/api/orders/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrder(data.order);
        });
    }, 5000);

    return () => {
      clearInterval(interval);
      if (socket) socket.disconnect();
    };
  }, [id]);

  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'PICKED_UP'];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} cartItemCount={cartItemCount} activeHref="/orders" />
        <div className="lg:pl-72 flex h-screen items-center justify-center">
          <span className="flex items-center gap-2 text-gray-500 font-medium">
            <svg className="h-5 w-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" /></svg>
            Loading order details...
          </span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} cartItemCount={cartItemCount} activeHref="/orders" />
        <div className="lg:pl-72 flex h-screen flex-col items-center justify-center p-4">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl shadow-inner shadow-red-100">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order not found</h2>
          <Link href="/orders" className="text-indigo-600 font-medium hover:underline">← Back to Orders</Link>
        </div>
      </div>
    );
  }

  const currentIndex = statuses.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartItemCount={cartItemCount}
        activeHref="/orders"
      />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50 lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <Link href="/orders" className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50">
              <span className="sr-only">Back</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </Link>
            <div className="min-w-0 flex-1 ml-2">
              <h1 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                Track Order
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

          <div className="mb-6 overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950 p-6 sm:p-8 text-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-indigo-200 text-sm font-medium mb-1">Order Number</p>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">#{order.orderNumber}</h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 w-full sm:w-auto">
                  <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">Pickup Time</p>
                  <p className="text-lg font-bold text-white flex items-center gap-2">
                    <Icon name="clock" size={18} />
                    {order.pickupSlotId?.startTime} - {order.pickupSlotId?.endTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {order.status === 'READY' && (
                <div className="mb-8 rounded-2xl bg-green-50 border border-green-200 p-5 shadow-sm text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <strong className="text-xl font-bold text-green-900 block mb-1">Your food is ready!</strong>
                  <p className="text-green-700 text-sm">Please head to the counter and show your order number to collect it.</p>
                </div>
              )}

              <div className="relative mb-10 pl-4 sm:pl-0">
                {statuses.map((status, index) => {
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const isLast = index === statuses.length - 1;

                  let icon = "○";
                  let bg = "bg-gray-100 border-gray-200 text-gray-400";
                  let line = "bg-gray-200";

                  if (isCompleted) {
                    icon = "✓";
                    bg = "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200";
                    line = "bg-indigo-600";
                  }
                  if (isCurrent && status !== 'PICKED_UP') {
                    icon = "🟡";
                    bg = "bg-white border-2 border-indigo-600 text-indigo-600 shadow-md shadow-indigo-100";
                    line = "bg-gray-200";
                  }

                  return (
                    <div key={status} className="relative flex items-center sm:block mb-8 sm:mb-0 sm:inline-block sm:w-1/5 sm:text-center group">
                      {/* Vertical line for mobile */}
                      {!isLast && <div className={`absolute left-3.5 sm:hidden top-8 h-full w-0.5 ${line}`}></div>}
                      {/* Horizontal line for desktop */}
                      {!isLast && <div className={`hidden sm:block absolute top-4 left-[50%] h-0.5 w-[100%] ${line} -z-10`}></div>}

                      <div className="relative z-10 flex flex-col items-start sm:items-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${bg} ${isCurrent ? 'scale-110' : ''}`}>
                          {icon === '✓' ? <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : isCurrent ? <div className="h-2.5 w-2.5 rounded-full bg-indigo-600"></div> : ''}
                        </div>
                        <span className={`mt-0 sm:mt-3 ml-4 sm:ml-0 text-sm font-bold tracking-wide ${isCurrent ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                          {status.replace('_', ' ')}
                        </span>
                        {isCurrent && status === 'PREPARING' && (
                          <span className="ml-4 sm:ml-0 sm:mt-1 text-xs text-gray-500 block">Chef is working on it</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="food" size={18} />
                  Order Summary
                </h3>
                <div className="space-y-3 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-700">{item.quantity}</span>
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-600">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center font-bold text-gray-900">
                  <span>Total Paid</span>
                  <span className="text-lg">₹{order.totalAmount}</span>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
