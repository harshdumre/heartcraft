"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

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
          <p className="mt-4 text-gray-500">Opening your card...</p>
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
  const shareOnWhatsApp = () => {
  const cardUrl = window.location.href;

  const text = `I made a special card for you ❤️\n\n${cardUrl}`;

  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank"
  );
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8fb] px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="rounded-[2rem] border border-pink-100 bg-white p-3 shadow-2xl">
          <div className="rounded-[1.7rem] bg-gradient-to-br from-pink-50 via-white to-rose-50 px-8 py-12 text-center">
            
            <div className="text-6xl">
              {emoji}
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-pink-500">
              {card.occasion}
            </p>

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

            <div className="mx-auto my-8 h-px max-w-xs bg-pink-200" />

            <p className="whitespace-pre-wrap text-lg leading-8 text-gray-600">
              {card.message || ""}
            </p>

            <div className="mt-10">
              <p className="text-sm text-gray-400">
                With love,
              </p>

              <p className="mt-2 text-lg font-semibold text-gray-800">
                {card.sender || "Someone who cares"}
              </p>
            </div>

            <div className="mt-8 text-2xl">
              ✨ ❤️ ✨
            </div>
          </div>
        </div>
        
        <button
          type="button"
          onClick={shareOnWhatsApp}
          className="mx-auto mt-6 block rounded-full bg-green-500 px-8 py-3 font-semibold text-white shadow-md transition hover:bg-green-600"
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