const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const doctorsData = [
  { name: 'Dr. Priya Sharma', specialization: 'Dermatology', email: 'priya.sharma@queuecure.ai', password: 'password123' },
  { name: 'Dr. Arjun Kumar', specialization: 'Cardiology', email: 'arjun.kumar@queuecure.ai', password: 'password123' },
  { name: 'Dr. Meera Nair', specialization: 'Gynecology', email: 'meera.nair@queuecure.ai', password: 'password123' },
  { name: 'Dr. Rajan Iyer', specialization: 'Neurology', email: 'rajan.iyer@queuecure.ai', password: 'password123' },
  { name: 'Dr. Amit Verma', specialization: 'Orthopedics', email: 'amit.verma@queuecure.ai', password: 'password123' },
  { name: 'Dr. Neha Gupta', specialization: 'Pediatrics', email: 'neha.gupta@queuecure.ai', password: 'password123' },
  { name: 'Dr. Vikram Singh', specialization: 'ENT', email: 'vikram.singh@queuecure.ai', password: 'password123' },
  { name: 'Dr. Kavya Rao', specialization: 'General Medicine', email: 'kavya.rao@queuecure.ai', password: 'password123' }
];

async function main() {
  console.log('Seeding Database...');
  
  // Create default roles if needed, or directly create users
  for (const doc of doctorsData) {
    const hashedPassword = await bcrypt.hash(doc.password, 10);
    
    // Create User account
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        role: 'DOCTOR'
      }
    });

    // Create Doctor Profile
    await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        name: doc.name,
        specialization: doc.specialization,
        email: doc.email
      }
    });

    console.log(`Created Doctor: ${doc.name}`);
  }

  // Create mock Reception, Pharmacy, Lab accounts
  const systemAccounts = [
    { name: 'Receptionist Admin', email: 'reception@queuecure.ai', role: 'RECEPTION' },
    { name: 'Pharmacy Desk', email: 'pharmacy@queuecure.ai', role: 'PHARMACY' },
    { name: 'Central Lab', email: 'lab@queuecure.ai', role: 'LAB' }
  ];

  for (const acc of systemAccounts) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {},
      create: {
        name: acc.name,
        email: acc.email,
        password: hashedPassword,
        role: acc.role
      }
    });
    console.log(`Created System Account: ${acc.name}`);
  }

  console.log('Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
