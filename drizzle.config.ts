import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://placeholder-url',
  },
  tablesFilter: ['!pg_stat_monitor*', '!pg_stat_statements*'],
});
