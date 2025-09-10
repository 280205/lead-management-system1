#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Starting Lead Management System...');

try {
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('🗄️ Setting up database...');
  try {
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Force reset failed, trying regular push...');
    execSync('npx prisma db push', { stdio: 'inherit' });
  }
  
  console.log('🌱 Seeding database...');
  execSync('node src/scripts/seed.js', { stdio: 'inherit' });
  
  console.log('✅ Setup complete! Starting server...');
  execSync('node src/index.js', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Startup failed:', error.message);
  process.exit(1);
}
