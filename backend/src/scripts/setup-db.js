const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    // Drop and recreate tables
    const setupSQL = `
      -- Drop tables if they exist
      DROP TABLE IF EXISTS "Lead" CASCADE;
      DROP TABLE IF EXISTS "User" CASCADE;
      DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

      -- Create User table
      CREATE TABLE "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "firstName" TEXT,
        "lastName" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Lead table
      CREATE TABLE "Lead" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "company" TEXT,
        "city" TEXT,
        "state" TEXT,
        "source" TEXT NOT NULL DEFAULT 'OTHER',
        "status" TEXT NOT NULL DEFAULT 'NEW',
        "score" INTEGER NOT NULL DEFAULT 0,
        "leadValue" DECIMAL(10,2),
        "lastActivityAt" TIMESTAMP(3),
        "isQualified" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "userId" TEXT NOT NULL,
        CONSTRAINT "Lead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );

      -- Create indexes
      CREATE INDEX "Lead_userId_idx" ON "Lead"("userId");
      CREATE INDEX "Lead_email_idx" ON "Lead"("email");
    `;

    await client.query(setupSQL);
    console.log('✅ Database tables created successfully');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = { setupDatabase };
