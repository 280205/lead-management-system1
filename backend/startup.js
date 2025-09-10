#!/usr/bin/env node

const { execSync } = require('child_process');
const { setupDatabase } = require('./src/scripts/setup-db');

console.log('🚀 Starting Lead Management System...');

async function start() {
  try {
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🗄️ Setting up database directly...');
    await setupDatabase();
    
    console.log('🌱 Seeding database...');
    execSync('node src/scripts/seed.js', { stdio: 'inherit' });
    
    console.log('✅ Setup complete! Starting server...');
    execSync('node src/index.js', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

start();
