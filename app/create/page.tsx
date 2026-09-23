"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const themes = {
  Cute: {
    preview:
      "bg-gradient-to-br from-pink-50 via-white to-purple-50",
    border: "border-pink-200",
    accent: "text-pink-500",
    button: "bg-pink-500 hover:bg-pink-600",
    decoration: "🌸 💕 🌸",
  },

  Romantic: {
    preview:
      "bg-gradient-to-br from-rose-100 via-pink-50 to-red-50",
    border: "border-rose-200",
    accent: "text-rose-500",
    button: "bg-rose-500 hover:bg-rose-600",
    decoration: "🌹 ❤️ 🌹",
  },

  Emotional: {
    preview:
      "bg-gradient-to-br from-blue-50 via-white to-pink-50",
    border: "border-blue-200",
    accent: "text-blue-500",
    button: "bg-blue-500 hover:bg-blue-600",
    decoration: "✨ 💙 ✨",
  },

  Elegant: {
    preview:
      "bg-gradient-to-br from-stone-100 via-white to-gray-100",
    border: "border-stone-300",
    accent: "text-stone-600",
    button: "bg-stone-700 hover:bg-stone-800",
    decoration: "✦ 🤍 ✦",
  },

  Dreamy: {
    preview:
      "bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50",
    border: "border-purple-200",
    accent: "text-purple-500",
    button: "bg-purple-500 hover:bg-purple-600",
    decoration: "🌙 ✨ 🌙",
  },

  Sunset: {
    preview:
      "bg-gradient-to-br from-orange-100 via-rose-50 to-yellow-50",
    border: "border-orange-200",
    accent: "text-orange-500",
    button: "bg-orange-500 hover:bg-orange-600",
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

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedOccasion = params.get("occasion");

    if (
      selectedOccasion &&
      [
        "Birthday",
        "Sorry",
        "Proposal",
        "Love",
        "Anniversary",
        "Thank You",
      ].includes(selectedOccasion)
    ) {
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

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError("");

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 5 MB limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    // Only allow image files
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    setPhoto(file);

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview("");
  };

  const createCard = async () => {
    setError("");

    if (!recipient.trim()) {
      setError("Please enter the recipient's name.");
      return;
    }

    if (!sender.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }

    setIsCreating(true);

    try {
      const code = crypto
        .randomUUID()
        .replace(/-/g, "")
        .slice(0, 8);

      let imageUrl: string | null = null;

      // -----------------------------------
      // UPLOAD PHOTO
      // -----------------------------------
      if (photo) {
        const fileExtension =
          photo.name.split(".").pop()?.toLowerCase() || "jpg";

        const fileName = `${code}-${Date.now()}.${fileExtension}`;

        const filePath = `cards/${fileName}`;

        const { error: uploadError } =
          await supabase.storage
            .from("Card-images")
            .upload(filePath, photo, {
              cacheControl: "3600",
              upsert: false,
              contentType: photo.type,
            });

        if (uploadError) {
          console.error(
            "Photo upload error:",
            uploadError
          );

          setError(
            `Photo upload failed: ${uploadError.message}`
          );

          setIsCreating(false);
          return;
        }

        const { data: publicUrlData } =
          supabase.storage
            .from("Card-images")
            .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // -----------------------------------
      // CREATE CARD DATABASE RECORD
      // -----------------------------------
      const { error: insertError } = await supabase
        .from("cards")
        .insert({
          code,
          occasion,
          recipient: recipient.trim(),
          sender: sender.trim(),
          message: message.trim(),
          style,
          image_url: imageUrl,
        });

      if (insertError) {
        console.error(
          "Card creation error:",
          insertError
        );

        setError(
          `Card creation failed: ${insertError.message}`
        );

        setIsCreating(false);
        return;
      }

      // -----------------------------------
      // OPEN PERSONALIZED CARD
      // -----------------------------------
      window.location.href = `/card/${code}`;
    } catch (error) {
      console.error("Unexpected error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsCreating(false);
    }
  };

  const selectedTheme = themes[style];

  return (
    <main className="min-h-screen bg-[#fff8fb] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="text-3xl">❤️</div>

          <h1 className="mt-3 text-4xl font-bold text-gray-900">
            Create Something Special
          </h1>

          <p className="mt-3 text-gray-600">
            Turn your feelings into a beautiful personalized
            experience.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* -------------------------------- */}
          {/* LEFT SIDE - FORM */}
          {/* -------------------------------- */}
          <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">

            <h2 className="text-2xl font-bold text-gray-900">
              Personalize your card
            </h2>

            {/* OCCASION */}
            <div className="mt-7">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Occasion
              </label>

              <select
                value={occasion}
                onChange={(e) =>
                  setOccasion(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none focus:border-pink-400"
              >
                <option value="Birthday">
                  Birthday
                </option>

                <option value="Sorry">
                  Sorry
                </option>

                <option value="Proposal">
                  Proposal
                </option>

                <option value="Love">
                  Love
                </option>

                <option value="Anniversary">
                  Anniversary
                </option>

                <option value="Thank You">
                  Thank You
                </option>
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
                onChange={(e) =>
                  setRecipient(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-pink-400"
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
                onChange={(e) =>
                  setSender(e.target.value)
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-pink-400"
              />
            </div>

            {/* MESSAGE */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Your message
              </label>

              <textarea
                placeholder="Write something from your heart..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                rows={6}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none placeholder:text-gray-400 focus:border-pink-400"
              />
            </div>

            {/* PHOTO */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Add a photo
              </label>

              <p className="mb-3 text-xs text-gray-500">
                Optional • Maximum 5 MB
              </p>

              {!photoPreview ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/40 px-6 py-8 text-center transition hover:border-pink-400 hover:bg-pink-50">

                  <div className="text-4xl">
                    📸
                  </div>

                  <p className="mt-3 font-semibold text-gray-800">
                    Choose a photo
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="rounded-2xl border border-pink-100 bg-pink-50 p-4">

                  <img
                    src={photoPreview}
                    alt="Selected photo"
                    className="h-56 w-full rounded-xl object-cover"
                  />

                  <button
                    type="button"
                    onClick={removePhoto}
                    className="mt-4 w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    Remove Photo
                  </button>
                </div>
              )}
            </div>

            {/* STYLES */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold text-gray-800">
                Choose a style
              </label>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(
                  Object.keys(themes) as ThemeName[]
                ).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setStyle(item)}
                    className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                      style === item
                        ? `${themes[item].border} bg-pink-50 text-gray-900`
                        : "border-gray-200 bg-white text-gray-700 hover:border-pink-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* CREATE BUTTON */}
            <button
              type="button"
              onClick={createCard}
              disabled={isCreating}
              className={`mt-8 w-full rounded-full px-6 py-4 font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 ${selectedTheme.button}`}
            >
              {isCreating
                ? "Creating Your Card..."
                : "Create My Card ❤️"}
            </button>
          </section>

          {/* -------------------------------- */}
          {/* RIGHT SIDE - LIVE PREVIEW */}
          {/* -------------------------------- */}
          <section>

            <div className="mb-4 text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-pink-500">
                Live Preview
              </p>
            </div>

            <div
              className={`flex min-h-[650px] items-center justify-center rounded-3xl p-8 ${selectedTheme.preview}`}
            >

              <div
                className={`w-full max-w-md rounded-[2rem] border bg-white p-8 text-center shadow-2xl sm:p-10 ${selectedTheme.border}`}
              >

                {/* EMOJI */}
                <div className="text-6xl">
                  {emoji}
                </div>

                {/* PHOTO PREVIEW */}
                {photoPreview && (
                  <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-2xl border border-white shadow-lg">
                    <img
                      src={photoPreview}
                      alt="Card preview"
                      className="h-56 w-full object-cover"
                    />
                  </div>
                )}

                {/* OCCASION */}
                <p
                  className={`mt-6 text-sm font-semibold uppercase tracking-[0.25em] ${selectedTheme.accent}`}
                >
                  {occasion}
                </p>

                {/* TITLE */}
                <h2 className="mt-4 text-3xl font-bold text-gray-900">
                  {occasion === "Birthday"
                    ? `Happy Birthday${
                        recipient
                          ? `, ${recipient}`
                          : ""
                      }!`
                    : occasion === "Proposal"
                    ? `${
                        recipient || "Someone"
                      }, I have a question...`
                    : occasion === "Sorry"
                    ? `I'm Sorry${
                        recipient
                          ? `, ${recipient}`
                          : ""
                      }`
                    : occasion === "Love"
                    ? `For ${
                        recipient ||
                        "Someone Special"
                      } ❤️`
                    : occasion === "Anniversary"
                    ? `Happy Anniversary${
                        recipient
                          ? `, ${recipient}`
                          : ""
                      }`
                    : `Thank You${
                        recipient
                          ? `, ${recipient}`
                          : ""
                      }`}
                </h2>

                {/* DIVIDER */}
                <div
                  className={`mx-auto my-8 h-px max-w-xs ${selectedTheme.border}`}
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