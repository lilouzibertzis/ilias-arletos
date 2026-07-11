"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteVehiclePhoto } from "./actions";

type Photo = { id: string; caption: string | null };

/** Downscale a photo client-side so DB rows stay small and uploads are fast. */
async function resizeImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("resize failed"))),
      "image/jpeg",
      quality,
    ),
  );
}

export function ServiceBookPhotos({
  vehicleId,
  customerId,
  photos,
}: {
  vehicleId: string;
  customerId: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setBusy(true);
    try {
      const blob = await resizeImage(file).catch(() => file as Blob);
      const fd = new FormData();
      fd.append("vehicleId", vehicleId);
      fd.append("file", blob, "service-book.jpg");
      const res = await fetch("/api/admin/vehicle-photo", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Απέτυχε η μεταφόρτωση.");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Βιβλίο service (φωτογραφίες)
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline disabled:opacity-60"
        >
          <CameraIcon className="h-4 w-4" />
          {busy ? "Μεταφόρτωση…" : "Προσθήκη φωτογραφίας"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={onFile}
        />
      </div>

      {error && <p className="mt-2 text-xs text-accent">{error}</p>}

      {photos.length === 0 ? (
        <p className="mt-2 text-sm text-slate-400">
          Ανεβάστε φωτογραφία του έντυπου βιβλίου service.
        </p>
      ) : (
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((p) => (
            <div key={p.id} className="group relative">
              <a href={`/api/vehicle-photo/${p.id}`} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/vehicle-photo/${p.id}`}
                  alt="Βιβλίο service"
                  className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                />
              </a>
              <form action={deleteVehiclePhoto} className="absolute -right-2 -top-2">
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="customerId" value={customerId} />
                <button
                  type="submit"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-slate-500 shadow ring-1 ring-slate-200 hover:text-accent"
                  aria-label="Διαγραφή"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
