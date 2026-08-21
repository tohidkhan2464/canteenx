'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Icon from '@/components/Icon';
import Link from 'next/link';

let socket: Socket;

type Order = {
  _id: string;
  orderNumber: string;
  items: any[];
  status: string;
  pickupSlotId: {
    startTime: string;
    endTime: string;
  };
  createdAt: string;
};

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    fetch('/api/staff/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();

    const socketInitializer = async () => {
      await fetch('/api/socket');
      socket = io(undefined as any, {
        path: '/api/socket',
      });

      socket.on('connect', () => {
        socket.emit('join-staff');
      });

      socket.on('new-order', (order) => {
        setOrders((prev) => [order, ...prev]);
      });
    };

    socketInitializer();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/staff/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        socket.emit('staff-update-order', { orderId, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeOrders = orders.filter(o => !['PICKED_UP', 'CANCELLED'].includes(o.status));
  const completedOrders = orders.filter(o => ['PICKED_UP', 'CANCELLED'].includes(o.status));

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
      <span className="flex items-center gap-2 text-gray-500 font-medium">
        <svg className="h-5 w-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/></svg>
        Loading dashboard...
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 bg-gray-900 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm shadow-sm">
              👨‍🍳
            </div>
            <h1 className="text-lg font-bold tracking-wide">Staff Dashboard</h1>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <Icon name="logout" size={16} />
            Sign Out
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Active Orders</p>
            <p className="text-3xl font-bold text-gray-900">{activeOrders.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500 mb-1">Completed Today</p>
            <p className="text-3xl font-bold text-gray-900">{completedOrders.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-indigo-600 p-6 shadow-sm text-white">
            <p className="text-sm font-medium text-indigo-100 mb-1">Kitchen Status</p>
            <p className="text-xl font-bold flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              Accepting Orders
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="clock" /> Active Queue
        </h2>

        {activeOrders.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-3xl">
                😴
              </div>
              <h3 className="text-lg font-bold text-gray-900">Queue is empty</h3>
              <p className="text-sm text-gray-500">No active orders right now.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeOrders.map((order) => (
              <div key={order._id} className="flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden transition hover:shadow-md hover:border-indigo-200">
                <div className={`p-4 border-b border-gray-100 flex justify-between items-center ${
                  order.status === 'READY' ? 'bg-green-50/50' : 
                  order.status === 'PREPARING' ? 'bg-yellow-50/50' : 'bg-gray-50/50'
                }`}>
                  <div>
                    <h3 className="font-bold text-gray-900">#{order.orderNumber}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{order.pickupSlotId?.startTime} - {order.pickupSlotId?.endTime}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'READY' ? 'bg-green-100 text-green-700' :
                    order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="p-4 flex-1">
                  <ul className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-700">
                        <span className="font-bold text-gray-900">{item.quantity}x</span>
                        <span className="font-medium">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto flex gap-2">
                  {order.status === 'PENDING' || order.status === 'CONFIRMED' ? (
                    <button
                      onClick={() => updateStatus(order._id, 'PREPARING')}
                      className="flex-1 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-yellow-600 active:scale-95"
                    >
                      Start Preparing
                    </button>
                  ) : order.status === 'PREPARING' ? (
                    <button
                      onClick={() => updateStatus(order._id, 'READY')}
                      className="flex-1 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-green-600 active:scale-95"
                    >
                      Mark Ready
                    </button>
                  ) : order.status === 'READY' ? (
                    <button
                      onClick={() => updateStatus(order._id, 'PICKED_UP')}
                      className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95"
                    >
                      Completed
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
