import Link from "next/link";
import { TruckIcon, PhoneIcon } from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Πελάτες" };

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { vehicles: true, appointments: true } } },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Πελάτες</h1>
        <p className="mt-1 text-sm text-slate-500">
          Το μητρώο πελατών και των οχημάτων τους.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {customers.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">
            Δεν υπάρχουν καταχωρημένοι πελάτες ακόμη.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {customers.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/admin/customers/${c.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="flex items-center gap-1.5 text-sm text-slate-500">
                      <PhoneIcon className="h-3.5 w-3.5" />
                      {c.phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <TruckIcon className="h-4 w-4" />
                    {c._count.vehicles}{" "}
                    {c._count.vehicles === 1 ? "όχημα" : "οχήματα"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
