const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const SETUP_FLAG_FILE = path.join(__dirname, '..', '..', '.setup_complete');

async function checkAndSetupDatabase() {
  try {
    // Check if setup already completed
    if (fs.existsSync(SETUP_FLAG_FILE)) {
      console.log('✅ Database setup already completed, skipping...');
      return;
    }

    console.log('🔧 Setting up database for first time...');

    // Try to connect to database
    await prisma.$connect();
    console.log('📊 Connected to database');

    // Check if User table exists by trying to count users
    try {
      const userCount = await prisma.user.count();
      console.log(`👥 Found ${userCount} users in database`);

      if (userCount === 0) {
        console.log('🌱 No users found, seeding database...');
        await seedDatabase();
      } else {
        console.log('✅ Database already has data, skipping seed');
      }
    } catch (error) {
      if (error.code === 'P2021' || error.message.includes('does not exist')) {
        console.log('🏗️ Tables do not exist, creating schema...');
        
        // Push schema to database (creates tables without migration files)
        const { execSync } = require('child_process');
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        
        console.log('🌱 Seeding database...');
        await seedDatabase();
      } else {
        throw error;
      }
    }

    // Mark setup as complete
    fs.writeFileSync(SETUP_FLAG_FILE, new Date().toISOString());
    console.log('✅ Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    // Don't exit the process, just continue
  } finally {
    await prisma.$disconnect();
  }
}

async function seedDatabase() {
  // Import the existing seed logic
  const seedScript = require('./seed');
  
  // If seed.js exports a function, call it. Otherwise, it will run automatically.
  if (typeof seedScript === 'function') {
    await seedScript();
  }
}

module.exports = checkAndSetupDatabase;

// Run setup if this file is executed directly
if (require.main === module) {
  checkAndSetupDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
