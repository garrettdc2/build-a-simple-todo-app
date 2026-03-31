import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "@/components/TodoList";
import { Todo } from "@/types/todo";

const mockTodos: Todo[] = [
  { id: "1", text: "Defeat Vile", completed: false },
  { id: "2", text: "Upgrade arm cannon", completed: true },
  { id: "3", text: "Find all sub-tanks", completed: false },
];

describe("TodoList", () => {
  describe("empty state", () => {
    it("shows 'NO MISSIONS FOUND.' message when todos is empty", () => {
      render(
        <TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument();
    });

    it("shows 'ADD A MISSION TO BEGIN.' hint in empty state", () => {
      render(
        <TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("ADD A MISSION TO BEGIN.")).toBeInTheDocument();
    });

    it("does not render any list items in empty state", () => {
      render(
        <TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });
  });

  describe("list rendering", () => {
    it("renders all todo items", () => {
      render(
        <TodoList todos={mockTodos} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("Defeat Vile")).toBeInTheDocument();
      expect(screen.getByText("Upgrade arm cannon")).toBeInTheDocument();
      expect(screen.getByText("Find all sub-tanks")).toBeInTheDocument();
    });

    it("renders the correct number of list items", () => {
      render(
        <TodoList todos={mockTodos} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getAllByRole("listitem")).toHaveLength(3);
    });

    it("does not show empty state when todos are present", () => {
      render(
        <TodoList todos={mockTodos} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.queryByText("NO MISSIONS FOUND.")).not.toBeInTheDocument();
    });

    it("renders a single todo correctly", () => {
      const singleTodo: Todo[] = [
        { id: "solo-1", text: "Solo mission", completed: false },
      ];
      render(
        <TodoList
          todos={singleTodo}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      expect(screen.getByText("Solo mission")).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(1);
    });
  });

  describe("prop delegation", () => {
    it("delegates onToggle to TodoItem correctly", async () => {
      const onToggle = jest.fn();
      render(
        <TodoList
          todos={mockTodos}
          onToggle={onToggle}
          onDelete={jest.fn()}
        />
      );
      const markCompleteButtons = screen.getAllByRole("button", {
        name: /mark complete/i,
      });
      await userEvent.click(markCompleteButtons[0]);
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith("1");
    });

    it("delegates onDelete to TodoItem correctly", async () => {
      const onDelete = jest.fn();
      render(
        <TodoList
          todos={mockTodos}
          onToggle={jest.fn()}
          onDelete={onDelete}
        />
      );
      // Click the first delete button
      const deleteButtons = screen.getAllByRole("button", {
        name: /delete todo/i,
      });
      await userEvent.click(deleteButtons[0]);
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith("1");
    });
  });

  describe("edge cases", () => {
    it("renders correctly when transitioning from empty to one todo", () => {
      const { rerender } = render(
        <TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument();

      rerender(
        <TodoList
          todos={[{ id: "new-1", text: "New mission", completed: false }]}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      expect(screen.queryByText("NO MISSIONS FOUND.")).not.toBeInTheDocument();
      expect(screen.getByText("New mission")).toBeInTheDocument();
    });

    it("renders correctly when transitioning from todos to empty", () => {
      const { rerender } = render(
        <TodoList todos={mockTodos} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.queryByText("NO MISSIONS FOUND.")).not.toBeInTheDocument();

      rerender(
        <TodoList todos={[]} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument();
    });
  });
});
