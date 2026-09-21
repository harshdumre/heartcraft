"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreatePage() {
  const [occasion, setOccasion] = useState("Sorry");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState("Emotional");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedOccasion = params.get("occasion");

    if (selectedOccasion) {
      setOccasion(selectedOccasion);
    }
  }, []);

  const occasionEmoji: Record<string, string> = {
    Birthday: "🎂",
    Sorry: "🥺",
    Proposal: "💍",
    Love: "❤️",
    Anniversary: "💐",
    "Thank You": "🙏",
  };

  const emoji = occasionEmoji[occasion] || "❤️";

  const createCard = async () => {
    if (!recipient.trim() || !sender.trim() || !message.trim()) {
      alert("Please fill in the recipient, your name, and message.");
      return;
    }

    setIsCreating(true);

    try {
      const code = crypto.randomUUID().replace(/-/g, "").slice(0, 8);

      const { error } = await supabase.from("cards").insert({
        code,
        occasion,
        recipient,
        sender,
        message,
        style,
      });

      if (error) {
        console.error("Supabase error:", error);
        alert("Something went wrong while creating your card.");
        setIsCreating(false);
        return;
      }

      window.location.href = `/card/${code}`;
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fff8fb] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <div className="text-3xl">❤️</div>

          <h1 className="mt-3 text-4xl font-bold">
            Create Something Special
          </h1>

          <p className="mt-3 text-gray-600">
            Turn your feelings into a beautiful personalized experience.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* FORM */}
          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold">
              Personalize your card
            </h2>

            {/* Occasion */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold">
                Occasion
              </label>

              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-400"
              >
                <option value="Birthday">Birthday</option>
                <option value="Sorry">Sorry</option>
                <option value="Proposal">Proposal</option>
                <option value="Love">Love</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Thank You">Thank You</option>
              </select>
            </div>

            {/* Recipient */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Who is this for?
              </label>

              <input
                type="text"
                placeholder="Enter their name"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            {/* Sender */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Your name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            {/* Message */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Your message
              </label>

              <textarea
                placeholder="Write something from your heart..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-400"
              />
            </div>

            {/* Style */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold">
                Choose a style
              </label>

              <div className="grid grid-cols-3 gap-3">
                {["Cute", "Romantic", "Emotional"].map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setStyle(item)}
                    className={`rounded-xl border px-3 py-3 text-sm transition ${
                      style === item
                        ? "border-pink-400 bg-pink-50 text-pink-600"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <button
              type="button"
              onClick={createCard}
              disabled={isCreating}
              className="mt-8 w-full rounded-full bg-pink-500 px-6 py-4 font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? "Creating Your Card..." : "Create My Card ❤️"}
            </button>
          </section>

          {/* PREVIEW */}
          <section>
            <div className="mb-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                Live Preview
              </p>
            </div>

            <div className="flex min-h-[600px] items-center justify-center rounded-3xl bg-gradient-to-br from-pink-100 via-white to-rose-100 p-8">
              <div className="w-full max-w-md rounded-[2rem] bg-white p-10 text-center shadow-2xl">
                <div className="text-6xl">{emoji}</div>

                <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-pink-500">
                  {occasion}
                </p>

                <h2 className="mt-4 text-3xl font-bold">
                  {occasion === "Birthday"
                    ? `Happy Birthday${recipient ? `, ${recipient}` : ""}!`
                    : occasion === "Proposal"
                    ? `${recipient || "Someone"}, I have a question...`
                    : occasion === "Sorry"
                    ? `I'm Sorry${recipient ? `, ${recipient}` : ""}`
                    : occasion === "Love"
                    ? `For ${recipient || "Someone Special"} ❤️`
                    : occasion === "Anniversary"
                    ? `Happy Anniversary${recipient ? `, ${recipient}` : ""}`
                    : `Thank You${recipient ? `, ${recipient}` : ""}`}
                </h2>

                <div className="my-8 h-px bg-pink-100" />

                <p className="min-h-[120px] whitespace-pre-wrap text-lg leading-8 text-gray-600">
                  {message || "Your heartfelt message will appear here..."}
                </p>

                <div className="mt-8">
                  <p className="text-sm text-gray-400">
                    With love,
                  </p>

                  <p className="mt-1 font-semibold">
                    {sender || "Your Name"}
                  </p>
                </div>

                <div className="mt-8 text-2xl">
                  ✨ ❤️ ✨
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}