"use client";

import { useActionState, useState } from "react";
import { saveContent } from "@/app/admin/_actions/content";
import type { FormState } from "@/app/admin/_actions/shared";
import type { Field } from "@/lib/content-defaults";
import { FormMessage, SubmitButton } from "./FormBits";
import ImageField from "./ImageField";

type Value = Record<string, unknown>;

// Builds the edit form for a page from its field list (see contentSchemas in content-defaults.ts)
export default function ContentEditor({ contentKey, fields, initial }: { contentKey: string; fields: Field[]; initial: Value }) {
  const [value, setValue] = useState<Value>(initial);
  const [state, action] = useActionState<FormState, FormData>(saveContent, null);

  return (
    <form action={action}>
      <input type="hidden" name="key" value={contentKey} />
      <input type="hidden" name="value" value={JSON.stringify(value)} />
      <FormMessage state={state} />
      <Fields fields={fields} value={value} onChange={setValue} />
      <div className="sticky-actions">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}

function Fields({ fields, value, onChange }: { fields: Field[]; value: Value; onChange: (v: Value) => void }) {
  const set = (name: string, v: unknown) => onChange({ ...value, [name]: v });
  return (
    <>
      {fields.map((field) => (
        <FieldInput key={field.name} field={field} value={value[field.name]} onChange={(v) => set(field.name, v)} />
      ))}
    </>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const help = field.help && <div className="form-text">{field.help}</div>;

  switch (field.type) {
    case "text":
    case "url":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <input className="form-control" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />
          {help}
        </div>
      );

    case "textarea":
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          <textarea
            className="form-control"
            rows={String(value ?? "").length > 300 ? 8 : 3}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
          {help}
        </div>
      );

    case "image":
      return <ImageField label={field.label} value={String(value ?? "")} onChange={onChange} help={field.help} />;

    case "group":
      return (
        <fieldset className="content-group">
          <legend>{field.label}</legend>
          {help}
          <Fields fields={field.fields} value={(value as Value) ?? {}} onChange={onChange} />
        </fieldset>
      );

    case "strings": {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="mb-3">
          <label className="form-label">{field.label}</label>
          {help}
          {items.map((item, i) => (
            <div key={i} className="input-group mb-2">
              <span className="input-group-text">{i + 1}</span>
              <input
                className="form-control"
                value={item}
                onChange={(e) => onChange(items.map((it, j) => (j === i ? e.target.value : it)))}
              />
              <MoveButtons items={items} index={i} onChange={onChange} />
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onChange([...items, ""])}>
            <i className="fa-solid fa-plus me-1"></i> Add item
          </button>
        </div>
      );
    }

    case "list": {
      const items = Array.isArray(value) ? (value as Value[]) : [];
      const empty = Object.fromEntries(field.fields.map((f) => [f.name, f.type === "strings" || f.type === "list" ? [] : ""]));
      return (
        <fieldset className="content-group">
          <legend>{field.label}</legend>
          {help}
          {items.map((item, i) => (
            <div key={i} className="content-list-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>
                  {field.itemLabel} {i + 1}
                </strong>
                <div className="btn-group">
                  <MoveButtons items={items} index={i} onChange={onChange} />
                </div>
              </div>
              <Fields fields={field.fields} value={item} onChange={(v) => onChange(items.map((it, j) => (j === i ? v : it)))} />
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => onChange([...items, empty])}>
            <i className="fa-solid fa-plus me-1"></i> Add {field.itemLabel.toLowerCase()}
          </button>
        </fieldset>
      );
    }
  }
}

function MoveButtons<T>({ items, index, onChange }: { items: T[]; index: number; onChange: (v: T[]) => void }) {
  const move = (to: number) => {
    const next = [...items];
    [next[index], next[to]] = [next[to], next[index]];
    onChange(next);
  };
  return (
    <>
      <button type="button" className="btn btn-outline-secondary" title="Move up" disabled={index === 0} onClick={() => move(index - 1)}>
        <i className="fa-solid fa-arrow-up"></i>
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary"
        title="Move down"
        disabled={index === items.length - 1}
        onClick={() => move(index + 1)}
      >
        <i className="fa-solid fa-arrow-down"></i>
      </button>
      <button
        type="button"
        className="btn btn-outline-danger"
        title="Remove"
        onClick={() => onChange(items.filter((_, j) => j !== index))}
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </>
  );
}
