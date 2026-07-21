"use client";

import { FormEvent, useEffect, useState } from "react";
import { SEED_COMMENTS } from "@/lib/seedComments";

interface Comment {
  name: string;
  text: string;
  date: string;
}

function storageKey(slug: string) {
  return `beauty-launchpad:comments:${slug}`;
}

export default function Comments({ slug }: { slug: string }) {
  const seedComments = SEED_COMMENTS[slug] ?? [];
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug));
      setUserComments(raw ? (JSON.parse(raw) as Comment[]) : []);
    } catch {
      setUserComments([]);
    }
    setLoaded(true);
  }, [slug]);

  const comments = [...seedComments, ...userComments];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedText = text.trim();
    if (!trimmedName || !trimmedText) return;

    const next = [
      ...userComments,
      {
        name: trimmedName,
        text: trimmedText,
        date: new Date().toISOString(),
      },
    ];
    setUserComments(next);
    window.localStorage.setItem(storageKey(slug), JSON.stringify(next));
    setName("");
    setText("");
  }

  if (!loaded) return null;

  return (
    <section className="mt-16 border-t border-rose-200 pt-10">
      <h2 className="mb-5 font-serif text-2xl font-bold text-ink-900">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {comments.length === 0 ? (
        <p className="text-sm text-ink-500">
          No comments yet — be the first to share your thoughts.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li
              key={index}
              className="rounded-xl border border-rose-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-ink-900">
                  {comment.name}
                </span>
                <span className="text-xs text-ink-400">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(new Date(comment.date))}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {comment.text}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:p-5"
      >
        <p className="mb-3 text-xs text-ink-500">
          Comments are saved to your own browser only and aren&apos;t visible
          to other visitors.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={60}
          required
          className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-rose-400 focus:outline-none"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          maxLength={1000}
          required
          className="mt-3 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-rose-400 focus:outline-none"
        />
        <button
          type="submit"
          className="mt-3 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
        >
          Post Comment
        </button>
      </form>
    </section>
  );
}
