'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Icon from '@/components/Icon';
import Sidebar from '@/components/Sidebar';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartItemCount={cartItemCount}
        activeHref="/cart"
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
                Your Cart
              </h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {items.length === 0 ? (
            <div className="flex min-h-[450px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-5xl">
                  🛒
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Browse Menu
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.menuItemId}
                      className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/40"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-lg font-bold text-indigo-600">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-1.5 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-indigo-600 active:scale-95"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition hover:bg-gray-100 hover:text-indigo-600 active:scale-95"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h3>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes & Fees</span>
                      <span>₹0</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-gray-100" />

                  <div className="mb-6 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-300 active:scale-95"
                  >
                    Proceed to Checkout
                    <Icon name="arrow" size={17} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
