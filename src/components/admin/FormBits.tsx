"use client";

import { startTransition, useEffect } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/_actions/shared";
import { toast } from "./Toaster";

// Submits without React's automatic form reset, so typed values survive a validation error
export function submitWithoutReset(formAction: (form: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    startTransition(() => formAction(form));
  };
}

export function SubmitButton({
  children = "Save",
  className = "btn btn-primary",
  pending: pendingProp,
}: {
  children?: React.ReactNode;
  className?: string;
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Saving…
        </>
      ) : (
        children
      )}
    </button>
  );
}

// Success → a toast that disappears; error → a banner that stays so it can be read
export function FormMessage({ state }: { state: FormState }) {
  useEffect(() => {
    if (state?.ok) toast(state.ok);
  }, [state]);

  if (state?.error) {
    return (
      <div className="alert alert-danger d-flex gap-2 align-items-start" role="alert">
        <i className="fa-solid fa-circle-exclamation mt-1"></i>
        <span>{state.error}</span>
      </div>
    );
  }
  return null;
}

// A form whose button asks "Are you sure?" before running a destructive action
export function ConfirmForm({
  action,
  id,
  message = "Are you sure? This cannot be undone.",
  children,
  className = "btn btn-outline-danger btn-sm",
  extra,
}: {
  action: (form: FormData) => Promise<void>;
  id: number;
  message?: string;
  children: React.ReactNode;
  className?: string;
  extra?: Record<string, string>;
}) {
  return (
    <form
      action={action}
      className="d-inline"
      onSubmit={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      {extra && Object.entries(extra).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
