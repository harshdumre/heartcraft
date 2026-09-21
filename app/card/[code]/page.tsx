"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const themes = {
  Cute: {
    pageBg:
      "bg-gradient-to-br from-pink-50 via-white to-purple-50",
    cardBg:
      "bg-gradient-to-br from-pink-50 via-white to-purple-50",
    border: "border-pink-200",
    accent: "text-pink-500",
    divider: "bg-pink-200",
    button: "bg-green-500 hover:bg-green-600",
    decoration: "🌸 💕 🌸",
  },

  Romantic: {
    pageBg:
      "bg-gradient-to-br from-rose-100 via-pink-50 to-red-50",
    cardBg:
      "bg-gradient-to-br from-rose-50 via-white to-pink-50",
    border: "border-rose-200",
    accent: "text-rose-500",
    divider: "bg-rose-200",
    button: "bg-green-500 hover:bg-green-600",
    decoration: "🌹 ❤️ 🌹",
  },

  Emotional: {
    pageBg:
      "bg-gradient-to-br from-blue-50 via-white to-pink-50",
    cardBg:
      "bg-gradient-to-br from-blue-50 via-white to-pink-50",
    border: "border-blue-200",
    accent: "text-blue-500",
    divider: "bg-blue-200",
    button: "bg-green-500 hover:bg-green-600",
    decoration: "✨ 💙 ✨",
  },

  Elegant: {
    pageBg:
      "bg-gradient-to-br from-stone-100 via-white to-gray-100",
    cardBg:
      "bg-gradient-to-br from-stone-50 via-white to-gray-50",
    border: "border-stone-300",
    accent: "text-stone-600",
    divider: "bg-stone-300",
    button: "bg-green-500 hover:bg-green-600",
    decoration: "✦ 🤍 ✦",
  },

  Dreamy: {
    pageBg:
      "bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50",
    cardBg:
      "bg-gradient-to-br from-purple-50 via-white to-blue-50",
    border: "border-purple-200",
    accent: "text-purple-500",
    divider: "bg-purple-200",
    button: "bg-green-500 hover:bg-green-600",
    decoration: "🌙 ✨ 🌙",
  },

  Sunset: {
    pageBg:
      "bg-gradient-to-br from-orange-100 via-rose-50 to-yellow-50",
    cardBg:
      "bg-gradient-to-br from-orange-50 via-white to-rose-50",
    border: "border-orange-200",
    accent: "text-orange-500",
    divider: "bg-orange-200",
    button: "bg-green-500 hover:bg-green-600",
    decoration: "🌅 ❤️ 🌅",
  },
};

type ThemeName = keyof typeof themes;

type Card = {
  occasion: string;
  recipient: string | null;
  sender: string | null;
  message: string | null;
  style: string | null;
};

export default function CardPage() {
  const params = useParams();
  const code = params.code as string;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCard = async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("occasion, recipient, sender, message, style")
        .eq("code", code)
        .single();

      if (error) {
        console.error(error);
        setError("This card could not be found.");
      } else {
        setCard(data);
      }

      setLoading(false);
    };

    if (code) {
      loadCard();
    }
  }, [code]);

  const occasionEmoji: Record<string, string> = {
    Birthday: "🎂",
    Sorry: "🥺",
    Proposal: "💍",
    Love: "❤️",
    Anniversary: "💐",
    "Thank You": "🙏",
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8fb]">
        <div className="text-center">
          <div className="text-5xl">❤️</div>
          <p className="mt-4 text-gray-500">
            Opening your card...
          </p>
        </div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6">
        <div className="text-center">
          <div className="text-5xl">💔</div>

          <h1 className="mt-4 text-3xl font-bold">
            Card Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            This card may have expired or the link may be incorrect.
          </p>
        </div>
      </main>
    );
  }

  const emoji = occasionEmoji[card.occasion] || "❤️";

  const themeName: ThemeName =
    card.style && card.style in themes
      ? (card.style as ThemeName)
      : "Emotional";

  const selectedTheme = themes[themeName];

  const shareOnWhatsApp = () => {
    const cardUrl = window.location.href;

    const text = `I made a special card for you ❤️\n\n${cardUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <main
      className={`flex min-h-screen items-center justify-center px-6 py-12 ${selectedTheme.pageBg}`}
    >
      <div className="w-full max-w-xl">
        <div
          className={`rounded-[2rem] border bg-white p-3 shadow-2xl ${selectedTheme.border}`}
        >
          <div
            className={`rounded-[1.7rem] border px-8 py-12 text-center ${selectedTheme.cardBg} ${selectedTheme.border}`}
          >
            {/* Emoji */}
            <div className="text-6xl">
              {emoji}
            </div>

            {/* Occasion */}
            <p
              className={`mt-6 text-sm font-semibold uppercase tracking-[0.3em] ${selectedTheme.accent}`}
            >
              {card.occasion}
            </p>

            {/* Title */}
            <h1 className="mt-5 text-4xl font-bold text-gray-900">
              {card.occasion === "Birthday"
                ? `Happy Birthday${card.recipient ? `, ${card.recipient}` : ""}!`
                : card.occasion === "Proposal"
                ? `${card.recipient || "Someone"}, I have a question...`
                : card.occasion === "Sorry"
                ? `I'm Sorry${card.recipient ? `, ${card.recipient}` : ""}`
                : card.occasion === "Love"
                ? `For ${card.recipient || "Someone Special"} ❤️`
                : card.occasion === "Anniversary"
                ? `Happy Anniversary${card.recipient ? `, ${card.recipient}` : ""}`
                : `Thank You${card.recipient ? `, ${card.recipient}` : ""}`}
            </h1>

            {/* Divider */}
            <div
              className={`mx-auto my-8 h-px max-w-xs ${selectedTheme.divider}`}
            />

            {/* Message */}
            <p className="whitespace-pre-wrap text-lg leading-8 text-gray-600">
              {card.message || ""}
            </p>

            {/* Sender */}
            <div className="mt-10">
              <p className="text-sm text-gray-400">
                With love,
              </p>

              <p className="mt-2 text-lg font-semibold text-gray-800">
                {card.sender || "Someone who cares"}
              </p>
            </div>

            {/* Decoration */}
            <div className="mt-8 text-2xl">
              {selectedTheme.decoration}
            </div>
          </div>
        </div>

        {/* Share */}
        <button
          type="button"
          onClick={shareOnWhatsApp}
          className={`mx-auto mt-6 block rounded-full px-8 py-3 font-semibold text-white shadow-md transition ${selectedTheme.button}`}
        >
          Share on WhatsApp 💚
        </button>

        <p className="mt-6 text-center text-sm text-gray-400">
          Made with ❤️ by HeartCraft
        </p>
      </div>
    </main>
  );
}