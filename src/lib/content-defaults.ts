// Editable website content. Each key (settings, home, about, …) is stored as one JSON
// row in the Setting table; anything not saved yet falls back to these defaults.
// The `contentSchemas` below describe the dashboard form used to edit each key.

export type Field =
  | { name: string; label: string; type: "text" | "textarea" | "url" | "richtext"; help?: string }
  // aspect = width / height of the space on the website; photos are cropped to it on upload
  | { name: string; label: string; type: "image"; aspect?: number; help?: string }
  | { name: string; label: string; type: "strings"; help?: string }
  | { name: string; label: string; type: "group"; fields: Field[]; help?: string }
  | { name: string; label: string; type: "list"; fields: Field[]; itemLabel: string; help?: string };

const IMG = "/theme/images";

const CONTACT_IMAGE_HELP =
  "Shown in a fixed portrait (5:7) space so the box keeps its height. A cut-out PNG with a transparent background also works.";

const pageHeaderFields = (title: string): Field => ({
  name: "header",
  label: "Page banner",
  type: "group",
  fields: [
    { name: "title", label: `Banner title (default “${title}”)`, type: "text" },
    { name: "image", label: "Banner background image", type: "image", aspect: 3 },
  ],
});

const sectionTitleFields = (label: string): Field => ({
  name: "intro",
  label,
  type: "group",
  fields: [
    { name: "subtitle", label: "Small heading", type: "text" },
    { name: "title", label: "Main heading", type: "text" },
    { name: "text", label: "Intro text", type: "textarea" },
  ],
});

export const contentDefaults = {
  settings: {
    siteName: "AFENET",
    fullName: "African Field Epidemiology Network",
    logo: "/logo-white.png",
    footerLogo: "/logo-white.png",
    footerText:
      "A not-for-profit networking and service alliance dedicated to improving the health outcomes of communities across Africa.",
    phone: "+233 243 545 556",
    email: "info@afenet.net",
    address: "First Floor, JJ Plaza, Kisseman, Aggrey St, Accra",
    mapEmbedUrl: "https://www.google.com/maps?q=JJ+Plaza,+Aggrey+St,+Kisseman,+Accra,+Ghana&output=embed",
    socials: {
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: "",
      instagram: "",
    },
    copyright: "African Field Epidemiology Network. All Rights Reserved.",
  },

  home: {
    hero: {
      subtitle: "welcome to AFENET",
      title: "Strengthening public health systems across Africa",
      text: "We work with ministries of health and national, regional and international partners to build strong, effective and sustainable public health programs and capacity.",
      image: `${IMG}/hero-bg.jpg`,
      primaryText: "about us",
      primaryLink: "/about",
      secondaryText: "upcoming events",
      secondaryLink: "/events",
    },
    about: {
      subtitle: "who we are",
      title: "A network for healthier communities",
      text: "The African Field Epidemiology Network (AFENET) is a not-for-profit networking and service alliance organisation established in 2005, dedicated to improving the health outcomes of communities.",
      image: `${IMG}/about-us-img.png`,
      points: [
        "Present in 40 countries across Africa",
        "Partnering with ministries of health",
        "Supporting IDSR and IHR requirements",
      ],
      buttonText: "learn more",
      buttonLink: "/about",
    },
    whatWeDo: {
      subtitle: "what we do",
      title: "Our areas of focus",
      text: "Building strong, effective and sustainable programs and capacity to improve public health systems on the African continent and beyond.",
    },
    stats: [
      { value: "2005", suffix: "", label: "year AFENET was established" },
      { value: "40", suffix: "", label: "countries across Africa" },
      { value: "20", suffix: "+", label: "years strengthening health systems" },
      { value: "9", suffix: "", label: "strategic focus areas" },
    ],
    events: {
      subtitle: "events",
      title: "Upcoming events",
      text: "Conferences, trainings and meetings across our network.",
    },
    cta: {
      title: "Partner with us to advance global health security",
      text: "We collaborate with multilateral agencies, philanthropies, governments, academic institutions and NGOs. Get in touch to explore working together.",
      buttonText: "contact us",
      buttonLink: "/contact",
      image: `${IMG}/cta-box-img.png`,
    },
    news: {
      subtitle: "news & updates",
      title: "Latest news",
      text: "Stories, announcements and updates from across the network.",
    },
    contact: {
      subtitle: "contact us",
      title: "Get in touch with us",
      image: `${IMG}/contact-info-img.png`,
    },
  },

  about: {
    header: { title: "About Us", image: `${IMG}/page-header-bg.jpg` },
    whoWeAre: {
      subtitle: "who we are",
      title: "African Field Epidemiology Network",
      body: "The African Field Epidemiology Network (AFENET) is a not-for-profit networking and service alliance organisation established in 2005. We are dedicated to improving the health outcomes of communities through collaboration with ministries of health, national, regional and international partners. We strive to build strong, effective, sustainable programs and capacity to improve public health systems on the African continent and beyond, to ensure that they meet the requirements of the Integrated Disease Surveillance and Response (IDSR) strategy and the International Health Regulations (IHR).\n\nOver the years, AFENET has recorded a growing partnership base with various international and regional multilateral agencies, philanthropies, government agencies, academic institutions and non-governmental organisations (NGOs). We currently present in 40 countries spread across Africa. We are committed to expanding our coverage in Africa and beyond in the advancement of global health security.",
      image: `${IMG}/about-us-img.png`,
    },
    missionVision: [
      {
        title: "our mission",
        text: "To improve the health outcomes of communities by building strong, effective and sustainable public health programs and capacity, in collaboration with ministries of health and partners.",
      },
      {
        title: "our vision",
        text: "Healthy communities across Africa and beyond, protected by public health systems that meet the requirements of IDSR and the International Health Regulations.",
      },
      {
        title: "our values",
        text: "Collaboration, excellence, integrity and accountability in everything we do with our partners and the communities we serve.",
      },
    ],
    whatWeDo: {
      subtitle: "what we do",
      title: "Our strategic focus areas",
      text: "We work across nine areas to strengthen public health on the African continent and beyond.",
      items: [
        "Strengthen public health surveillance, emergency preparedness, response, and recovery",
        "Strengthen Public Health Laboratory Systems",
        "Strengthen prevention, detection and management of non-communicable diseases",
        "Promote Universal Health Coverage (UHC)",
        "Advance the One Health approach and climate change mitigation",
        "Promote research, innovation, publication and networking",
        "Human Resource Management",
        "Public Health Logistics Management",
        "Fund Management",
      ],
    },
    team: {
      subtitle: "our team",
      title: "Meet the people behind AFENET",
      text: "A dedicated team working with partners across the continent.",
    },
    cta: {
      title: "Let's advance global health security together",
      text: "Partner with AFENET to strengthen public health systems across Africa and beyond.",
      buttonText: "contact us",
      buttonLink: "/contact",
      image: `${IMG}/cta-box-img.png`,
    },
  },

  events: {
    header: { title: "Events", image: `${IMG}/page-header-bg.jpg` },
  },

  news: {
    header: { title: "News", image: `${IMG}/page-header-bg.jpg` },
  },

  team: {
    header: { title: "Our Team", image: `${IMG}/page-header-bg.jpg` },
    intro: {
      subtitle: "our team",
      title: "Meet the people behind AFENET",
      text: "",
    },
  },

  privacy: {
    header: { title: "Privacy Policy", image: `${IMG}/page-header-bg.jpg` },
    lastUpdated: "October 2026",
    body: '<p><em>Draft — please have this reviewed and replaced with AFENET&#39;s official policy.</em></p><p>The African Field Epidemiology Network (AFENET) respects your privacy. This policy explains what information this website collects and how it is used.</p><h2>Information we collect</h2><ul><li><strong>Contact form:</strong> your name, email address, phone number (optional), subject and message, when you choose to send them to us.</li><li><strong>Technical data:</strong> standard server logs (such as your IP address and browser type) kept by our hosting provider for security and reliability.</li></ul><h2>How we use it</h2><p>We use the information you send only to respond to your enquiry. We do not sell or rent your personal information to anyone.</p><h2>Cookies</h2><p>This website does not use advertising or tracking cookies. A single essential cookie is used only when staff log in to manage the website.</p><h2>How long we keep it</h2><p>Messages are kept for as long as needed to handle your enquiry and are then deleted.</p><h2>Your rights</h2><p>You can ask us to see, correct or delete the personal information we hold about you by contacting us using the details on our Contact page.</p>',
  },

  terms: {
    header: { title: "Terms of Use", image: `${IMG}/page-header-bg.jpg` },
    lastUpdated: "October 2026",
    body: '<p><em>Draft — please have this reviewed and replaced with AFENET&#39;s official terms.</em></p><p>By using this website you agree to these terms.</p><h2>Use of content</h2><p>The content on this website is provided for general information about the African Field Epidemiology Network (AFENET) and its work. You may share it for non-commercial purposes with credit to AFENET. Logos and images may not be reused without permission.</p><h2>Accuracy</h2><p>We work to keep information accurate and up to date, but we cannot guarantee that everything on the website is complete or current. It is not medical advice.</p><h2>Links to other websites</h2><p>This website may link to websites run by other organisations. AFENET is not responsible for their content or privacy practices.</p><h2>Changes</h2><p>We may update these terms from time to time. The latest version will always be on this page.</p><h2>Contact</h2><p>Questions about these terms can be sent to us using the details on our Contact page.</p>',
  },

  contact: {
    header: { title: "Contact Us", image: `${IMG}/page-header-bg.jpg` },
    form: {
      title: "Ready to get started? let's chat.",
      text: "Please fill out the form below, and a member of our team will get back to you as soon as possible.",
      image: `${IMG}/contact-info-img.png`,
    },
  },
};

export type ContentKey = keyof typeof contentDefaults;
export type Content<K extends ContentKey> = (typeof contentDefaults)[K];

const ctaFields: Field = {
  name: "cta",
  label: "Call-to-action banner",
  type: "group",
  fields: [
    { name: "title", label: "Heading", type: "text" },
    { name: "text", label: "Text", type: "textarea" },
    { name: "buttonText", label: "Button text", type: "text" },
    { name: "buttonLink", label: "Button link", type: "url" },
    { name: "image", label: "Side image", type: "image", help: "Works best as a cut-out PNG with a transparent background." },
  ],
};

export const contentSchemas: Record<ContentKey, { title: string; description: string; fields: Field[] }> = {
  settings: {
    title: "Site settings",
    description: "Logo, contact details and social links used across the whole website.",
    fields: [
      { name: "siteName", label: "Short name", type: "text" },
      { name: "fullName", label: "Full organisation name", type: "text" },
      { name: "logo", label: "Header logo (light, shown on dark backgrounds)", type: "image" },
      { name: "footerLogo", label: "Footer logo", type: "image" },
      { name: "footerText", label: "Footer description", type: "textarea" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "text" },
      { name: "address", label: "Address", type: "textarea" },
      {
        name: "mapEmbedUrl",
        label: "Google Maps embed URL",
        type: "url",
        help: "In Google Maps: Share → Embed a map → copy only the src=\"…\" link.",
      },
      {
        name: "socials",
        label: "Social media links",
        type: "group",
        help: "Leave a field empty to hide that icon.",
        fields: [
          { name: "facebook", label: "Facebook", type: "url" },
          { name: "twitter", label: "X (Twitter)", type: "url" },
          { name: "linkedin", label: "LinkedIn", type: "url" },
          { name: "youtube", label: "YouTube", type: "url" },
          { name: "instagram", label: "Instagram", type: "url" },
        ],
      },
      { name: "copyright", label: "Copyright text (the year is added automatically)", type: "text" },
    ],
  },

  home: {
    title: "Home page",
    description: "Hero banner and section headings on the home page.",
    fields: [
      {
        name: "hero",
        label: "Hero banner",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "image", label: "Background image", type: "image", aspect: 16 / 9 },
          { name: "primaryText", label: "First button text", type: "text" },
          { name: "primaryLink", label: "First button link", type: "url" },
          { name: "secondaryText", label: "Second button text", type: "text" },
          { name: "secondaryLink", label: "Second button link", type: "url" },
        ],
      },
      {
        name: "about",
        label: "About section",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "image", label: "Image", type: "image", aspect: 7 / 8 },
          { name: "points", label: "Bullet points", type: "strings" },
          { name: "buttonText", label: "Button text", type: "text" },
          { name: "buttonLink", label: "Button link", type: "url" },
        ],
      },
      {
        name: "whatWeDo",
        label: "What we do section",
        type: "group",
        help: "The list of focus areas itself is edited on the About page content.",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Intro text", type: "textarea" },
        ],
      },
      {
        name: "stats",
        label: "Numbers / statistics",
        type: "list",
        itemLabel: "Statistic",
        fields: [
          { name: "value", label: "Number", type: "text" },
          { name: "suffix", label: "Suffix (e.g. + or %)", type: "text" },
          { name: "label", label: "Label", type: "text" },
        ],
      },
      {
        name: "events",
        label: "Events section",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Intro text", type: "textarea" },
        ],
      },
      ctaFields,
      {
        name: "news",
        label: "News section",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Intro text", type: "textarea" },
        ],
      },
      {
        name: "contact",
        label: "Contact section",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "image", label: "Image in the dark contact box", type: "image", aspect: 5 / 7, help: CONTACT_IMAGE_HELP },
        ],
      },
    ],
  },

  about: {
    title: "About Us page",
    description: "Who we are, mission, vision, values and the list of focus areas.",
    fields: [
      pageHeaderFields("About Us"),
      {
        name: "whoWeAre",
        label: "Who we are",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "body", label: "Text (leave a blank line between paragraphs)", type: "textarea" },
          { name: "image", label: "Image", type: "image", aspect: 7 / 8 },
        ],
      },
      {
        name: "missionVision",
        label: "Mission, vision & values",
        type: "list",
        itemLabel: "Card",
        fields: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
      {
        name: "whatWeDo",
        label: "What we do",
        type: "group",
        help: "These focus areas are also shown on the home page.",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Intro text", type: "textarea" },
          { name: "items", label: "Focus areas", type: "strings" },
        ],
      },
      {
        name: "team",
        label: "Team preview section",
        type: "group",
        fields: [
          { name: "subtitle", label: "Small heading", type: "text" },
          { name: "title", label: "Main heading", type: "text" },
          { name: "text", label: "Intro text", type: "textarea" },
        ],
      },
      ctaFields,
    ],
  },

  events: {
    title: "Events page",
    description: "Banner for the Events page — also used on every event's own page.",
    fields: [pageHeaderFields("Events")],
  },

  news: {
    title: "News page",
    description: "Banner for the News page — also used on every article's own page.",
    fields: [pageHeaderFields("News")],
  },

  team: {
    title: "Our Team page",
    description: "Banner and intro for the team page — the banner is also used on each team member's page.",
    fields: [pageHeaderFields("Our Team"), sectionTitleFields("Intro")],
  },

  privacy: {
    title: "Privacy Policy",
    description: "The privacy policy page linked in the footer.",
    fields: [
      pageHeaderFields("Privacy Policy"),
      { name: "lastUpdated", label: "Last updated (shown under the title)", type: "text" },
      { name: "body", label: "Page text", type: "richtext" },
    ],
  },

  terms: {
    title: "Terms of Use",
    description: "The terms of use page linked in the footer.",
    fields: [
      pageHeaderFields("Terms of Use"),
      { name: "lastUpdated", label: "Last updated (shown under the title)", type: "text" },
      { name: "body", label: "Page text", type: "richtext" },
    ],
  },

  contact: {
    title: "Contact Us page",
    description: "Banner and form text. Phone, email and address are in Site settings.",
    fields: [
      pageHeaderFields("Contact Us"),
      {
        name: "form",
        label: "Contact form",
        type: "group",
        fields: [
          { name: "title", label: "Heading", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "image", label: "Image in the dark side box", type: "image", aspect: 5 / 7, help: CONTACT_IMAGE_HELP },
        ],
      },
    ],
  },
};

export const contentKeys = Object.keys(contentDefaults) as ContentKey[];

export function isContentKey(key: string): key is ContentKey {
  return key in contentDefaults;
}
