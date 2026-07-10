/** Single source of truth for the shop's public details. */
export const SHOP = {
  name: "Άρλετος Ηλίας",
  legal: "ΑΡΛΕΤΟΣ ΗΛΙΑΣ",
  tagline: "Bosch Car Service",
  city: "Ιωάννινα",
  phoneDisplay: "693 257 3455",
  phoneIntl: "+306932573455",
  address: "3ης Σεπτεμβρίου 30",
  area: "Ανατολή, 452 21 Ιωάννινα",
  rating: 4.5,
  reviews: 82,
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=%CE%91%CF%81%CE%BB%CE%B5%CF%84%CE%BF%CF%82+%CE%97%CE%BB%CE%B9%CE%B1%CF%82+%CE%99%CF%89%CE%B1%CE%BD%CE%BD%CE%B9%CE%BD%CE%B1",
  hours: [
    { label: "Δευτέρα – Παρασκευή", value: "08:30 – 17:00" },
    { label: "Σάββατο", value: "08:30 – 14:00" },
    { label: "Κυριακή", value: "Κλειστά" },
  ],
} as const;
