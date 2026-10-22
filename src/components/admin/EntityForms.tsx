"use client";

import { useActionState } from "react";
import { saveEvent } from "@/app/admin/_actions/events";
import { saveNews } from "@/app/admin/_actions/news";
import type { FormState } from "@/app/admin/_actions/shared";
import { saveTeamMember } from "@/app/admin/_actions/team";
import type { Event, NewsPost, TeamMember } from "@/generated/prisma/client";
import { FormMessage, SubmitButton, submitWithoutReset } from "./FormBits";
import ImageField from "./ImageField";
import RichTextEditor from "./RichTextEditor";

const toDateInput = (date: Date | string | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

function Text({
  name,
  label,
  value,
  required,
  help,
  type = "text",
}: {
  name: string;
  label: string;
  value?: string | number | null;
  required?: boolean;
  help?: string;
  type?: string;
}) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input id={name} name={name} type={type} className="form-control" defaultValue={value ?? ""} required={required} />
      {help && <div className="form-text">{help}</div>}
    </div>
  );
}

function Published({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="form-check form-switch mb-3">
      <input className="form-check-input" type="checkbox" role="switch" id="published" name="published" defaultChecked={checked} />
      <label className="form-check-label" htmlFor="published">
        {label}
      </label>
    </div>
  );
}

export function NewsForm({ post }: { post?: NewsPost }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveNews, null);
  return (
    <form onSubmit={submitWithoutReset(action)}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <FormMessage state={state} />
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <Text name="title" label="Title" value={post?.title} required />
              <RichTextEditor name="content" label="Article" value={post?.content} />
              <div className="mb-3">
                <label className="form-label" htmlFor="excerpt">
                  Short summary
                </label>
                <textarea id="excerpt" name="excerpt" className="form-control" rows={3} defaultValue={post?.excerpt ?? ""} />
                <div className="form-text">Shown in search results and link previews. Leave empty to use the start of the article.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <Published checked={post?.published ?? true} label="Published (visible on the website)" />
              <Text name="publishedAt" label="Publish date" type="date" value={toDateInput(post?.publishedAt ?? new Date())} />
              <ImageField name="coverImage" label="Cover image" value={post?.coverImage ?? ""} aspect={3 / 2} />
              <Text name="author" label="Author" value={post?.author ?? "AFENET"} />
              <Text name="tags" label="Tags" value={post?.tags} help="Separate with commas, e.g. surveillance, training" />
              <Text name="slug" label="URL name" value={post?.slug} help="Optional. Made from the title if left empty." />
              <SubmitButton pending={pending}>{post ? "Save changes" : "Create post"}</SubmitButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function EventForm({ event }: { event?: Event }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveEvent, null);
  return (
    <form onSubmit={submitWithoutReset(action)}>
      {event && <input type="hidden" name="id" value={event.id} />}
      <FormMessage state={state} />
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <Text name="title" label="Event name" value={event?.title} required />
              <div className="mb-3">
                <label className="form-label" htmlFor="summary">
                  Short summary
                </label>
                <textarea id="summary" name="summary" className="form-control" rows={2} defaultValue={event?.summary ?? ""} />
                <div className="form-text">Shown on the event cards.</div>
              </div>
              <RichTextEditor name="content" label="Full description" value={event?.content} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <Published checked={event?.published ?? true} label="Published (visible on the website)" />
              <Text name="startDate" label="Start date" type="date" value={toDateInput(event?.startDate)} required />
              <Text name="endDate" label="End date" type="date" value={toDateInput(event?.endDate)} help="Leave empty for one-day events." />
              <Text name="location" label="Location" value={event?.location} help="e.g. Kampala, Uganda — or Online" />
              <Text name="registrationUrl" label="Registration link" value={event?.registrationUrl} help="Optional. Shows a “Register now” button." />
              <ImageField name="coverImage" label="Cover image" value={event?.coverImage ?? ""} aspect={4 / 5} />
              <Text name="slug" label="URL name" value={event?.slug} help="Optional. Made from the name if left empty." />
              <SubmitButton pending={pending}>{event ? "Save changes" : "Create event"}</SubmitButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export function TeamForm({ member }: { member?: TeamMember }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveTeamMember, null);
  return (
    <form onSubmit={submitWithoutReset(action)}>
      {member && <input type="hidden" name="id" value={member.id} />}
      <FormMessage state={state} />
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <Text name="name" label="Full name" value={member?.name} required />
                </div>
                <div className="col-md-6">
                  <Text name="position" label="Position / title" value={member?.position} required />
                </div>
              </div>
              <Text
                name="category"
                label="Group"
                value={member?.category}
                help="Optional, e.g. Board of Directors or Secretariat. The team page groups members by this."
              />
              <div className="mb-3">
                <label className="form-label" htmlFor="bio">
                  Biography
                </label>
                <textarea id="bio" name="bio" className="form-control" rows={8} defaultValue={member?.bio ?? ""} />
                <div className="form-text">Leave a blank line between paragraphs.</div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Text name="email" label="Email" type="email" value={member?.email} />
                </div>
                <div className="col-md-6">
                  <Text name="linkedin" label="LinkedIn URL" value={member?.linkedin} />
                </div>
                <div className="col-md-6">
                  <Text name="twitter" label="X (Twitter) URL" value={member?.twitter} />
                </div>
                <div className="col-md-6">
                  <Text name="facebook" label="Facebook URL" value={member?.facebook} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body">
              <Published checked={member?.published ?? true} label="Show on the website" />
              <ImageField name="photo" label="Photo" value={member?.photo ?? ""} aspect={4 / 5} />
              <Text name="sortOrder" label="Display order" type="number" value={member?.sortOrder ?? 0} help="Lower numbers are shown first." />
              <SubmitButton pending={pending}>{member ? "Save changes" : "Add member"}</SubmitButton>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
