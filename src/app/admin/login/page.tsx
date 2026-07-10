import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { SHOP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Σύνδεση διαχείρισης",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-2xl font-black text-white">
            Α
          </span>
          <h1 className="mt-3 text-lg font-bold text-slate-900">{SHOP.name}</h1>
          <p className="text-sm text-slate-500">Πίνακας διαχείρισης</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>

        {process.env.NODE_ENV !== "production" && (
          <p className="mt-4 text-center text-xs text-slate-400">
            Demo: admin@arletos.gr / arletos123
          </p>
        )}
      </div>
    </div>
  );
}
