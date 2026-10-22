import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Reads DATABASE_URL, e.g. mysql://user:pass@host:3306/afenet
// Hosted databases (Aiven, etc.) need an encrypted connection: add ?sslaccept=accept_invalid_certs
// (a Prisma URL option, so migrations work too). When the provider's CA certificate is in
// DATABASE_CA_CERT, the website also verifies the server's identity with it.
export function createClient(connectionString = process.env.DATABASE_URL!) {
  const url = new URL(connectionString);
  const sslaccept = url.searchParams.get("sslaccept");
  const ca = process.env.DATABASE_CA_CERT?.replace(/\\n/g, "\n");

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    // Serverless hosts open many short-lived instances, so keep each one's pool small
    connectionLimit: Number(process.env.DATABASE_POOL_SIZE) || 5,
    ssl: sslaccept ? { ca, rejectUnauthorized: Boolean(ca) || sslaccept === "strict" } : undefined,
    // MySQL 8 password login over an unencrypted local connection needs the server's public key
    allowPublicKeyRetrieval: !sslaccept,
  });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot reloads in development
export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
