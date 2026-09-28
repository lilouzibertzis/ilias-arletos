import Link from "next/link";
import { MapPinIcon, PhoneIcon, ClockIcon } from "@heroicons/react/24/outline";
import { SHOP } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-lg font-black text-white">
              Ο
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold text-brand-800">
                {SHOP.name}
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-wide text-accent">
                {SHOP.tagline}
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-600">
            Το συνεργείο εμπιστοσύνης στην πόλη σας για κάθε μάρκα αυτοκινήτου.
          </p>
        </div>

        <div className="text-sm">
          <h3 className="font-semibold text-slate-900">Επικοινωνία</h3>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-brand-600" />
              <span>
                {SHOP.address}
                <br />
                {SHOP.area}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4.5 w-4.5 shrink-0 text-brand-600" />
              <a href={`tel:${SHOP.phoneIntl}`} className="hover:text-brand-700">
                {SHOP.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-sm">
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            <ClockIcon className="h-4.5 w-4.5 text-brand-600" />
            Ωράριο
          </h3>
          <ul className="mt-4 space-y-2 text-slate-600">
            {SHOP.hours.map((h) => (
              <li key={h.label} className="flex justify-between gap-4">
                <span>{h.label}</span>
                <span className="font-medium text-slate-800">{h.value}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/book"
            className="mt-5 inline-block rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            Κλείστε ραντεβού online
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {SHOP.legal}. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <p>
            Κατασκευή ιστοσελίδας από{" "}
            <span className="font-semibold text-slate-700">WEBA</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
