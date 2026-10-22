"use client";

import { useActionState } from "react";
import { changePassword, createUser, updateProfile } from "../../_actions/users";
import type { FormState } from "../../_actions/shared";
import { FormMessage, SubmitButton } from "@/components/admin/FormBits";

export function AddUserForm() {
  const [state, action] = useActionState<FormState, FormData>(createUser, null);
  return (
    <form action={action}>
      <FormMessage state={state} />
      <div className="mb-3">
        <label className="form-label" htmlFor="name">Name</label>
        <input id="name" name="name" className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="form-control" required />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="password">Temporary password</label>
        <input id="password" name="password" type="text" className="form-control" minLength={8} required autoComplete="off" />
        <div className="form-text">At least 8 characters. Share it with them privately; they can change it under My account.</div>
      </div>
      <SubmitButton>Add admin</SubmitButton>
    </form>
  );
}

export function ProfileForm({ name }: { name: string }) {
  const [state, action] = useActionState<FormState, FormData>(updateProfile, null);
  return (
    <form action={action}>
      <FormMessage state={state} />
      <div className="mb-3">
        <label className="form-label" htmlFor="profile-name">Your name</label>
        <input id="profile-name" name="name" className="form-control" defaultValue={name} required />
      </div>
      <SubmitButton>Save</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState<FormState, FormData>(changePassword, null);
  return (
    <form action={action}>
      <FormMessage state={state} />
      <div className="mb-3">
        <label className="form-label" htmlFor="current">Current password</label>
        <input id="current" name="current" type="password" className="form-control" autoComplete="current-password" required />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="new-password">New password</label>
        <input id="new-password" name="password" type="password" className="form-control" minLength={8} autoComplete="new-password" required />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="confirm">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" className="form-control" minLength={8} autoComplete="new-password" required />
      </div>
      <SubmitButton>Change password</SubmitButton>
    </form>
  );
}
