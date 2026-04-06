import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../config/config";

const connectionString = config.dbUrl || process.env.DATABASE_URL || process.env.POSTGRESQL_ADDON_URI;

if (!connectionString) {
	throw new Error("Database connection string is missing. Set DB_URL or DATABASE_URL in your environment.");
}

const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
