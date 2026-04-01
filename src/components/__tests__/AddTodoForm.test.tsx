import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodoForm from "@/components/AddTodoForm";

describe("AddTodoForm", () => {
  describe("rendering", () => {
    it("renders the text input with placeholder", () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      expect(
        screen.getByPlaceholderText("ENTER MISSION...")
      ).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      expect(
        screen.getByRole("button", { name: /\+ ADD/i })
      ).toBeInTheDocument();
    });

    it("submit button is disabled when input is empty", () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      expect(screen.getByRole("button", { name: /\+ ADD/i })).toBeDisabled();
    });

    it("submit button is enabled when input has non-whitespace text", async () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      await userEvent.type(
        screen.getByPlaceholderText("ENTER MISSION..."),
        "X"
      );
      expect(
        screen.getByRole("button", { name: /\+ ADD/i })
      ).not.toBeDisabled();
    });

    it("submit button is disabled when input contains only whitespace", async () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      await userEvent.type(
        screen.getByPlaceholderText("ENTER MISSION..."),
        "   "
      );
      expect(screen.getByRole("button", { name: /\+ ADD/i })).toBeDisabled();
    });

    it("has aria-label 'New TODO' on the input", () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      expect(screen.getByLabelText("New TODO")).toBeInTheDocument();
    });

    it("has maxLength of 120 on the input", () => {
      render(<AddTodoForm onAdd={jest.fn()} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      expect(input).toHaveAttribute("maxLength", "120");
    });
  });

  describe("submit via button click", () => {
    it("calls onAdd with the trimmed input value when button is clicked", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "Defeat Storm Eagle");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));
      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledWith("Defeat Storm Eagle");
    });

    it("clears the input field after submission", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "Defeat Chill Penguin");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));
      expect(input).toHaveValue("");
    });

    it("does not call onAdd when input is empty and button is disabled", () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const button = screen.getByRole("button", { name: /\+ ADD/i });
      expect(button).toBeDisabled();
      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe("submit via Enter key", () => {
    it("calls onAdd when Enter is pressed with non-empty input", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "Defeat Flame Mammoth{Enter}");
      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledWith("Defeat Flame Mammoth");
    });

    it("clears the input after Enter key submission", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "Defeat Spark Mandrill{Enter}");
      expect(input).toHaveValue("");
    });

    it("does not call onAdd when Enter is pressed on empty input", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "{Enter}");
      expect(onAdd).not.toHaveBeenCalled();
    });

    it("does not call onAdd when Enter is pressed on whitespace-only input", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "   {Enter}");
      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("handles input at max length (120 chars)", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      const longText = "X".repeat(120);
      await userEvent.type(input, longText);
      expect(
        screen.getByRole("button", { name: /\+ ADD/i })
      ).not.toBeDisabled();
    });

    it("trims whitespace before calling onAdd", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      await userEvent.type(input, "  spaced out  ");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));
      expect(onAdd).toHaveBeenCalledWith("spaced out");
    });

    it("handleSubmit guards against empty trimmed text (direct form submit)", async () => {
      // This covers AddTodoForm line 15: the `if (!trimmed) return` guard.
      // Even though the button is disabled for whitespace, a form submit can
      // still be triggered programmatically. We simulate by typing whitespace
      // then submitting the form directly.
      const onAdd = jest.fn();
      const { container } = render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");
      const form = container.querySelector("form")!;

      // Set the input to whitespace (button is disabled, but form submit still works)
      await userEvent.type(input, "   ");
      form.requestSubmit();

      expect(onAdd).not.toHaveBeenCalled();
      // Input should retain its value since no submission happened
      expect(input).toHaveValue("   ");
    });

    it("does not retain the previous value after two separate submissions", async () => {
      const onAdd = jest.fn();
      render(<AddTodoForm onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("ENTER MISSION...");

      await userEvent.type(input, "First mission{Enter}");
      await userEvent.type(input, "Second mission{Enter}");

      expect(onAdd).toHaveBeenCalledTimes(2);
      expect(onAdd).toHaveBeenNthCalledWith(1, "First mission");
      expect(onAdd).toHaveBeenNthCalledWith(2, "Second mission");
      expect(input).toHaveValue("");
    });
  });
});
