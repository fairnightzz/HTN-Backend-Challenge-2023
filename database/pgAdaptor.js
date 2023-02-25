
import dotenv from 'dotenv'
import pgPromise from 'pg-promise'
dotenv.config()

const pgp = pgPromise({})

// Load all the config (postgres connection, secrets, etc)
const config = {
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
}

// Connect to database
export const db = pgp(config)
