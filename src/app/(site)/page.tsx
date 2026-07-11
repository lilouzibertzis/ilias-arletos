import Link from "next/link";
import {
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  ShieldCheckIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { SHOP } from "@/lib/site";
import { SERVICES } from "@/lib/services";

const WHY = [
  {
    icon: CalendarDaysIcon,
    title: "Ραντεβού online 24/7",
    text: "Κλείστε το ραντεβού σας ό,τι ώρα θέλετε, χωρίς τηλεφωνήματα και αναμονή.",
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: "Ιστορικό ανά όχημα",
    text: "Κρατάμε πλήρες ιστορικό εργασιών για κάθε αυτοκίνητο — ξέρουμε πάντα τι χρειάζεται.",
  },
  {
    icon: BellAlertIcon,
    title: "Υπενθυμίσεις ΚΤΕΟ & service",
    text: "Σας ειδοποιούμε για ΚΤΕΟ, service και αλλαγή ελαστικών, πριν το ξεχάσετε.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Bosch Car Service",
    text: "Εξειδικευμένος εξοπλισμός και τεχνογνωσία Bosch, με εγγύηση στις εργασίες μας.",
  },
];

const STEPS = [
  { n: 1, title: "Κλείνετε ραντεβού", text: "Επιλέγετε υπηρεσία, ημέρα και ώρα online σε 1 λεπτό." },
  { n: 2, title: "Φέρνετε το αυτοκίνητο", text: "Σας περιμένουμε στο συνεργείο την ώρα του ραντεβού σας." },
  { n: 3, title: "Ενημέρωση όταν είναι έτοιμο", text: "Σας ειδοποιούμε μόλις ολοκληρωθεί η εργασία για παραλαβή." },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 to-brand-600 text-white">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
              <span className="flex items-center gap-0.5 text-amber-300">
                <StarIcon className="h-3.5 w-3.5" />
                {SHOP.rating.toString().replace(".", ",")}
              </span>
              <span className="text-white/80">από {SHOP.reviews} κριτικές στο Google</span>
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Το συνεργείο εμπιστοσύνης στα Ιωάννινα
            </h1>
            <p className="mt-5 max-w-xl text-lg text-brand-50/90">
              Service, φρένα, λάδια, διάγνωση βλαβών και προετοιμασία ΚΤΕΟ για κάθε
              μάρκα. Κλείστε το ραντεβού σας online σε λίγα δευτερόλεπτα.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:bg-accent-dark"
              >
                <CalendarDaysIcon className="h-5 w-5" />
                Κλείστε ραντεβού
              </Link>
              <a
                href={`tel:${SHOP.phoneIntl}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-base font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/15"
              >
                <PhoneIcon className="h-5 w-5" />
                {SHOP.phoneDisplay}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-50/80">
              <span className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-300" /> Όλες οι μάρκες
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-300" /> Εγγύηση εργασιών
              </span>
              <span className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 text-emerald-300" /> Γνήσια ανταλλακτικά
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Οι υπηρεσίες μας</h2>
          <p className="mt-3 text-slate-600">
            Από την απλή αλλαγή λαδιών μέχρι σύνθετες επισκευές — αναλαμβάνουμε τα πάντα.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                  {s.emoji}
                </span>
                <h3 className="font-semibold text-slate-900">{s.name}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm text-slate-600">{s.desc}</p>
              {s.price != null && (
                <p className="mt-4 text-sm font-medium text-slate-500">
                  από <span className="text-brand-700">{s.price}€</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Why us ── */}
      <section id="why" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Γιατί να μας επιλέξετε</h2>
            <p className="mt-3 text-slate-600">
              Δεν είμαστε απλώς ένα συνεργείο — είμαστε ο μακροχρόνιος συνεργάτης του αυτοκινήτου σας.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Πώς λειτουργεί</h2>
          <p className="mt-3 text-slate-600">Τρία απλά βήματα από το ραντεβού μέχρι την παραλαβή.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="relative rounded-2xl border border-slate-200 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Online service book CTA ── */}
      <section className="bg-brand-700 py-14 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold">Εξυπηρετηθήκατε εδώ;</h2>
          <p className="max-w-xl text-brand-50/90">
            Δείτε online το βιβλίο service και την κατάσταση της επισκευής του
            οχήματός σας — απλά με την πινακίδα σας.
          </p>
          <Link
            href="/service-book"
            className="rounded-full bg-white px-6 py-3 font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Δείτε το όχημά μου →
          </Link>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Πού θα μας βρείτε</h2>
            <p className="mt-3 text-slate-600">
              Βρισκόμαστε στην Ανατολή Ιωαννίνων. Περάστε ή κλείστε ραντεβού για να σας εξυπηρετήσουμε άμεσα.
            </p>
            <ul className="mt-6 space-y-4 text-slate-700">
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <span>
                  {SHOP.address}, {SHOP.area}
                  <a
                    href={SHOP.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 font-semibold text-brand-700 hover:underline"
                  >
                    Οδηγίες →
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 shrink-0 text-brand-600" />
                <a href={`tel:${SHOP.phoneIntl}`} className="font-semibold text-brand-700">
                  {SHOP.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
                <div className="space-y-1">
                  {SHOP.hours.map((h) => (
                    <div key={h.label} className="flex justify-between gap-6 text-sm">
                      <span className="text-slate-600">{h.label}</span>
                      <span className="font-medium">{h.value}</span>
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-brand-700 p-8 text-white">
            <h3 className="text-2xl font-bold">Έτοιμοι να ξεκινήσουμε;</h3>
            <p className="mt-3 text-brand-50/90">
              Κλείστε το ραντεβού σας online και αφήστε το αυτοκίνητό σας σε έμπειρα χέρια.
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Κλείστε ραντεβού τώρα
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
