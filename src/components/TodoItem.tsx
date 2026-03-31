"use client";

import { Todo } from "@/types/todo";

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
            ? "border-megaman-purple/40 bg-megaman-navy/40 opacity-60"
            : "border-megaman-blue bg-megaman-navy hover:border-megaman-yellow hover:bg-megaman-dark"
        }
      `}
    >
      {/* Checkbox / Toggle */}
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        className={`
          flex-shrink-0 w-6 h-6 border-2 flex items-center justify-center
          font-pressStart text-xs transition-colors
          ${
            todo.completed
              ? "border-megaman-purple bg-megaman-purple text-megaman-dark"
              : "border-megaman-blue bg-transparent text-megaman-blue hover:border-megaman-yellow hover:text-megaman-yellow"
          }
        `}
      >
        {todo.completed ? "X" : " "}
      </button>

      {/* Todo text */}
      <span
        className={`
          flex-1 text-xs tracking-wide leading-relaxed break-all
          ${
            todo.completed
              ? "line-through text-megaman-purple/70"
              : "text-megaman-blue"
          }
        `}
      >
        {todo.text}
      </span>

      {/* Status badge */}
      {todo.completed && (
        <span className="flex-shrink-0 text-xs text-megaman-purple/70 tracking-widest hidden sm:block">
          DONE
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
        className="
          flex-shrink-0 w-7 h-7 border-2 border-megaman-orange/60
          text-megaman-orange/60 text-xs font-pressStart
          flex items-center justify-center
          hover:border-megaman-orange hover:text-megaman-orange
          hover:bg-megaman-orange/10
          transition-colors
        "
      >
        X
      </button>
    </div>
  );
}
