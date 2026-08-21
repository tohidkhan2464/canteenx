import Icon from "@/components/Icon";
import Sidebar from "@/components/Sidebar";
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
};


function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-5"
        >
          <div className="mb-5 flex justify-between">
            <div className="h-12 w-12 rounded-xl bg-gray-200" />
            <div className="h-7 w-16 rounded-lg bg-gray-200" />
          </div>

          <div className="h-5 w-2/3 rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full rounded bg-gray-200" />
          <div className="mt-2 h-3 w-4/5 rounded bg-gray-200" />

          <div className="mt-6 h-10 w-full rounded-xl bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const { items: cartItems, addItem } = useCart();

  const cartItemCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch('/api/menu');

      if (!res.ok) {
        throw new Error('Failed to fetch menu');
      }

      const data = await res.json();

      setItems(data.items || []);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return items;

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [items, search]);

  const availableCount = items.filter((item) => item.isAvailable).length;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cartItemCount={cartItemCount}
      />

      {/* Main content */}
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
                Good afternoon 👋
              </h1>

              <p className="hidden text-sm text-gray-500 sm:block">
                What would you like to eat today?
              </p>
            </div>

            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Icon name="cart" size={19} />

              <span className="hidden sm:inline">Cart</span>

              {cartItemCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 pb-32 sm:px-6 lg:px-8 lg:py-8">
          {/* Hero */}
          <section className="mb-7 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 p-6 text-white shadow-lg sm:p-8">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-50 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
                Canteen is open
              </div>

              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Order ahead.
                <br />
                Skip the queue.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-indigo-100 sm:text-base">
                Browse today&apos;s menu, place your order, and simply pick it
                up when it&apos;s ready.
              </p>
            </div>
          </section>

          {/* Search + stats */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Today&apos;s Menu
              </h2>

              {!loading && !error && items.length > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  {availableCount} of {items.length} items available
                </p>
              )}
            </div>

            {!loading && !error && items.length > 0 && (
              <div className="relative w-full sm:w-72">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon name="search" size={18} />
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search food..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && <LoadingSkeleton />}

          {/* Error */}
          {!loading && error && (
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-gray-200 bg-white p-8">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl">
                  ⚠️
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  Unable to load menu
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Something went wrong while loading the canteen menu. Please
                  try again.
                </p>

                <button
                  onClick={fetchMenu}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  <Icon name="refresh" size={17} />
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Completely empty */}
          {!loading && !error && items.length === 0 && (
            <div className="flex min-h-[450px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white p-8">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-5xl">
                  🍽️
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  Menu is coming soon
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  There are no food items available right now. The canteen
                  staff may still be preparing today&apos;s menu.
                </p>

                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={fetchMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    <Icon name="refresh" size={17} />
                    Refresh menu
                  </button>

                  <Link
                    href="/orders"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    View my orders
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Search returned nothing */}
          {!loading &&
            !error &&
            items.length > 0 &&
            filteredItems.length === 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white px-6 py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                  🔍
                </div>

                <h3 className="font-bold text-gray-900">
                  No food found
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Try searching for something else.
                </p>

                <button
                  onClick={() => setSearch('')}
                  className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Clear search
                </button>
              </div>
            )}

          {/* Menu */}
          {!loading &&
            !error &&
            filteredItems.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredItems.map((item) => (
                  <article
                    key={item._id}
                    className={`
                      group relative overflow-hidden rounded-2xl border
                      bg-white p-5 shadow-sm transition-all duration-200
                      ${item.isAvailable
                        ? 'border-gray-100 hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/40'
                        : 'border-gray-100 opacity-70'
                      }
                    `}
                  >
                    {/* Food icon */}
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">
                        🍛
                      </div>

                      <span
                        className={`
                          rounded-full px-2.5 py-1 text-[11px] font-semibold
                          ${item.isAvailable
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                          }
                        `}
                      >
                        {item.isAvailable ? 'Available' : 'Sold out'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 min-h-10 text-sm leading-5 text-gray-500">
                      {item.description || 'Freshly prepared at the canteen.'}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs font-medium text-gray-400">
                          Price
                        </p>
                        <p className="mt-0.5 text-lg font-bold text-gray-900">
                          ₹{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          addItem({
                            menuItemId: item._id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                          })
                        }
                        disabled={!item.isAvailable}
                        className={`
                          inline-flex items-center gap-2 rounded-xl px-4 py-2.5
                          text-sm font-semibold transition
                          ${item.isAvailable
                            ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-95'
                            : 'cursor-not-allowed bg-gray-100 text-gray-400'
                          }
                        `}
                      >
                        {item.isAvailable ? (
                          <>
                            Add to cart
                            <span className="text-base">+</span>
                          </>
                        ) : (
                          'Unavailable'
                        )}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </main>

        {/* Floating cart bar */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-4 left-4 right-4 z-40 lg:left-[calc(18rem+1rem)] lg:right-8">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 rounded-2xl bg-gray-950 p-3 pl-4 text-white shadow-2xl shadow-gray-400/30 sm:p-4 sm:pl-5">
              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  {cartItemCount} item
                  {cartItemCount !== 1 ? 's' : ''} in your cart
                </p>

                <p className="mt-0.5 text-base font-bold sm:text-lg">
                  ₹{cartTotal}
                </p>
              </div>

              <Link
                href="/cart"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 sm:px-5"
              >
                View Cart
                <Icon name="arrow" size={17} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}