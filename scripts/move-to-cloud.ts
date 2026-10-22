// Copies the local website (database + uploaded images) to the hosted setup:
// a cloud MySQL database (e.g. Aiven) and Vercel Blob for images.
//
// 1. Fill in .env.cloud (see DEPLOY.md)
// 2. npm run move-to-cloud
//
// Safe to re-run: it stops if the cloud database already has content (use --force to overwrite).
import "dotenv/config"; // must be first: loads the local DATABASE_URL before db.ts runs
import { config } from "dotenv";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { createClient } from "../src/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const TYPES: Record<string, string> = { ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };

const cloud = config({ path: ".env.cloud", override: false }).parsed ?? {};

const CLOUD_URL = cloud.CLOUD_DATABASE_URL;
const BLOB_TOKEN = cloud.BLOB_READ_WRITE_TOKEN;
if (!CLOUD_URL || !BLOB_TOKEN) {
  console.error("Missing CLOUD_DATABASE_URL or BLOB_READ_WRITE_TOKEN in .env.cloud (see DEPLOY.md)");
  process.exit(1);
}
if (cloud.DATABASE_CA_CERT) process.env.DATABASE_CA_CERT = cloud.DATABASE_CA_CERT;

const force = process.argv.includes("--force");

async function main() {
  console.log("1/4  Creating tables in the cloud database…");
  execSync("npx prisma migrate deploy", { stdio: "inherit", env: { ...process.env, DATABASE_URL: CLOUD_URL } });

  const local = createClient(process.env.DATABASE_URL);
  const remote = createClient(CLOUD_URL);

  const existing = (await remote.newsPost.count()) + (await remote.setting.count()) + (await remote.user.count());
  if (existing > 0 && !force) {
    console.error("The cloud database already has content. Re-run with --force to replace it.");
    process.exit(1);
  }

  console.log("2/4  Uploading images to Vercel Blob…");
  const urlMap = new Map<string, string>();
  async function moveUploads(text: string) {
    for (const match of text.match(/\/uploads\/[\w./-]+\.(?:jpg|png|webp|gif|svg)/g) ?? []) {
      if (urlMap.has(match)) continue;
      const relative = match.replace(/^\/uploads\//, "");
      const data = await readFile(path.join(UPLOAD_DIR, relative));
      const blob = await put(`uploads/${relative}`, data, {
        access: "public",
        contentType: TYPES[path.extname(relative)],
        addRandomSuffix: false,
        allowOverwrite: true,
        token: BLOB_TOKEN,
      });
      urlMap.set(match, blob.url);
      console.log(`     ${match} → ${blob.url}`);
    }
  }
  const swap = <T>(value: T): T => {
    let text = JSON.stringify(value);
    for (const [from, to] of urlMap) text = text.split(from).join(to);
    return JSON.parse(text);
  };

  const [users, news, events, team, messages, settings] = await Promise.all([
    local.user.findMany(),
    local.newsPost.findMany(),
    local.event.findMany(),
    local.teamMember.findMany(),
    local.contactMessage.findMany(),
    local.setting.findMany(),
  ]);
  await moveUploads(JSON.stringify([news, events, team, settings]));

  console.log("3/4  Copying content…");
  await remote.$transaction([
    remote.contactMessage.deleteMany(),
    remote.setting.deleteMany(),
    remote.teamMember.deleteMany(),
    remote.event.deleteMany(),
    remote.newsPost.deleteMany(),
    remote.user.deleteMany(),
    remote.user.createMany({ data: users }),
    remote.newsPost.createMany({ data: swap(news) }),
    remote.event.createMany({ data: swap(events) }),
    remote.teamMember.createMany({ data: swap(team) }),
    remote.contactMessage.createMany({ data: messages }),
    ...settings.map((s) => remote.setting.create({ data: { key: s.key, value: swap(s.value) ?? {} } })),
  ]);

  console.log(
    `4/4  Done: ${users.length} admin users, ${news.length} news posts, ${events.length} events, ` +
      `${team.length} team members, ${messages.length} messages, ${settings.length} page settings, ${urlMap.size} images.`,
  );
  await Promise.all([local.$disconnect(), remote.$disconnect()]);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
