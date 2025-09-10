const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sources = ['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'REFERRAL', 'EVENTS', 'OTHER'];
const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON'];
const companies = [
  'Tech Innovations Inc', 'Digital Solutions LLC', 'Cloud Services Corp', 
  'Data Analytics Pro', 'Software Systems Ltd', 'AI Ventures', 'Cyber Security Plus',
  'Web Development Co', 'Mobile Apps Inc', 'E-commerce Solutions', 'Marketing Agency Pro',
  'Consulting Group', 'Financial Services', 'Healthcare Tech', 'Education Platform'
];

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis', 'Seattle'
];

const states = [
  'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'WA', 'IN', 'GA'
];

// Generate random data helpers
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

const generateRandomLead = (userId, index) => {
  const firstName = `Lead${index}`;
  const lastName = `User${index}`;
  const email = `lead${index}@example.com`;
  
  return {
    firstName,
    lastName,
    email,
    phone: `+1-${getRandomNumber(200, 999)}-${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
    company: getRandomElement(companies),
    city: getRandomElement(cities),
    state: getRandomElement(states),
    source: getRandomElement(sources),
    status: getRandomElement(statuses),
    score: getRandomNumber(0, 100),
    leadValue: parseFloat(getRandomFloat(100, 50000)),
    lastActivityAt: Math.random() > 0.3 ? new Date(Date.now() - getRandomNumber(0, 90) * 24 * 60 * 60 * 1000) : null,
    isQualified: Math.random() > 0.6,
    userId
  };
};

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Check if data already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@leadmanagement.com' }
    });

    if (existingUser) {
      const leadCount = await prisma.lead.count({
        where: { userId: existingUser.id }
      });
      
      if (leadCount >= 100) {
        console.log('✅ Database already seeded with', leadCount, 'leads');
        console.log('📧 Test user credentials:');
        console.log('   Email: test@leadmanagement.com');
        console.log('   Password: password123');
        return;
      }
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@leadmanagement.com' },
      update: {},
      create: {
        email: 'test@leadmanagement.com',
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User'
      }
    });

    console.log('✅ Created test user:', testUser.email);

    // Delete existing leads for this user
    await prisma.lead.deleteMany({
      where: { userId: testUser.id }
    });

    console.log('🗑️  Cleared existing leads');

    // Generate 150 leads for better testing
    const leads = [];
    for (let i = 1; i <= 150; i++) {
      leads.push(generateRandomLead(testUser.id, i));
    }

    // Create leads in batches to avoid issues
    const batchSize = 50;
    let createdCount = 0;

    for (let i = 0; i < leads.length; i += batchSize) {
      const batch = leads.slice(i, i + batchSize);
      await prisma.lead.createMany({
        data: batch
      });
      createdCount += batch.length;
      console.log(`📊 Created ${createdCount}/${leads.length} leads...`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log('📧 Test user credentials:');
    console.log('   Email: test@leadmanagement.com');
    console.log('   Password: password123');
    console.log(`📈 Created ${createdCount} sample leads`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
