"use client";

import { useActionState } from "react";
import { login } from "../_actions/auth";
import type { FormState } from "../_actions/shared";
import { FormMessage, SubmitButton, submitWithoutReset } from "@/components/admin/FormBits";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, null);
  return (
    <form onSubmit={submitWithoutReset(action)}>
      <FormMessage state={state} />
      <div className="mb-3">
        <label className="form-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="form-control form-control-lg" autoComplete="username" required autoFocus />
      </div>
      <div className="mb-4">
        <label className="form-label" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" className="form-control form-control-lg" autoComplete="current-password" required />
      </div>
      <SubmitButton className="btn btn-primary btn-lg w-100" pending={pending}>
        Log in
      </SubmitButton>
    </form>
  );
}
