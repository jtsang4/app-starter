import 'dotenv/config';
import { db } from './index';
import { usersTable } from './schema';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create a default user for seeding
    const [defaultUser] = await db
      .insert(usersTable)
      .values({
        name: 'System Admin',
        email: 'admin@admin.com',
        emailVerified: true,
        isActive: true,
      })
      .onConflictDoNothing()
      .returning();

    console.log('✅ Default user created');

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seed().then(() => {
  console.log('✅ Seeding finished');
  process.exit(0);
});
