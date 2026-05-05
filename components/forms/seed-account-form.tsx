"use client";

import { useEffect, useState, useRef } from "react";
import {
  addSeedAccounts,
  getMySeedAccounts,
  removeSeedAccount,
} from "@/app/actions/seed-account.actions";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Zap } from "lucide-react";

type SeedAccount = {
  id: string;
  linkedinUrl: string;
};

type Item = {
  id: number;
  dbId?: string;
  url: string;
  isNew: boolean;
};

const MAX_ACCOUNTS = 3;
let _id = 0;

export function SeedAccountForm({
  onNextAction,
}: {
  onNextAction: () => void;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [inputOpen, setInputOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const isLimitReached = items.length >= MAX_ACCOUNTS;

  /**
   * LOAD DB
   */
  useEffect(() => {
    const load = async () => {
      const data = await getMySeedAccounts();

      setItems(
        (data as SeedAccount[]).map((d) => ({
          id: _id++,
          dbId: d.id,
          url: d.linkedinUrl,
          isNew: false,
        }))
      );

      setInitLoading(false);
    };

    load();
  }, []);

  /**
   * focus input animation
   */
  useEffect(() => {
    if (inputOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [inputOpen]);

  /**
   * add item (local only)
   */

  const isValidLinkedInUrl = (url: string) => {
  return url.startsWith("https://www.linkedin.com/in/");
};

const addItem = () => {
  const value = draft.trim();

  // ❌ validation LinkedIn
  if (!isValidLinkedInUrl(value)) return;

  if (value.length < 10 || isLimitReached) return;

  setItems((prev) => {
    const next = [
      ...prev,
      {
        id: _id++,
        url: value,
        isNew: true,
      },
    ];

    if (prev.length === 0) setActiveIndex(0);

    return next;
  });

  setDraft("");
  setInputOpen(false);
};


  /**
   * remove item (DB + local)
   */
  const removeItem = async (e: React.MouseEvent, item: Item) => {
    e.stopPropagation();

    if (item.dbId) {
      await removeSeedAccount(item.dbId);
    }

    setItems((prev) => {
      const next = prev.filter((i) => i.id !== item.id);

      if (activeIndex >= next.length) {
        setActiveIndex(Math.max(0, next.length - 1));
      }

      return next;
    });
  };

  /**
   * submit new items
   */
  const handleSubmit = async () => {
  const newItems = items.filter((i) => i.isNew);

  setLoading(true);

  if (newItems.length) {
    await addSeedAccounts(newItems.map((i) => i.url));
  }

  setLoading(false);
  onNextAction();
};

  /**
   * SKELETON LOADING
   */
  if (initLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-xl mx-auto animate-pulse">

        {/* header */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-200" />
          <div className="h-8 w-2/3 bg-neutral-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-neutral-200 rounded" />
            <div className="h-3 w-5/6 bg-neutral-200 rounded" />
          </div>
        </div>

        {/* input */}
        <div className="flex gap-2 h-13">
          <div className="flex-1 h-13 bg-neutral-200 rounded-full" />
          <div className="w-13 h-13 bg-neutral-200 rounded-full" />
        </div>

        {/* stack */}
        <div className="relative h-52">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute w-full h-13 bg-neutral-200 rounded-full"
              style={{
                transform: `translateY(${i * 40}px) scale(${1 - i * 0.1})`,
                opacity: 0.7 - i * 0.2,
              }}
            />
          ))}
        </div>

        {/* button */}
        <div className="h-12 w-full bg-neutral-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">

      {/* HEADER */}
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-100 mb-2">
          <Zap className="w-6 h-6 text-neutral-900" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Bassins d&apos;interaction
        </h2>

        <p className="text-neutral-500 text-sm leading-relaxed">
          Quels comptes génèrent l&apos;engagement que vous convoitez ?
        </p>
      </div>

      {/* INPUT */}
      <div className="flex gap-2 items-center justify-center h-13">
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="URL LinkedIn..."
          className={[
            "h-13 rounded-full border bg-white px-5 text-sm transition-all duration-300",
            inputOpen
              ? "flex-1 opacity-100"
              : "w-0 opacity-0 px-0 border-0 pointer-events-none",
          ].join(" ")}
        />

        <Button
          onClick={() =>
            isLimitReached && !inputOpen
              ? null
              : inputOpen
              ? addItem()
              : setInputOpen(true)
          }
          disabled={isLimitReached && !inputOpen}
          className="w-13 h-13 rounded-full bg-neutral-900 text-white text-2xl shrink-0"
        >
          {inputOpen ? "✓" : "+"}
        </Button>
      </div>

      {/* STACK */}
      <div className="relative flex flex-col items-center h-52 w-full mt-6">
        {items.map((item, i) => {
          const distance = i - activeIndex;
          const isActive = i === activeIndex;

          return (
            <div
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`absolute w-full cursor-pointer border rounded-full h-13 flex items-center px-5 transition-all duration-300 ${
                isActive
                  ? "bg-white border-gray-200 shadow-lg"
                  : "bg-[#F5F5F3] border-transparent"
              }`}
              style={{
                transform: `translateY(${distance * 48}px) scale(${
                  1 - Math.abs(distance) * 0.12
                })`,
                zIndex: 50 - Math.abs(distance),
              }}
            >
              <span
                className={`flex-1 text-sm truncate ${
                  isActive ? "text-gray-800 font-medium" : "text-gray-400"
                }`}
              >
                {item.url}
              </span>

              {isActive && (
                <button
                  onClick={(e) => removeItem(e, item)}
                  className="ml-2 text-gray-300 hover:text-red-500 text-2xl"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <Button
        onClick={handleSubmit}
        disabled={!items.length || loading}
        className="bg-neutral-900 w-full h-12 rounded-xl"
      >
        {loading ? "Sauvegarde..." : "Continuer"}
      </Button>
    </div>
  );
}