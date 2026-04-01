"use client";

import { Todo } from "@/lib/types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={`
        flex items-center gap-3 p-3 border-2 transition-all
        ${
          todo.completed
            ? "border-mmx-gray/40 bg-mmx-bg/40 opacity-60"
            : "border-mmx-cyan bg-mmx-panel hover:border-mmx-orange hover:bg-mmx-bg"
        }
      `}
      data-testid="todo-item"
    >
      {/* Toggle button */}
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        data-testid="todo-toggle"
        className={`
          flex-shrink-0 w-6 h-6 border-2 flex items-center justify-center
          font-pixel text-xs transition-colors
          ${
            todo.completed
              ? "border-mmx-green bg-mmx-green text-mmx-bg"
              : "border-mmx-cyan bg-transparent text-mmx-cyan hover:border-mmx-orange hover:text-mmx-orange"
          }
        `}
      >
        {todo.completed ? "✔" : " "}
      </button>

      {/* Todo text */}
      <span
        className={`
          flex-1 text-xs tracking-wide leading-relaxed break-all
          ${
            todo.completed
              ? "line-through text-mmx-gray"
              : "text-white"
          }
        `}
      >
        {todo.text}
      </span>

      {/* Status badge */}
      {todo.completed && (
        <span className="flex-shrink-0 text-xs text-mmx-green/70 tracking-widest hidden sm:block">
          DONE
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.text}`}
        data-testid="todo-delete"
        className="
          flex-shrink-0 w-7 h-7 border-2 border-mmx-orange/60
          text-mmx-orange/60 text-xs font-pixel
          flex items-center justify-center
          hover:border-mmx-red hover:text-mmx-red
          hover:bg-mmx-red/10
          transition-colors
        "
      >
        ✕
      </button>
    </div>
  );
}
