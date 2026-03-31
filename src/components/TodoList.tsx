"use client";

import { Todo } from "@/types/todo";
import TodoItem from "@/components/TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-megaman-purple text-xs tracking-widest leading-loose">
          NO MISSIONS FOUND.
          <br />
          <span className="text-megaman-blue/60">
            ADD A MISSION TO BEGIN.
          </span>
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {["[", "X", "]"].map((char, i) => (
            <span
              key={i}
              className={`text-lg font-pressStart ${
                char === "X" ? "text-megaman-orange" : "text-megaman-blue/40"
              }`}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li key={todo.id}>
          <TodoItem todo={todo} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
