"use client";

import { useState, useEffect } from "react";
import { Todo } from "@/types/todo";
import TodoInput from "@/components/TodoInput";
import TodoList from "@/components/TodoList";

const STORAGE_KEY = "sft8-todos";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read from localStorage after hydration
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTodos(JSON.parse(raw) as Todo[]);
      }
    } catch {
      // If storage is corrupted, start fresh
      setTodos([]);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, hydrated]);

  function addTodo(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ]);
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-megaman-yellow text-xl leading-loose tracking-widest pixel-border-yellow inline-block px-6 py-3 bg-megaman-dark">
          MEGA TODO
        </h1>
        <p className="text-megaman-blue text-xs mt-6 tracking-wider">
          [ SFT-8 // PRESS START ]
        </p>
      </div>

      {/* Decorative top bar */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 ${
              i % 4 === 0
                ? "bg-megaman-orange"
                : i % 4 === 1
                ? "bg-megaman-blue"
                : i % 4 === 2
                ? "bg-megaman-purple"
                : "bg-megaman-yellow"
            }`}
          />
        ))}
      </div>

      {/* Input panel */}
      <div className="pixel-border bg-megaman-dark p-6 mb-8">
        <p className="text-megaman-orange text-xs mb-4 tracking-widest">
          &gt; ENTER MISSION:
        </p>
        <TodoInput onAdd={addTodo} />
      </div>

      {/* Todo list panel */}
      <div className="pixel-border bg-megaman-dark p-6">
        <p className="text-megaman-blue text-xs mb-4 tracking-widest">
          &gt; ACTIVE MISSIONS ({todos.filter((t) => !t.completed).length}/
          {todos.length}):
        </p>
        {hydrated ? (
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        ) : (
          <p className="text-megaman-purple text-xs text-center py-6 tracking-widest">
            LOADING...
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-megaman-purple text-xs tracking-widest opacity-60">
          &copy; {new Date().getFullYear()} MEGA CORP // ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}
