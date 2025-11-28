import * as bcrypt from 'bcrypt';

async function generateAdminPassword() {
  const password = process.argv[2] || 'Admin@123';
  const hash = await bcrypt.hash(password, 12);
  
  console.log('\n=== Admin User Setup ===\n');
  console.log('Password:', password);
  console.log('Bcrypt Hash:', hash);
  console.log('\nSQL to create admin user:\n');
  console.log(`INSERT INTO users (id, email, password, role, "firstName", "lastName", "createdAt", "updatedAt")`);
  console.log(`VALUES (`);
  console.log(`  gen_random_uuid(),`);
  console.log(`  'admin@multipoles.com',`);
  console.log(`  '${hash}',`);
  console.log(`  'ADMIN',`);
  console.log(`  'Admin',`);
  console.log(`  'User',`);
  console.log(`  NOW(),`);
  console.log(`  NOW()`);
  console.log(`);`);
  console.log('\n');
}

generateAdminPassword().catch(console.error);
