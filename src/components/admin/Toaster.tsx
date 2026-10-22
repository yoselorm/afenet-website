"use client";

import { useEffect, useState } from "react";

// Small "Saved" pop-ups for successful actions. Errors are shown as banners instead,
// so people have time to read them.
const EVENT = "afenet-toast";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

type Item = { id: number; message: string };

export default function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let next = 0;
    let last = { message: "", at: 0 };
    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      // Ignore an identical toast fired twice in quick succession
      if (message === last.message && Date.now() - last.at < 1000) return;
      last = { message, at: Date.now() };
      const id = ++next;
      setItems((list) => [...list, { id, message }]);
      setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3500);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="admin-toast">
          <i className="fa-solid fa-circle-check"></i>
          <span>{t.message}</span>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setItems((list) => list.filter((x) => x.id !== t.id))}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
    </div>
  );
}

// Shows a toast once when a page loads, e.g. "Post created." after a redirect
export function FlashToast({ message }: { message: string }) {
  useEffect(() => {
    toast(message);
  }, [message]);
  return null;
}
