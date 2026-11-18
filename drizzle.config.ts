import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load variables from your .env file
dotenv.config({ path: '.env' });

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ['!pg_stat_monitor*', '!pg_stat_statements*'],
});