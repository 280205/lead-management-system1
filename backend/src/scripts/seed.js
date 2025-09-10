const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sources = ['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'REFERRAL', 'EVENTS', 'OTHER'];
const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON'];
const companies = [
  'TechFlow Solutions', 'NextGen Digital', 'CloudSync Technologies', 'DataStream Analytics',
  'InnovateLabs Inc', 'CyberGuard Pro', 'WebCraft Studios', 'AppForge Technologies',
  'EcommerceHub', 'MarketPulse Agency', 'ConsultPro Group', 'FinanceWorks LLC',
  'MedTech Innovations', 'EduPlatform Solutions', 'RetailConnect Systems',
  'LogiTech Services', 'GreenEnergy Corp', 'ConstructPro Ltd', 'FoodService Plus',
  'TravelTech Solutions', 'SportsTech Inc', 'MediaFlow Agency', 'AutoTech Systems',
  'PropTech Ventures', 'AgriTech Solutions', 'FashionForward LLC', 'HealthSync Pro',
  'FinTech Innovations', 'RealEstate Plus', 'Manufacturing Pro'
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

// Realistic first and last names for leads
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
  'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
  'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah',
  'Timothy', 'Dorothy', 'Ronald', 'Lisa', 'Jason', 'Nancy', 'Edward', 'Karen'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell'
];

const generateRandomLead = (userId, index) => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${getRandomElement(['gmail.com', 'outlook.com', 'yahoo.com', 'company.com', 'business.net'])}`;
  
  // Generate more realistic lead values based on source and status
  const status = getRandomElement(statuses);
  const source = getRandomElement(sources);
  let leadValue = null;
  let score = getRandomNumber(20, 100);
  
  // Adjust lead value and score based on status and source
  if (status === 'WON') {
    leadValue = parseFloat(getRandomFloat(5000, 75000));
    score = getRandomNumber(80, 100);
  } else if (status === 'QUALIFIED') {
    leadValue = parseFloat(getRandomFloat(2000, 40000));
    score = getRandomNumber(60, 90);
  } else if (status === 'CONTACTED') {
    leadValue = parseFloat(getRandomFloat(1000, 25000));
    score = getRandomNumber(40, 80);
  } else if (status === 'NEW') {
    leadValue = parseFloat(getRandomFloat(500, 15000));
    score = getRandomNumber(20, 70);
  } else { // LOST
    leadValue = parseFloat(getRandomFloat(100, 5000));
    score = getRandomNumber(0, 40);
  }

  return {
    firstName,
    lastName,
    email,
    phone: `(${getRandomNumber(200, 999)}) ${getRandomNumber(200, 999)}-${getRandomNumber(1000, 9999)}`,
    company: getRandomElement(companies),
    city: getRandomElement(cities),
    state: getRandomElement(states),
    source,
    status,
    score,
    leadValue,
    lastActivityAt: Math.random() > 0.3 ? new Date(Date.now() - getRandomNumber(0, 90) * 24 * 60 * 60 * 1000) : null,
    isQualified: status === 'QUALIFIED' || status === 'WON' || (Math.random() > 0.7),
    userId
  };
};

async function main() {
  console.log('🌱 Starting database seed...');

  try {
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
