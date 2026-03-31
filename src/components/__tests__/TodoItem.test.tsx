import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "@/components/TodoItem";
import { Todo } from "@/types/todo";

const baseTodo: Todo = {
  id: "test-id-1",
  text: "Defeat Sigma",
  completed: false,
};

const completedTodo: Todo = {
  id: "test-id-2",
  text: "Collect all heart tanks",
  completed: true,
};

describe("TodoItem", () => {
  describe("rendering", () => {
    it("renders the todo text", () => {
      render(
        <TodoItem todo={baseTodo} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("Defeat Sigma")).toBeInTheDocument();
    });

    it("renders a toggle button with aria-label 'Mark complete' for incomplete todo", () => {
      render(
        <TodoItem todo={baseTodo} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(
        screen.getByRole("button", { name: /mark complete/i })
      ).toBeInTheDocument();
    });

    it("renders a toggle button with aria-label 'Mark incomplete' for completed todo", () => {
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      expect(
        screen.getByRole("button", { name: /mark incomplete/i })
      ).toBeInTheDocument();
    });

    it("renders a delete button", () => {
      render(
        <TodoItem todo={baseTodo} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(
        screen.getByRole("button", { name: /delete todo/i })
      ).toBeInTheDocument();
    });

    it("shows 'DONE' badge for completed todo", () => {
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      expect(screen.getByText("DONE")).toBeInTheDocument();
    });

    it("does not show 'DONE' badge for incomplete todo", () => {
      render(
        <TodoItem todo={baseTodo} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.queryByText("DONE")).not.toBeInTheDocument();
    });

    it("applies line-through class to completed todo text span", () => {
      const { container } = render(
        <TodoItem
          todo={completedTodo}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      const span = container.querySelector("span.line-through");
      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe("Collect all heart tanks");
    });

    it("does NOT apply line-through class to incomplete todo text span", () => {
      const { container } = render(
        <TodoItem todo={baseTodo} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      const span = container.querySelector("span.line-through");
      expect(span).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onToggle with the todo id when toggle button is clicked", async () => {
      const onToggle = jest.fn();
      render(
        <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={jest.fn()} />
      );
      await userEvent.click(
        screen.getByRole("button", { name: /mark complete/i })
      );
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith("test-id-1");
    });

    it("calls onDelete with the todo id when delete button is clicked", async () => {
      const onDelete = jest.fn();
      render(
        <TodoItem todo={baseTodo} onToggle={jest.fn()} onDelete={onDelete} />
      );
      await userEvent.click(
        screen.getByRole("button", { name: /delete todo/i })
      );
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith("test-id-1");
    });

    it("calls onToggle on completed todo (toggle back to incomplete)", async () => {
      const onToggle = jest.fn();
      render(
        <TodoItem
          todo={completedTodo}
          onToggle={onToggle}
          onDelete={jest.fn()}
        />
      );
      await userEvent.click(
        screen.getByRole("button", { name: /mark incomplete/i })
      );
      expect(onToggle).toHaveBeenCalledWith("test-id-2");
    });
  });

  describe("edge cases", () => {
    it("renders correctly with very long todo text without crashing", () => {
      const longTodo: Todo = {
        id: "long-id",
        text: "A".repeat(120),
        completed: false,
      };
      render(
        <TodoItem todo={longTodo} onToggle={jest.fn()} onDelete={jest.fn()} />
      );
      expect(screen.getByText("A".repeat(120))).toBeInTheDocument();
    });

    it("renders correctly with special characters in text", () => {
      const specialTodo: Todo = {
        id: "special-id",
        text: "<script>alert('xss')</script>",
        completed: false,
      };
      render(
        <TodoItem
          todo={specialTodo}
          onToggle={jest.fn()}
          onDelete={jest.fn()}
        />
      );
      // Text should be rendered as text content, not executed as HTML
      expect(
        screen.getByText("<script>alert('xss')</script>")
      ).toBeInTheDocument();
    });
  });
});
