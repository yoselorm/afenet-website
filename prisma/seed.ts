// Creates the first dashboard admin and some sample content.
// Run with: npm run db:seed   (safe to run more than once)
import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";

const IMG = "/theme/images";

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d;
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@afenet.net";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  if (!(await db.user.findUnique({ where: { email } }))) {
    await db.user.create({
      data: { name: "Administrator", email, passwordHash: await bcrypt.hash(password, 10) },
    });
    console.log(`Created admin user ${email}`);
  } else {
    console.log(`Admin user ${email} already exists`);
  }

  if ((await db.newsPost.count()) === 0) {
    await db.newsPost.createMany({
      data: [
        {
          title: "Welcome to the new AFENET website",
          slug: "welcome-to-the-new-afenet-website",
          excerpt: "Our new website makes it easier to follow our work, events and news from across the network.",
          content:
            "<p>We are pleased to launch the new AFENET website. Here you will find the latest news, upcoming events and information about our work strengthening public health systems across Africa.</p><h2>What you will find</h2><ul><li>News and updates from across the network</li><li>Upcoming conferences, trainings and meetings</li><li>Information about our team and focus areas</li></ul><p>This is sample content — edit or delete it in the dashboard.</p>",
          coverImage: `${IMG}/post-1.jpg`,
          author: "AFENET",
          tags: "announcement",
          published: true,
          publishedAt: daysFromNow(-2),
        },
        {
          title: "Sample news article: strengthening laboratory systems",
          slug: "sample-strengthening-laboratory-systems",
          excerpt: "A sample article showing how news posts appear on the website.",
          content:
            "<p>This is a sample news article. Use the dashboard to replace it with real news from the network.</p><blockquote><p>Quotes are styled automatically by the theme.</p></blockquote><p>You can add headings, lists, links and images using the editor.</p>",
          coverImage: `${IMG}/post-2.jpg`,
          author: "AFENET",
          tags: "laboratory, sample",
          published: true,
          publishedAt: daysFromNow(-10),
        },
        {
          title: "Sample news article: One Health in practice",
          slug: "sample-one-health-in-practice",
          excerpt: "Another sample article for the news section.",
          content: "<p>This is a sample news article. Edit or delete it in the dashboard.</p>",
          coverImage: `${IMG}/post-3.jpg`,
          author: "AFENET",
          tags: "one health, sample",
          published: true,
          publishedAt: daysFromNow(-20),
        },
      ],
    });
    console.log("Added sample news");
  }

  if ((await db.event.count()) === 0) {
    await db.event.createMany({
      data: [
        {
          title: "Sample event: Regional surveillance workshop",
          slug: "sample-regional-surveillance-workshop",
          summary: "A sample upcoming event to show how events appear on the website.",
          content: "<p>This is a sample event. Edit or delete it in the dashboard.</p>",
          coverImage: `${IMG}/our-project-1.jpg`,
          location: "Kampala, Uganda",
          startDate: daysFromNow(21),
          endDate: daysFromNow(23),
          published: true,
        },
        {
          title: "Sample event: Laboratory systems webinar",
          slug: "sample-laboratory-systems-webinar",
          summary: "An online session — another sample event.",
          content: "<p>This is a sample event. Edit or delete it in the dashboard.</p>",
          coverImage: `${IMG}/our-project-2.jpg`,
          location: "Online",
          startDate: daysFromNow(40),
          published: true,
        },
        {
          title: "Sample event: Annual partners meeting",
          slug: "sample-annual-partners-meeting",
          summary: "A sample past event.",
          content: "<p>This is a sample past event. Edit or delete it in the dashboard.</p>",
          coverImage: `${IMG}/our-project-3.jpg`,
          location: "Kampala, Uganda",
          startDate: daysFromNow(-30),
          published: true,
        },
      ],
    });
    console.log("Added sample events");
  }

  if ((await db.teamMember.count()) === 0) {
    await db.teamMember.createMany({
      data: [1, 2, 3].map((n) => ({
        name: `Sample Team Member ${n}`,
        position: ["Executive Director", "Programme Manager", "Communications Officer"][n - 1],
        category: "Secretariat",
        photo: `${IMG}/team-${n}.jpg`,
        bio: "This is a sample team member. Replace the name, photo and bio in the dashboard.",
        sortOrder: n,
      })),
    });
    console.log("Added sample team members");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
