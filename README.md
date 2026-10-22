# AFENET Website

Next.js + MySQL website for the African Field Epidemiology Network, with a built-in dashboard (CMS).

## Run it locally

```bash
npm run db:up        # start MySQL (Docker Desktop must be open)
npm run dev          # start the site at http://localhost:3000
```

First time only:

```bash
npm install
npm run db:migrate   # create the tables
npm run db:seed      # create the first admin + sample content
```

## Dashboard

Go to http://localhost:3000/admin and log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `.env`
(change the password under **My account** after the first login).

| Section        | What it controls                                                   |
| -------------- | ------------------------------------------------------------------ |
| News           | Articles on /news and the home page                                |
| Events         | Upcoming / past events on /events and the home page                |
| Team           | People on /team and the About page                                 |
| Page content   | Headings, text, images and lists on every page                     |
| Messages       | Submissions from the contact forms                                 |
| Site settings  | Logo, phone, email, address, map and social links                  |
| Admin users    | Who can log in to the dashboard                                    |

## Where things live

- `src/app/(site)/` — public pages (Home, About, Events, News, Team, Contact)
- `src/app/admin/` — dashboard pages and server actions (`_actions/`)
- `src/lib/content-defaults.ts` — default page text and the fields each page has in the dashboard
- `prisma/schema.prisma` — database tables
- `public/theme/` — the Builtup theme's CSS, JS, fonts and images (`afenet.css` / `admin.css` are our additions)
- `uploads/` — images uploaded in the dashboard (not committed to git; back this folder up)
