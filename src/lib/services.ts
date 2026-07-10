/**
 * Canonical service catalog — shown on the landing page and offered in the
 * booking dropdown. Kept as a constant so public pages don't depend on the DB
 * at build time. (The `Service` table exists for future owner-editable pricing.)
 */
export type ServiceItem = {
  name: string;
  emoji: string;
  price?: number;
  desc: string;
};

export const SERVICES: ServiceItem[] = [
  { name: "Αλλαγή λαδιών & φίλτρων", emoji: "🛢️", price: 60, desc: "Λάδια κινητήρα και φίλτρα λαδιού/αέρα/καμπίνας." },
  { name: "Έλεγχος & αλλαγή φρένων", emoji: "🛑", price: 90, desc: "Τακάκια, δισκόπλακες και υγρά φρένων." },
  { name: "Διαγνωστικός έλεγχος", emoji: "🔍", price: 30, desc: "Ηλεκτρονική διάγνωση βλαβών με Bosch εξοπλισμό." },
  { name: "Προγραμματισμένο service", emoji: "🔧", price: 120, desc: "Πλήρες service βάσει βιβλίου συντήρησης." },
  { name: "Ευθυγράμμιση & ζυγοστάθμιση", emoji: "⚙️", price: 45, desc: "Ρύθμιση γεωμετρίας και ζυγοστάθμιση τροχών." },
  { name: "Αλλαγή ελαστικών", emoji: "🛞", price: 40, desc: "Τοποθέτηση και αλλαγή ελαστικών όλων των τύπων." },
  { name: "Προετοιμασία για ΚΤΕΟ", emoji: "📋", price: 35, desc: "Πλήρης έλεγχος πριν το ΚΤΕΟ για σίγουρο πέρασμα." },
  { name: "Service κλιματισμού (A/C)", emoji: "❄️", price: 50, desc: "Αναγόμωση και έλεγχος συστήματος κλιματισμού." },
  { name: "Ανάρτηση & αμορτισέρ", emoji: "🔩", price: 110, desc: "Έλεγχος και αντικατάσταση εξαρτημάτων ανάρτησης." },
  { name: "Μπαταρία & ηλεκτρικά", emoji: "🔋", price: 40, desc: "Έλεγχος φόρτισης, μπαταρίας και ηλεκτρικού συστήματος." },
];
