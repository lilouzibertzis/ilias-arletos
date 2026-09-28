"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { SHOP } from "@/lib/site";

const NAV = [
  { href: "/#services", label: "Υπηρεσίες" },
  { href: "/#why", label: "Γιατί εμείς" },
  { href: "/service-book", label: "Το όχημά μου" },
  { href: "/#contact", label: "Επικοινωνία" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">
            Ο
          </span>
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight text-brand-800">
              {SHOP.name}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-wide text-accent">
              {SHOP.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`tel:${SHOP.phoneIntl}`}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-700"
          >
            <PhoneIcon className="h-4 w-4" />
            {SHOP.phoneDisplay}
          </a>
          <Link
            href="/book"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark"
          >
            Κλείστε ραντεβού
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Μενού"
        >
          {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <a
                href={`tel:${SHOP.phoneIntl}`}
                className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-brand-700"
              >
                <PhoneIcon className="h-4 w-4" />
                {SHOP.phoneDisplay}
              </a>
              <Link
                href="/book"
                className="rounded-full bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white"
                onClick={() => setOpen(false)}
              >
                Κλείστε ραντεβού
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
