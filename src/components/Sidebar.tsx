'use client';

import React from 'react';
import Link from 'next/link';
import Icon from './Icon';

const navItems = [
  {
    label: 'Home',
    href: '/dashboard',
    icon: 'home',
  },
  {
    label: 'Menu',
    href: '/menu',
    icon: 'food',
  },
  {
    label: 'My Orders',
    href: '/orders',
    icon: 'orders',
  },
  {
    label: 'Order History',
    href: '/orders/history',
    icon: 'clock',
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: 'cart',
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: 'user',
  },
];

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
  cartItemCount,
  activeHref = '/menu',
}: {
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  cartItemCount: number;
  activeHref?: string;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <Link href="/menu" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl shadow-sm">
              🍴
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                CanteenX
              </h1>
              <p className="text-[11px] font-medium text-gray-400">
                Skip the queue
              </p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <Icon name="x" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const active = item.href === activeHref;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-xl px-3 py-3
                    text-sm font-medium transition-all
                    ${
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <span
                    className={
                      active
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-gray-600'
                    }
                  >
                    <Icon name={item.icon} />
                  </span>

                  <span className="flex-1">{item.label}</span>

                  {item.label === 'Cart' && cartItemCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Quick info */}
          <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              ⚡
            </div>

            <h3 className="text-sm font-semibold">
              Skip the queue
            </h3>

            <p className="mt-1 text-xs leading-5 text-indigo-100">
              Order your food before reaching the counter and pick it up when
              it&apos;s ready.
            </p>
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 p-4">
          <Link
            href="/login"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
          >
            <Icon name="logout" size={19} />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  );
}
