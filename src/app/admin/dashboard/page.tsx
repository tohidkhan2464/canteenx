'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          isAvailable
        }),
      });

      if (!res.ok) throw new Error('Failed to add item');

      setMessage('Menu item added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setIsAvailable(true);
      fetchMenu(); // Refresh the list
    } catch (err: any) {
      setMessage(err.message || 'Error adding item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 bg-gray-900 text-white shadow-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm shadow-sm">
              👑
            </div>
            <h1 className="text-lg font-bold tracking-wide">Admin Dashboard</h1>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <Icon name="logout" size={16} />
            Sign Out
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Add Item Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                <Icon name="food" />
                Add Menu Item
              </h3>
              
              {message && (
                <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleAddItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="e.g. Veg Burger"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="e.g. Classic veg burger with cheese"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 px-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    placeholder="e.g. 50"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Available immediately
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Item'}
                </button>
              </form>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Current Menu</h2>

            {loading ? (
              <div className="flex justify-center p-12">
                 <span className="flex items-center gap-2 text-gray-500 font-medium">
                   <svg className="h-5 w-5 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/></svg>
                   Loading menu items...
                 </span>
               </div>
            ) : items.length === 0 ? (
               <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">🍽️</div>
                  <h3 className="font-bold text-gray-900">No items found</h3>
                  <p className="mt-1 text-sm text-gray-500">Use the form to add some items to the menu.</p>
                </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <article key={item._id} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.isAvailable ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {item.isAvailable ? 'Available' : 'Sold out'}
                      </span>
                    </div>
                    <p className="text-sm leading-5 text-gray-500 mb-4">{item.description}</p>
                    <div className="mt-auto border-t border-gray-100 pt-3">
                      <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
