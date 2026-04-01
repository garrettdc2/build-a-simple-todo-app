"use client";

import { useState, KeyboardEvent } from "react";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-3 items-stretch">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="MISSION NAME..."
        maxLength={120}
        className="
          flex-1
          bg-megaman-navy
          border-2 border-megaman-blue
          text-megaman-blue
          placeholder:text-megaman-blue/40
          text-xs
          px-4 py-3
          font-pressStart
          tracking-wider
          outline-none
          focus:border-megaman-yellow
          focus:text-megaman-yellow
          transition-colors
        "
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="
          bg-megaman-orange
          text-megaman-dark
          text-xs
          px-5 py-3
          font-pressStart
          tracking-wider
          border-2 border-megaman-orange
          hover:bg-megaman-yellow
          hover:border-megaman-yellow
          disabled:opacity-40
          disabled:cursor-not-allowed
          transition-colors
          active:translate-y-px
          whitespace-nowrap
        "
      >
        + ADD
      </button>
    </div>
  );
}
