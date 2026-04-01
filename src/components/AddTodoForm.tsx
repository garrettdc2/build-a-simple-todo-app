"use client";

import { useState, FormEvent } from "react";

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

export default function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-stretch">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ENTER MISSION..."
        maxLength={120}
        aria-label="New TODO"
        className="
          flex-1 bg-mmx-bg border-2 border-mmx-cyan text-white
          placeholder:text-mmx-gray text-xs px-4 py-3
          font-pixel tracking-wider outline-none
          focus:border-mmx-orange focus:text-mmx-orange
          transition-colors
        "
      />
      <button
        type="submit"
        disabled={!text.trim()}
        className="
          bg-mmx-orange text-mmx-bg text-xs px-5 py-3
          font-pixel tracking-wider border-2 border-mmx-orange
          hover:bg-mmx-cyan hover:border-mmx-cyan
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors active:translate-y-px whitespace-nowrap
        "
      >
        + ADD
      </button>
    </form>
  );
}
