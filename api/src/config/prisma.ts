import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL!;

const databaseFile = databaseUrl.replace("file:./", "");

const databasePath = path.resolve(
  process.cwd(),
  "prisma",
  databaseFile
);

const adapter = new PrismaBetterSqlite3({
  url: `file:${databasePath}`,
});

const prisma = new PrismaClient({
  adapter
});

export default prisma;