/**
 * scripts/migrate.ts
 * Run with: npx ts-node scripts/migrate.ts
 * Or use: npm run db:push (which calls drizzle-kit push directly)
 */
import { execSync } from 'child_process';

console.log('🔄 Running database migration (drizzle-kit push)...');
try {
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  console.log('✅ Database schema pushed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error);
  process.exit(1);
}
