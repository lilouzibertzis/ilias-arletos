import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SERVICES = [
  { name: "Αλλαγή λαδιών & φίλτρων", approxPrice: 60, durationMin: 45, sortOrder: 1 },
  { name: "Έλεγχος & αλλαγή φρένων", approxPrice: 90, durationMin: 90, sortOrder: 2 },
  { name: "Διαγνωστικός έλεγχος βλάβης", approxPrice: 30, durationMin: 45, sortOrder: 3 },
  { name: "Προγραμματισμένο service", approxPrice: 120, durationMin: 120, sortOrder: 4 },
  { name: "Ευθυγράμμιση & ζυγοστάθμιση", approxPrice: 45, durationMin: 60, sortOrder: 5 },
  { name: "Αλλαγή ελαστικών", approxPrice: 40, durationMin: 40, sortOrder: 6 },
  { name: "Προετοιμασία για ΚΤΕΟ", approxPrice: 35, durationMin: 45, sortOrder: 7 },
  { name: "Service κλιματισμού (A/C)", approxPrice: 50, durationMin: 60, sortOrder: 8 },
  { name: "Ανάρτηση & αμορτισέρ", approxPrice: 110, durationMin: 120, sortOrder: 9 },
  { name: "Μπαταρία & ηλεκτρικά", approxPrice: 40, durationMin: 45, sortOrder: 10 },
];

async function main() {
  // 1) Owner account (idempotent by email).
  const email = "admin@arletos.gr";
  const passwordHash = await bcrypt.hash("arletos123", 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name: "Ηλίας Άρλετος", role: "OWNER" },
  });
  console.log(`✔ Admin ready: ${email} / arletos123`);

  // 2) Service catalog (only if empty).
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({ data: SERVICES });
    console.log(`✔ Seeded ${SERVICES.length} services`);
  }

  // 3) A little demo data so the admin isn't empty during the pitch.
  if ((await prisma.customer.count()) === 0) {
    const customer = await prisma.customer.create({
      data: {
        name: "Γιώργος Παπαδόπουλος",
        phone: "6971234567",
        email: "g.papadopoulos@example.com",
        vehicles: {
          create: {
            make: "Volkswagen",
            model: "Golf 1.6 TDI",
            year: 2015,
            plate: "ΙΝΑ-4521",
            mileage: 142000,
          },
        },
      },
      include: { vehicles: true },
    });
    const vehicle = customer.vehicles[0];

    await prisma.serviceRecord.create({
      data: {
        vehicleId: vehicle.id,
        performedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        description: "Αλλαγή λαδιών, φίλτρο λαδιού & φίλτρο αέρα",
        parts: "Castrol 5W-30, φίλτρα Mann",
        cost: 65,
        mileage: 138000,
      },
    });

    await prisma.reminder.create({
      data: {
        customerId: customer.id,
        vehicleId: vehicle.id,
        type: "KTEO",
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        channel: "VIBER",
        message: "Το ΚΤΕΟ του οχήματός σας λήγει σύντομα.",
      },
    });

    // A fresh web booking waiting for the owner to confirm.
    await prisma.appointment.create({
      data: {
        contactName: "Μαρία Ιωάννου",
        contactPhone: "6987654321",
        contactEmail: "maria.ioannou@example.com",
        vehicleInfo: "Toyota Yaris 2018, ΙΝΒ-9080",
        serviceType: "Αλλαγή λαδιών & φίλτρων",
        notes: "Ακούγεται ένας θόρυβος στα μπροστινά φρένα.",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "PENDING",
        source: "WEB",
      },
    });
    console.log("✔ Seeded demo customer, vehicle, history, reminder & booking");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
