"use server";

import { db } from "@/lib/db";
import { str } from "@/lib/utils";

export type ContactState = { ok: boolean; message: string } | null;

// Public contact form. Saved messages appear in the dashboard inbox.
export async function submitContact(_prev: ContactState, form: FormData): Promise<ContactState> {
  // Hidden field that only bots fill in
  if (str(form, "company")) return { ok: true, message: "Message sent successfully!" };

  const name = str(form, "name");
  const email = str(form, "email");
  const phone = str(form, "phone");
  const subject = str(form, "subject");
  const message = str(form, "message");

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in your name, email and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }
  if (name.length > 120 || email.length > 255 || phone.length > 40 || subject.length > 200 || message.length > 5000) {
    return { ok: false, message: "One of the fields is too long." };
  }

  await db.contactMessage.create({
    data: { name, email, phone: phone || null, subject: subject || null, message },
  });

  return { ok: true, message: "Message sent successfully! We will get back to you soon." };
}
