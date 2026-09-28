/** Single source of truth for the shop's public details. */
export const SHOP = {
  name: "Όνομα Επιχείρησης",
  legal: "ΟΝΟΜΑ ΕΠΙΧΕΙΡΗΣΗΣ",
  tagline: "Bosch Car Service",
  city: "Πόλη",
  phoneDisplay: "210 000 0000",
  phoneIntl: "+302100000000",
  address: "Οδός Παραδείγματος 1",
  area: "000 00 Πόλη",
  rating: 4.5,
  reviews: 82,
  mapUrl:
    "https://www.google.com/maps",
  hours: [
    { label: "Δευτέρα – Παρασκευή", value: "08:30 – 17:00" },
    { label: "Σάββατο", value: "08:30 – 14:00" },
    { label: "Κυριακή", value: "Κλειστά" },
  ],
} as const;
