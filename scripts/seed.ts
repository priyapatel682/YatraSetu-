import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import * as fs from "fs";
import * as path from "path";

// To use this, you need a service account key JSON file from Firebase console.
// Save it as serviceAccountKey.json in the project root.
const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");
const serviceAccount = fs.existsSync(serviceAccountPath) 
  ? JSON.parse(fs.readFileSync(serviceAccountPath, "utf8")) 
  : {};

if (!getApps().length && Object.keys(serviceAccount).length > 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

const temples = [
  {
    name: "Kashi Vishwanath",
    slug: "kashi-vishwanath",
    state: "Uttar Pradesh",
    city: "Varanasi",
    deity: "Shiva",
    history: "One of the twelve Jyotirlingas, the holiest of Shiva temples.",
    darshanTimings: "4:00 AM - 11:00 PM",
    dressCode: "Traditional Indian wear",
    rules: "No leather, no mobile phones",
    featured: true,
    status: "published",
    geoCoordinates: { lat: 25.3109, lng: 83.0107 }
  },
  {
    name: "Badrinath Temple",
    slug: "badrinath",
    state: "Uttarakhand",
    city: "Badrinath",
    deity: "Vishnu",
    history: "One of the Char Dham pilgrimage sites, dedicated to Lord Vishnu.",
    darshanTimings: "4:30 AM - 9:00 PM",
    dressCode: "Modest clothing",
    rules: "Photography restricted in inner sanctum",
    featured: true,
    status: "published",
    geoCoordinates: { lat: 30.7433, lng: 79.4938 }
  },
  {
    name: "Meenakshi Amman",
    slug: "meenakshi-amman",
    state: "Tamil Nadu",
    city: "Madurai",
    deity: "Goddess Meenakshi (Parvati)",
    history: "Historic temple located on the southern bank of Vaigai River.",
    darshanTimings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
    dressCode: "Strictly traditional (Dhoti/Saree)",
    rules: "No shorts or sleeveless",
    featured: true,
    status: "published",
    geoCoordinates: { lat: 9.9195, lng: 78.1193 }
  }
];

async function seed() {
  console.log("Seeding Database...");
  const batch = db.batch();

  temples.forEach((temple) => {
    const docRef = db.collection("temples").doc(temple.slug);
    batch.set(docRef, temple);
  });

  await batch.commit();
  console.log("Seeding complete!");
}

seed().catch(console.error);
