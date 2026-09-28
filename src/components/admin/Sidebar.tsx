"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarDaysIcon,
  UsersIcon,
  BellAlertIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/admin", label: "Πίνακας", icon: HomeIcon, exact: true },
  { href: "/admin/appointments", label: "Ραντεβού", icon: CalendarDaysIcon },
  { href: "/admin/customers", label: "Πελάτες", icon: UsersIcon },
  { href: "/admin/reminders", label: "Υπενθυμίσεις", icon: BellAlertIcon },
];

export function Sidebar({ admin }: { admin: { name: string; role: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (item: (typeof NAV)[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const brand = (
    <div className="flex items-center gap-2.5 px-5 py-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">
        Ο
      </span>
      <div className="leading-tight">
        <span className="block text-sm font-bold text-white">Όνομα Επιχείρησης</span>
        <span className="block text-[11px] uppercase tracking-wide text-slate-400">
          Διαχείριση
        </span>
      </div>
    </div>
  );

  const nav = (
    <nav className="flex-1 space-y-1 px-3">
      {NAV.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-brand-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const account = (
    <div className="border-t border-slate-800 p-3">
      <div className="px-3 py-2">
        <p className="text-sm font-medium text-white">{admin.name}</p>
        <p className="text-xs text-slate-400">
          {admin.role === "OWNER" ? "Ιδιοκτήτης" : "Προσωπικό"}
        </p>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          Αποσύνδεση
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-900 md:flex">
        {brand}
        {nav}
        {account}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-slate-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-base font-black text-white">
            Ο
          </span>
          <span className="text-sm font-bold text-white">Διαχείριση</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-slate-300"
          aria-label="Μενού"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-slate-900">
            <div className="flex items-center justify-between pr-3">
              {brand}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-300"
                aria-label="Κλείσιμο"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {nav}
            {account}
          </aside>
        </div>
      )}
    </>
  );
}
