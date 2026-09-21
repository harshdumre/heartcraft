"use client";

import { useState } from "react";

const occasions = [
  {
    emoji: "🎂",
    title: "Birthday",
    description: "Make their day unforgettable",
  },
  {
    emoji: "🥺",
    title: "Sorry",
    description: "Say what your heart feels",
  },
  {
    emoji: "💍",
    title: "Proposal",
    description: "Ask the most important question",
  },
  {
    emoji: "❤️",
    title: "Love",
    description: "Tell someone how you feel",
  },
  {
    emoji: "💐",
    title: "Anniversary",
    description: "Celebrate your beautiful journey",
  },
  {
    emoji: "🙏",
    title: "Thank You",
    description: "Show someone you appreciate them",
  },
];

export default function Home() {
  const [selected, setSelected] = useState("");

  return (
    <main className="min-h-screen bg-[#fff8fb] text-gray-900">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">❤️</span>
          <span className="text-2xl font-bold tracking-tight">
            Heart<span className="text-pink-500">Craft</span>
          </span>
        </div>

        <button className="rounded-full border border-pink-200 bg-white px-5 py-2 text-sm font-medium shadow-sm transition hover:bg-pink-50">
          How it works
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-12 text-center md:pt-20">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-4 py-2 text-sm text-pink-600 shadow-sm">
          <span>✨</span>
          <span>Make someone feel special</span>
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
          Say what your{" "}
          <span className="text-pink-500">heart</span> can't say in a text.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
          Create a beautiful personalized experience for someone you love,
          care about, miss, or simply want to make smile.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("occasions")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-9 rounded-full bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-pink-500"
        >
          Create Something Special ❤️
        </button>
      </section>

      {/* Decorative hearts */}
      <div className="pointer-events-none mx-auto max-w-5xl px-6">
        <div className="relative h-12">
          <span className="absolute left-[10%] text-2xl opacity-50">♡</span>
          <span className="absolute left-[25%] text-lg opacity-40">♥</span>
          <span className="absolute right-[25%] text-2xl opacity-50">♡</span>
          <span className="absolute right-[10%] text-lg opacity-40">♥</span>
        </div>
      </div>

      {/* Occasions */}
      <section id="occasions" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
            Choose an occasion
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            What do you want to say?
          </h2>

          <p className="mt-3 text-gray-600">
            Choose a feeling and we'll help you turn it into something
            memorable.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((occasion) => (
            <button
              key={occasion.title}
              onClick={() => setSelected(occasion.title)}
              className={`group rounded-3xl border bg-white p-7 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                selected === occasion.title
                  ? "border-pink-400 ring-2 ring-pink-100"
                  : "border-pink-100"
              }`}
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-3xl transition group-hover:scale-110">
                {occasion.emoji}
              </div>

              <h3 className="text-xl font-bold">{occasion.title}</h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {occasion.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-pink-500">
                Create →
              </div>
            </button>
          ))}
        </div>

        {/* Selection */}
        {selected && (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-pink-200 bg-white p-6 text-center shadow-lg">
            <div className="text-3xl">✨</div>

            <h3 className="mt-3 text-xl font-bold">
              You selected: {selected}
            </h3>

            <p className="mt-2 text-gray-500">
              Great choice. Your personalized {selected.toLowerCase()} card
              will be created here.
            </p>

<button
  onClick={() => {
    window.location.href = `/create?occasion=${encodeURIComponent(selected)}`;
  }}
  className="mt-5 rounded-full bg-pink-500 px-7 py-3 font-semibold text-white transition hover:bg-pink-600"
>
  Start Creating ❤️
</button>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-y border-pink-100 bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500">
              Simple & personal
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Three simple steps
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600">
                1
              </div>
              <h3 className="mt-5 text-lg font-bold">Choose</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Pick the occasion that matches what you want to say.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600">
                2
              </div>
              <h3 className="mt-5 text-lg font-bold">Personalize</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add their name, your message, photos and your personal touch.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-xl font-bold text-pink-600">
                3
              </div>
              <h3 className="mt-5 text-lg font-bold">Share</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create a special link and send it directly to them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 text-center">
        <div className="text-xl font-bold">
          Heart<span className="text-pink-500">Craft</span> ❤️
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Made for the moments that matter.
        </p>
      </footer>
    </main>
  );
}