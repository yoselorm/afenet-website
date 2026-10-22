import { notFound } from "next/navigation";

// Unknown URLs render the themed 404 page inside the site layout
export default function CatchAll() {
  notFound();
}
