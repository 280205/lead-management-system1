const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const sources = ['WEBSITE', 'FACEBOOK_ADS', 'GOOGLE_ADS', 'REFERRAL', 'EVENTS', 'OTHER'];
const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON'];
const companies = [
  'TechMahindra Solutions', 'Infosys Digital', 'Wipro Technologies', 'HCL Analytics',
  'TCS Innovations', 'Mindtree Labs', 'L&T Infotech', 'Mphasis Technologies',
  'Bharti Enterprises', 'Reliance Industries', 'Adani Group', 'Tata Consultancy',
  'Bajaj Finserv', 'HDFC Solutions', 'ICICI Tech', 'SBI Services',
  'Flipkart Commerce', 'Paytm Payments', 'Ola Mobility', 'Zomato Food Tech',
  'Byju\'s Education', 'Unacademy Learning', 'Swiggy Delivery', 'BigBasket Retail',
  'Nykaa Beauty', 'PharmEasy Health', 'PolicyBazaar Insurance', 'MakeMyTrip Travel',
  'RedBus Transport', 'BookMyShow Entertainment', 'Delhivery Logistics', 'Freshworks Software',
  'Zoho Corporation', 'Mu Sigma Analytics', 'Genpact Services', 'Tech Mahindra'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna',
  'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar'
];

const states = [
  'MH', 'DL', 'KA', 'TG', 'TN', 'WB', 'GJ', 'RJ', 'UP', 'MP',
  'AP', 'OR', 'KL', 'AS', 'PB', 'HR', 'JH', 'BR', 'UK', 'HP'
];

// Generate random data helpers
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

// Indian first and last names for leads
const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Rohit', 'Anita', 'Vikash', 'Kavita',
  'Sunil', 'Meera', 'Ajay', 'Pooja', 'Ravi', 'Sunita', 'Manoj', 'Rekha',
  'Deepak', 'Neha', 'Sanjay', 'Geeta', 'Anil', 'Shweta', 'Vijay', 'Nisha',
  'Prakash', 'Ritu', 'Ashok', 'Seema', 'Raj', 'Kiran', 'Naveen', 'Preeti',
  'Sandeep', 'Asha', 'Rajeev', 'Suman', 'Arun', 'Madhuri', 'Vishal', 'Sonia',
  'Nitin', 'Vandana', 'Manish', 'Swati', 'Ramesh', 'Jyoti', 'Kamal', 'Sapna',
  'Pankaj', 'Bharti', 'Dinesh', 'Rakhi', 'Subhash', 'Mamta', 'Yogesh', 'Chhaya'
];

const lastNames = [
  'Sharma', 'Verma', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Pandey', 'Tiwari',
  'Jain', 'Yadav', 'Mishra', 'Patel', 'Shah', 'Sinha', 'Chauhan', 'Joshi',
  'Malhotra', 'Kapoor', 'Arora', 'Bansal', 'Chopra', 'Goel', 'Saxena', 'Bhatia',
  'Khanna', 'Mittal', 'Aggarwal', 'Rastogi', 'Srivastava', 'Tripathi', 'Chandra', 'Dubey',
  'Shukla', 'Thakur', 'Nair', 'Reddy', 'Iyer', 'Menon', 'Prasad', 'Rao',
  'Das', 'Ghosh', 'Sengupta', 'Mukherjee', 'Bhattacharya', 'Dutta', 'Roy', 'Bose'
];

const generateRandomLead = (userId, index) => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${getRandomElement(['gmail.com', 'outlook.com', 'yahoo.com', 'rediffmail.com', 'hotmail.com', 'company.co.in'])}`;
  
  // Generate more realistic lead values based on source and status
  const status = getRandomElement(statuses);
  const source = getRandomElement(sources);
  let leadValue = null;
  let score = getRandomNumber(20, 100);
  
  // Adjust lead value and score based on status and source (in Indian Rupees)
  if (status === 'WON') {
    leadValue = parseFloat(getRandomFloat(400000, 6000000)); // ₹4L - ₹60L
    score = getRandomNumber(80, 100);
  } else if (status === 'QUALIFIED') {
    leadValue = parseFloat(getRandomFloat(160000, 3200000)); // ₹1.6L - ₹32L
    score = getRandomNumber(60, 90);
  } else if (status === 'CONTACTED') {
    leadValue = parseFloat(getRandomFloat(80000, 2000000)); // ₹80K - ₹20L
    score = getRandomNumber(40, 80);
  } else if (status === 'NEW') {
    leadValue = parseFloat(getRandomFloat(40000, 1200000)); // ₹40K - ₹12L
    score = getRandomNumber(20, 70);
  } else { // LOST
    leadValue = parseFloat(getRandomFloat(8000, 400000)); // ₹8K - ₹4L
    score = getRandomNumber(0, 40);
  }

  return {
    firstName,
    lastName,
    email,
    phone: `+91 ${getRandomNumber(70000, 99999)}-${getRandomNumber(10000, 99999)}`,
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
      where: { email: 'admin@leadmanagement.co.in' },
      update: {},
      create: {
        email: 'admin@leadmanagement.co.in',
        password: hashedPassword,
        firstName: 'Rahul',
        lastName: 'Sharma'
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
    console.log('   Email: admin@leadmanagement.co.in');
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
