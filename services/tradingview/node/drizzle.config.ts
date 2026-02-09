import { defineConfig } from 'drizzle-kit'
import config from './src/config'

export default defineConfig({
    out: './drizzle',
    schema: './src/schema/*',
    dialect: 'postgresql',
    migrations: {
        table: '_migrations',
        schema: 'public',
    },
    dbCredentials: {
        ...config.postgres,
        ssl: false,
    }
})