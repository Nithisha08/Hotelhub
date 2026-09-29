/**
 * Seeds demo hotel data.
 *
 * Usage (from the server/ folder):
 *   npm run seed
 *
 * Requires a reachable PostgreSQL instance configured in .env
 * (or with matching PG* environment variables).
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const DEMO_HOTELS = [
  {
    title: "Seaside Serenity Resort",
    description:
      "Wake up to the sound of waves at this beachfront resort featuring an infinity pool, spa, and panoramic ocean views from every suite.",
    latitude: 12.9716,
    longitude: 77.5946,
    price: 12500.0,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  },
  {
    title: "Urban Nest Boutique Hotel",
    description:
      "A stylish boutique hotel in the heart of the city, steps from restaurants and nightlife. Rooftop lounge and 24/7 concierge included.",
    latitude: 28.6139,
    longitude: 77.209,
    price: 7800.0,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
  },
  {
    title: "Mountain View Lodge & Spa",
    description:
      "Cozy alpine lodge surrounded by pine forests. Perfect for hiking, hot chocolate by the fireplace, and stargazing from the deck.",
    latitude: 32.2432,
    longitude: 77.1892,
    price: 9400.0,
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800",
  },
  {
    title: "The Grand Heritage Palace",
    description:
      "A restored century-old palace hotel offering royal suites, curated dining, and heritage walks through its manicured gardens.",
    latitude: 26.9124,
    longitude: 75.7873,
    price: 18500.0,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
  },
  {
    title: "Backwater Bliss Houseboat",
    description:
      "Drift through palm-lined canals on a luxury houseboat. All meals onboard, sunset cruises, and guided village tours available.",
    latitude: 9.4981,
    longitude: 76.3388,
    price: 11200.0,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
  },
  {
    title: "Desert Oasis Camp & Resort",
    description:
      "Luxury tents under the dunes with camel safaris, folk performances, and fine dining under a canopy of desert stars.",
    latitude: 26.9124,
    longitude: 70.9092,
    price: 6900.0,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
  },
  {
    title: "Corporate Comfort Suites",
    description:
      "Business hotel with ergonomic workspaces, high-speed Wi-Fi, conference rooms, and an express breakfast for the busy traveler.",
    latitude: 12.823,
    longitude: 77.6809,
    price: 5200.0,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800",
  },
  {
    title: "Lakeside Willow Retreat",
    description:
      "Quiet cottages on the water's edge with kayaking, ayurvedic massages, and fresh catch dinners at the lakeside grill.",
    latitude: 13.6287,
    longitude: 79.4192,
    price: 8700.0,
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
  },
  {
    title: "Skyline Grand Towers",
    description:
      "Sleek high-rise hotel with sky-bar views, a glass-bottom pool on the 40th floor, and direct mall access.",
    latitude: 19.076,
    longitude: 72.8777,
    price: 14300.0,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
  },
  {
    title: "Jungle Bloom Eco Stay",
    description:
      "Sustainable treehouse villas hidden in a wildlife corridor. Guided nature trails, birdwatching, and organic farm meals.",
    latitude: 11.7101,
    longitude: 76.0883,
    price: 7600.0,
    image: "https://images.unsplash.com/photo-1521783988139-89397d761dce?w=800",
  },
  {
    title: "Golden Sands Beach Shack",
    description:
      "Barefoot-luxury cabanas right on the sand, with beach yoga, seafood shacks, and legendary Goan sunsets.",
    latitude: 15.2993,
    longitude: 74.124,
    price: 4500.0,
    image: "https://images.unsplash.com/photo-1519821172144-4f87d85de2a0?w=800",
  },
  {
    title: "Pine Grove Heritage Inn",
    description:
      "Colonial-era inn wrapped in deodar forest. Strand yourself with board games, chimney-smoked cuisine, and colonial-era charm.",
    latitude: 31.1048,
    longitude: 77.1734,
    price: 6100.0,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
  },
];

// Ensure the uploads folder exists (the app stores uploaded images here)
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function seed() {
  const client = new Client({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT) || 5544,
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || "hotel_list_db",
  });

  await client.connect();
  console.log("Connected to database. Seeding demo data...");

  const insertText = `
    INSERT INTO hotels (image, title, description, latitude, longitude, price)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;

  for (const hotel of DEMO_HOTELS) {
    await client.query(insertText, [
      hotel.image,
      hotel.title,
      hotel.description,
      hotel.latitude,
      hotel.longitude,
      hotel.price,
    ]);
  }

  const { rows } = await client.query("SELECT COUNT(*) AS count FROM hotels");
  console.log(`Seeded ${DEMO_HOTELS.length} demo hotels. Total rows: ${rows[0].count}`);

  await client.end();
  console.log("Done!");
}

seed().catch((error) => {
  console.error("Seeding failed:", error.message);
  process.exit(1);
});
