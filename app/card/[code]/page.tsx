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
  image_url: string | null;
};

export default function CardPage() {
  const params = useParams();

  const rawCode = params?.code;
  const code = Array.isArray(rawCode)
    ? rawCode[0]
    : rawCode;

  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCard = async () => {
      if (!code) {
        if (isMounted) {
          setError("The card link is missing its code.");
          setLoading(false);
        }

        return;
      }

      try {
        const queryPromise = supabase
          .from("cards")
          .select(
            "occasion, recipient, sender, message, style, image_url"
          )
          .eq("code", code)
          .maybeSingle();

        const timeoutPromise = new Promise<{
          data: null;
          error: { message: string };
        }>((resolve) => {
          setTimeout(() => {
            resolve({
              data: null,
              error: {
                message:
                  "The card request timed out. Please try again.",
              },
            });
          }, 10000);
        });

        const result = await Promise.race([
          queryPromise,
          timeoutPromise,
        ]);

        if (!isMounted) {
          return;
        }

        if (result.error) {
          console.error("Card loading error:", result.error);

          setError(
            result.error.message ||
              "This card could not be loaded."
          );

          return;
        }

        if (!result.data) {
          setError("This card could not be found.");
          return;
        }

        setCard(result.data);
      } catch (err) {
        console.error("Unexpected card loading error:", err);

        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while opening the card."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCard();

    return () => {
      isMounted = false;
    };
  }, [code]);

  const occasionEmoji: Record<string, string> = {
    Birthday: "🎂",
    Sorry: "🥺",
    Proposal: "💍",
    Love: "❤️",
    Anniversary: "💐",
    "Thank You": "🙏",
  };

  const shareOnWhatsApp = () => {
    const cardUrl = window.location.href;

    const text = `I made a special card for you ❤️\n\n${cardUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6">
        <div className="text-center">
          <div className="text-5xl">❤️</div>

          <p className="mt-4 text-gray-500">
            Opening your card...
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Please wait a moment.
          </p>
        </div>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6">
        <div className="max-w-md text-center">
          <div className="text-5xl">💔</div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Card Could Not Be Opened
          </h1>

          <p className="mt-4 text-gray-600">
            {error || "This card could not be found."}
          </p>

          <p className="mt-4 break-words rounded-xl bg-gray-100 p-3 text-left text-xs text-gray-500">
            Card code: {code || "missing"}
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

  return (
    <main
      className={`flex min-h-screen items-center justify-center px-6 py-12 ${selectedTheme.pageBg}`}
    >
      <div className="w-full max-w-xl">

        {/* CARD */}
        <div
          className={`rounded-[2rem] border bg-white p-3 shadow-2xl ${selectedTheme.border}`}
        >
          <div
            className={`rounded-[1.7rem] border px-8 py-12 text-center ${selectedTheme.cardBg} ${selectedTheme.border}`}
          >

            {/* EMOJI */}
            <div className="text-6xl">
              {emoji}
            </div>

            {/* PHOTO */}
            {card.image_url && (
              <div className="mx-auto mt-7 max-w-md overflow-hidden rounded-2xl border border-white/80 shadow-lg">
                <img
                  src={card.image_url}
                  alt={
                    card.recipient
                      ? `Photo for ${card.recipient}`
                      : "Card photo"
                  }
                  className="h-64 w-full object-cover"
                />
              </div>
            )}

            {/* TITLE */}
            <h1 className="mt-6 text-4xl font-bold text-gray-900">
              {card.occasion === "Birthday"
                ? `Happy Birthday${
                    card.recipient
                      ? `, ${card.recipient}`
                      : ""
                  }!`
                : card.occasion === "Proposal"
                ? `${
                    card.recipient || "Someone"
                  }, I have a question...`
                : card.occasion === "Sorry"
                ? `I'm Sorry${
                    card.recipient
                      ? `, ${card.recipient}`
                      : ""
                  }`
                : card.occasion === "Love"
                ? `For ${
                    card.recipient || "Someone Special"
                  } ❤️`
                : card.occasion === "Anniversary"
                ? `Happy Anniversary${
                    card.recipient
                      ? `, ${card.recipient}`
                      : ""
                  }`
                : `Thank You${
                    card.recipient
                      ? `, ${card.recipient}`
                      : ""
                  }`}
            </h1>

            {/* DIVIDER */}
            <div
              className={`mx-auto my-8 h-px max-w-xs ${selectedTheme.divider}`}
            />

            {/* MESSAGE */}
            <p className="whitespace-pre-wrap text-lg leading-8 text-gray-700">
              {card.message || ""}
            </p>

            {/* SENDER */}
            <div className="mt-10">
              <p className="text-sm text-gray-500">
                With love,
              </p>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {card.sender || "Someone who cares"}
              </p>
            </div>

            {/* DECORATION */}
            <div className="mt-8 text-2xl">
              {selectedTheme.decoration}
            </div>

          </div>
        </div>

        {/* SHARE */}
        <button
          type="button"
          onClick={shareOnWhatsApp}
          className={`mx-auto mt-6 block rounded-full px-8 py-3 font-semibold text-white shadow-md transition ${selectedTheme.button}`}
        >
          Share on WhatsApp 💚
        </button>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Made with ❤️ by HeartCraft
        </p>
      </div>
    </main>
  );
}