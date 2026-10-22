"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContact, type ContactState } from "@/app/actions";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action}>
      <div className="row">
        <div className="form-group col-md-6 mb-4">
          <input type="text" name="name" className="form-control" placeholder="Enter your name" required maxLength={120} />
        </div>
        <div className="form-group col-md-6 mb-4">
          <input type="email" name="email" className="form-control" placeholder="Enter your email" required maxLength={255} />
        </div>
        <div className="form-group col-md-6 mb-4">
          <input type="text" name="phone" className="form-control" placeholder="Phone number" maxLength={40} />
        </div>
        <div className="form-group col-md-6 mb-4">
          <input type="text" name="subject" className="form-control" placeholder="Subject" maxLength={200} />
        </div>
        <div className="form-group col-md-12 mb-5">
          <textarea name="message" className="form-control" rows={4} placeholder="Message" required maxLength={5000}></textarea>
        </div>
        {/* Honeypot: hidden from people, catches spam bots */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="d-none" aria-hidden="true" />
        <div className="col-md-12">
          <button type="submit" className="btn-default" disabled={pending}>
            {pending ? "sending…" : "submit"}
          </button>
          {state && (
            <div className={`h3 mt-3 ${state.ok ? "text-success" : "text-danger"}`} role="status">
              {state.message}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
