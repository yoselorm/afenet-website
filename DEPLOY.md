# Deploying the AFENET website

The app runs anywhere Node.js 20+ runs. Two setups are supported without code changes:

| | Vercel + Aiven (demo / cloud) | Single server (e.g. GoDaddy VPS) |
|---|---|---|
| App | Vercel | `npm run build && npm start` on the server |
| Database | Aiven MySQL | MySQL on the server |
| Uploaded images | Vercel Blob (`BLOB_STORE_ID` or `BLOB_READ_WRITE_TOKEN` set) | `uploads/` folder (neither set) |

---

## Vercel + Aiven

### 1. Create the database (Aiven)
1. Sign up at https://aiven.io → **Create service** → **MySQL** → **Free plan**. Pick a region (note it — see step 6).
2. When the service is *Running*, on its **Overview** page copy:
   - **Service URI** — looks like `mysql://avnadmin:PASSWORD@mysql-xxxx.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED`
   - **CA certificate** — click *Show* / *Download* (`ca.pem`)
3. Change the end of the URI from `?ssl-mode=REQUIRED` to `?sslaccept=accept_invalid_certs`
   (Prisma's spelling for "use SSL"; the app still verifies the server using the CA certificate).

### 2. Create the Vercel project
In a terminal, inside `afenet-website/`:
```bash
npx vercel login      # opens the browser to sign in
npx vercel link       # answer the questions; creates the project
```

### 3. Create image storage (Vercel Blob)
Vercel dashboard → your project → **Storage** → **Create** → **Blob** → connect it to the project.
Choose **Public** access (images must be viewable by visitors). Connecting it adds `BLOB_STORE_ID`
(or, for older stores, `BLOB_READ_WRITE_TOKEN`) to the project automatically — the site works with either.
For the move script below you also need the store's read-write token (Storage → your store → `.env.local` tab).

### 4. Copy the local website to the cloud
Create `afenet-website/.env.cloud` (it is git-ignored):
```
CLOUD_DATABASE_URL="mysql://avnadmin:PASSWORD@mysql-xxxx.aivencloud.com:12345/defaultdb?sslaccept=accept_invalid_certs"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
DATABASE_CA_CERT="-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----"
```
(For `DATABASE_CA_CERT`, paste `ca.pem` as one line with `\n` between lines — or leave it out for a demo.)

Then, with the local database running (`npm run db:up`):
```bash
npm run move-to-cloud
```
It creates the tables on Aiven, copies all content and admin users, and uploads every image to Blob.

### 5. Set the environment variables on Vercel
Vercel dashboard → project → **Settings → Environment Variables** (Production and Preview):

| Name | Value |
|---|---|
| `DATABASE_URL` | the same value as `CLOUD_DATABASE_URL` |
| `DATABASE_CA_CERT` | the CA certificate (paste the whole `ca.pem` contents) |
| `AUTH_SECRET` | a **new** random value: `openssl rand -base64 32` |
| `BLOB_STORE_ID` / `BLOB_READ_WRITE_TOKEN` | already added in step 3 |

### 6. Deploy
```bash
npx vercel --prod
```
Each deploy runs `prisma migrate deploy` first (the `vercel-build` script), so database changes go live with the code.

Tip: set the Vercel function region close to the Aiven region (project → Settings → Functions → Region) so pages load fast.

### Custom domain (GoDaddy DNS)
Vercel project → **Settings → Domains** → add the domain, then add the records Vercel shows in GoDaddy's DNS.
**Only change the website records (`A` / `CNAME`) — leave the `MX` records alone** so email keeps working.

---

## Moving to a single server later (e.g. GoDaddy VPS)
1. Install Node.js 20+ and MySQL on the server; create a database.
2. Copy the project, create `.env` with `DATABASE_URL`, `AUTH_SECRET` (no `BLOB_READ_WRITE_TOKEN`).
3. `npm ci && npx prisma migrate deploy && npm run build && npm start` (keep it running with `pm2`, behind nginx for HTTPS).
4. Move the data with `mysqldump` from Aiven into the server's MySQL. Images already on Vercel Blob keep working
   from their URLs; new uploads are saved to the server's `uploads/` folder (back it up).
