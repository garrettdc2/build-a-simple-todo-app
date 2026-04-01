"use client";

import { useState, useEffect, useCallback } from "react";
import { Todo } from "@/lib/types";
import AddTodoForm from "@/components/AddTodoForm";
import TodoItem from "@/components/TodoItem";
import HealthBar from "@/components/HealthBar";

const STORAGE_KEY = "sft22-todos";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTodos(JSON.parse(stored) as Todo[]);
      }
    } catch {
      // If storage is corrupted, start fresh
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }, [todos, hydrated]);

  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, completed: false },
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-lg">
      {/* Title */}
      <div className="text-center mb-8">
        <h1
          className="text-mmx-cyan text-sm leading-loose tracking-widest pixel-border inline-block px-6 py-3 bg-mmx-panel uppercase"
          data-testid="app-title"
        >
          ⚡ Mega TODO X ⚡
        </h1>
        <p className="text-mmx-orange text-[10px] mt-4 tracking-wider">
          [ SFT-22 // HUNTER MISSION LOG ]
        </p>
      </div>

      {/* Decorative color bar — stage-select motif */}
      <div className="flex gap-1 mb-6" data-testid="stage-select-bar">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 ${
              i % 4 === 0
                ? "bg-mmx-orange"
                : i % 4 === 1
                ? "bg-mmx-cyan"
                : i % 4 === 2
                ? "bg-mmx-green"
                : "bg-mmx-red"
            }`}
          />
        ))}
      </div>

      {/* Health Bar — Mega Man X boss health meter (AC #8) */}
      <HealthBar completed={completedCount} total={todos.length} />

      {/* Input panel */}
      <div className="pixel-border bg-mmx-panel p-6 mb-8">
        <p className="text-mmx-orange text-xs mb-4 tracking-widest font-pixel">
          &gt; ENTER MISSION:
        </p>
        <AddTodoForm onAdd={addTodo} />
      </div>

      {/* Todo list panel */}
      <div className="pixel-border bg-mmx-panel p-6">
        <p className="text-mmx-cyan text-xs mb-4 tracking-widest font-pixel">
          &gt; ACTIVE MISSIONS ({todos.filter((t) => !t.completed).length}/
          {todos.length}):
        </p>
        {hydrated ? (
          <ul className="space-y-3" data-testid="todo-list">
            {todos.length === 0 ? (
              <li className="py-10 text-center">
                <p className="text-mmx-gray text-xs tracking-widest leading-loose">
                  NO MISSIONS FOUND.
                  <br />
                  <span className="text-mmx-cyan/60">
                    ADD A MISSION TO BEGIN.
                  </span>
                </p>
              </li>
            ) : (
              todos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                </li>
              ))
            )}
          </ul>
        ) : (
          <p className="text-mmx-cyan text-xs text-center py-6 tracking-widest">
            LOADING...
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-6" data-testid="mmx-footer">
        <p className="text-mmx-gray text-[8px] tracking-widest opacity-60 font-pixel">
          © 21XX MAVERICK HUNTER HQ
        </p>
      </div>
    </div>
  );
}
