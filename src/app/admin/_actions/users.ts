"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { str } from "@/lib/utils";
import type { FormState } from "./shared";

const MIN_PASSWORD = 8;

export async function createUser(_prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const name = str(form, "name");
  const email = str(form, "email").toLowerCase();
  const password = str(form, "password");
  if (!name || !email) return { error: "Please enter a name and email." };
  if (password.length < MIN_PASSWORD) return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  if (await db.user.findUnique({ where: { email } })) return { error: "An admin with that email already exists." };

  await db.user.create({ data: { name, email, passwordHash: await bcrypt.hash(password, 10) } });
  revalidatePath("/admin/users");
  return { ok: `${name} can now log in.` };
}

export async function deleteUser(form: FormData) {
  const me = await requireAdmin();
  const id = Number(str(form, "id"));
  if (id === me.id) return; // can't delete yourself
  await db.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();

  const current = str(form, "current");
  const next = str(form, "password");
  const confirm = str(form, "confirm");
  if (next.length < MIN_PASSWORD) return { error: `New password must be at least ${MIN_PASSWORD} characters.` };
  if (next !== confirm) return { error: "The new passwords don't match." };

  const user = await db.user.findUniqueOrThrow({ where: { id: me.id } });
  if (!(await bcrypt.compare(current, user.passwordHash))) return { error: "Your current password is incorrect." };

  await db.user.update({ where: { id: me.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { ok: "Password changed." };
}

export async function updateProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const name = str(form, "name");
  if (!name) return { error: "Please enter your name." };
  await db.user.update({ where: { id: me.id }, data: { name } });
  revalidatePath("/admin", "layout");
  return { ok: "Profile updated." };
}
