"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const themes = {
  Cute: {
    previewBg:
      "bg-gradient-to-br from-pink-100 via-white to-purple-100",
    cardBg:
      "bg-gradient-to-br from-pink-50 via-white to-purple-50",
    border: "border-pink-200",
    accent: "text-pink-500",
    divider: "bg-pink-200",
    button: "bg-pink-500 hover:bg-pink-600",
    badge: "bg-pink-100 text-pink-600",
    decoration: "🌸 💕 🌸",
  },

  Romantic: {
    previewBg:
      "bg-gradient-to-br from-rose-200 via-pink-100 to-red-100",
    cardBg:
      "bg-gradient-to-br from-rose-50 via-white to-pink-50",
    border: "border-rose-200",
    accent: "text-rose-500",
    divider: "bg-rose-200",
    button: "bg-rose-500 hover:bg-rose-600",
    badge: "bg-rose-100 text-rose-600",
    decoration: "🌹 ❤️ 🌹",
  },

  Emotional: {
    previewBg:
      "bg-gradient-to-br from-blue-100 via-white to-pink-100",
    cardBg:
      "bg-gradient-to-br from-blue-50 via-white to-pink-50",
    border: "border-blue-200",
    accent: "text-blue-500",
    divider: "bg-blue-200",
    button: "bg-blue-500 hover:bg-blue-600",
    badge: "bg-blue-100 text-blue-600",
    decoration: "✨ 💙 ✨",
  },

  Elegant: {
    previewBg:
      "bg-gradient-to-br from-gray-200 via-white to-stone-200",
    cardBg:
      "bg-gradient-to-br from-stone-50 via-white to-gray-50",
    border: "border-stone-300",
    accent: "text-stone-600",
    divider: "bg-stone-300",
    button: "bg-stone-700 hover:bg-stone-800",
    badge: "bg-stone-100 text-stone-700",
    decoration: "✦ 🤍 ✦",
  },

  Dreamy: {
    previewBg:
      "bg-gradient-to-br from-purple-200 via-blue-100 to-pink-100",
    cardBg:
      "bg-gradient-to-br from-purple-50 via-white to-blue-50",
    border: "border-purple-200",
    accent: "text-purple-500",
    divider: "bg-purple-200",
    button: "bg-purple-500 hover:bg-purple-600",
    badge: "bg-purple-100 text-purple-600",
    decoration: "🌙 ✨ 🌙",
  },

  Sunset: {
    previewBg:
      "bg-gradient-to-br from-orange-200 via-rose-100 to-yellow-100",
    cardBg:
      "bg-gradient-to-br from-orange-50 via-white to-rose-50",
    border: "border-orange-200",
    accent: "text-orange-500",
    divider: "bg-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
    badge: "bg-orange-100 text-orange-600",
    decoration: "🌅 ❤️ 🌅",
  },
};

type ThemeName = keyof typeof themes;

export default function CreatePage() {
  const [occasion, setOccasion] = useState("Sorry");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<ThemeName>("Emotional");
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
  const selectedTheme = themes[style];

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

        {/* PAGE HEADER */}
        <div className="mb-10 text-center">
          <div className="text-3xl">❤️</div>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Create Something Special
          </h1>

          <p className="mt-3 text-gray-600">
            Turn your feelings into a beautiful personalized experience.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ================= FORM ================= */}
          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Personalize your card
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add your details and choose a design that matches your feelings.
            </p>

            {/* OCCASION */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Occasion
              </label>

              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="Birthday">Birthday</option>
                <option value="Sorry">Sorry</option>
                <option value="Proposal">Proposal</option>
                <option value="Love">Love</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Thank You">Thank You</option>
              </select>
            </div>

            {/* RECIPIENT */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Who is this for?
              </label>

              <input
                type="text"
                placeholder="Enter their name"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* SENDER */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Your name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            {/* MESSAGE */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-800">
                  Your message
                </label>

                <span className="text-xs text-gray-500">
                  {message.length}/500
                </span>
              </div>

              <textarea
                placeholder="Write something from your heart..."
                value={message}
                maxLength={500}
                onChange={(e) => setMessage(e.target.value)}
                rows={7}
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Write a personal message that comes straight from your heart.
              </p>
            </div>

            {/* CARD DESIGN */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold text-gray-800">
                Choose your card design
              </label>

              <div className="grid grid-cols-2 gap-3">

                {(Object.keys(themes) as ThemeName[]).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setStyle(item)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      style === item
                        ? `${themes[item].border} ${themes[item].badge} ring-2 ring-pink-200`
                        : "border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">
                      {item === "Cute" && "🌸"}
                      {item === "Romantic" && "🌹"}
                      {item === "Emotional" && "🥺"}
                      {item === "Elegant" && "✨"}
                      {item === "Dreamy" && "🌙"}
                      {item === "Sunset" && "🌅"}
                    </span>

                    {item}
                  </button>
                ))}

              </div>
            </div>

            {/* CREATE BUTTON */}
            <button
              type="button"
              onClick={createCard}
              disabled={isCreating}
              className={`mt-8 w-full rounded-full px-6 py-4 font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${selectedTheme.button}`}
            >
              {isCreating
                ? "Creating Your Card..."
                : "Create My Card ❤️"}
            </button>

          </section>

          {/* ================= PREVIEW ================= */}
          <section>

            <div className="mb-4 text-center">
              <p
                className={`text-sm font-semibold uppercase tracking-widest ${selectedTheme.accent}`}
              >
                Live Preview
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {style} design
              </p>
            </div>

            <div
              className={`flex min-h-[600px] items-center justify-center rounded-3xl p-8 ${selectedTheme.previewBg}`}
            >
              <div
                className={`w-full max-w-md rounded-[2rem] border p-10 text-center shadow-2xl ${selectedTheme.cardBg} ${selectedTheme.border}`}
              >

                {/* EMOJI */}
                <div className="text-6xl">
                  {emoji}
                </div>

                {/* TITLE */}
                <h2 className="mt-4 text-3xl font-bold text-gray-900">
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

                {/* DIVIDER */}
                <div
                  className={`mx-auto my-8 h-px max-w-xs ${selectedTheme.divider}`}
                />

                {/* MESSAGE */}
                <p className="min-h-[120px] whitespace-pre-wrap text-lg leading-8 text-gray-700">
                  {message ||
                    "Your heartfelt message will appear here..."}
                </p>

                {/* SENDER */}
                <div className="mt-8">
                  <p className="text-sm text-gray-500">
                    With love,
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    {sender || "Your Name"}
                  </p>
                </div>

                {/* DECORATION */}
                <div className="mt-8 text-2xl">
                  {selectedTheme.decoration}
                </div>

              </div>
            </div>

          </section>

        </div>
      </div>
    </main>
  );
}