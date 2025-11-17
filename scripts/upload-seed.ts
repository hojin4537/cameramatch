// Script to upload seed data to Firestore
// Run with: npx tsx scripts/upload-seed.ts

// Load environment variables from .env.local
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { uploadSeedData } from "../data/seed";

uploadSeedData()
  .then(() => {
    console.log("✅ Seed data uploaded successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error uploading seed data:", error);
    process.exit(1);
  });

