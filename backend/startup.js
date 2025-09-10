#!/usr/bin/env node

// Simple startup script for Railway deployment
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Lead Management System Backend...');

// Start the main application
const app = spawn('node', ['src/index.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env }
});

app.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});

app.on('error', (err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
