// Script to push schema to Turso database
import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://fpp-db-fais152.aws-ap-northeast-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2MTAxNDMsImlkIjoiMDE5ZGE2MzItZDQwMS03Zjc1LWI3NTAtNDNhNzlhMjczY2RmIiwicmlkIjoiMTI4OGY4ODAtZTM1My00OTY0LWE4MTUtZjRjOTE4MTU3NTJkIn0.HqmSCtUExqKMK7ORPaKsaZiUUG8WnhQQZ9GRRhO-lzfRubHS29abHZFka6apO3AQwx2N87jatkBnHo8W3uInBQ",
});

const statements = [
  `CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,

  `CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL DEFAULT 'Proyek Baru',
    "industryCategory" TEXT NOT NULL DEFAULT 'F&B',
    "bepMonthlyOps" REAL NOT NULL DEFAULT 500000,
    "bepTargetDays" INTEGER NOT NULL DEFAULT 30,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Makanan',
    "targetMargin" REAL NOT NULL DEFAULT 55,
    "packaging" REAL NOT NULL DEFAULT 0,
    "labor" REAL NOT NULL DEFAULT 0,
    "overhead" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "Product_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "qty" REAL NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'gr',
    "unitCost" REAL NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Ingredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,

  `CREATE TABLE IF NOT EXISTS "CapitalItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Peralatan',
    "cost" REAL NOT NULL DEFAULT 0,
    "projectId" TEXT NOT NULL,
    CONSTRAINT "CapitalItem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`,
];

async function main() {
  console.log("Connecting to Turso...");
  for (const sql of statements) {
    const tableName = sql.match(/"(\w+)"/)?.[1] || "index";
    console.log(`Creating: ${tableName}...`);
    await client.execute(sql);
  }
  console.log("✅ All tables created successfully in Turso!");
}

main().catch(console.error);
