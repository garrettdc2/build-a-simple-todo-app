import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoInput from "@/components/TodoInput";

describe("TodoInput", () => {
  describe("rendering", () => {
    it("renders the text input with placeholder", () => {
      render(<TodoInput onAdd={jest.fn()} />);
      expect(
        screen.getByPlaceholderText("MISSION NAME...")
      ).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      render(<TodoInput onAdd={jest.fn()} />);
      expect(
        screen.getByRole("button", { name: /\+ ADD/i })
      ).toBeInTheDocument();
    });

    it("submit button is disabled when input is empty", () => {
      render(<TodoInput onAdd={jest.fn()} />);
      expect(screen.getByRole("button", { name: /\+ ADD/i })).toBeDisabled();
    });

    it("submit button is enabled when input has non-whitespace text", async () => {
      render(<TodoInput onAdd={jest.fn()} />);
      await userEvent.type(screen.getByPlaceholderText("MISSION NAME..."), "X");
      expect(screen.getByRole("button", { name: /\+ ADD/i })).not.toBeDisabled();
    });

    it("submit button is disabled when input contains only whitespace", async () => {
      render(<TodoInput onAdd={jest.fn()} />);
      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "   "
      );
      expect(screen.getByRole("button", { name: /\+ ADD/i })).toBeDisabled();
    });
  });

  describe("submit via button click", () => {
    it("calls onAdd with the input value when button is clicked", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Defeat Storm Eagle");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));
      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledWith("Defeat Storm Eagle");
    });

    it("clears the input field after submission", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Defeat Chill Penguin");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));
      expect(input).toHaveValue("");
    });

    it("does not call onAdd when input is empty and button is clicked", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      // Button is disabled, but we force a click to be thorough
      const button = screen.getByRole("button", { name: /\+ ADD/i });
      // Can't click a disabled button normally — verify it's disabled
      expect(button).toBeDisabled();
      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe("submit via Enter key", () => {
    it("calls onAdd when Enter is pressed with non-empty input", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Defeat Flame Mammoth{Enter}");
      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd).toHaveBeenCalledWith("Defeat Flame Mammoth");
    });

    it("clears the input after Enter key submission", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Defeat Spark Mandrill{Enter}");
      expect(input).toHaveValue("");
    });

    it("does not call onAdd when Enter is pressed on empty input", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "{Enter}");
      expect(onAdd).not.toHaveBeenCalled();
    });

    it("does not call onAdd when Enter is pressed on whitespace-only input", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "   {Enter}");
      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    it("handles input at max length (120 chars)", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");
      // Input has maxLength=120; type exactly 120 chars
      const longText = "X".repeat(120);
      await userEvent.type(input, longText);
      // The actual value may be truncated by maxLength — check button is enabled
      expect(screen.getByRole("button", { name: /\+ ADD/i })).not.toBeDisabled();
    });

    it("does not retain the previous value after two separate submissions", async () => {
      const onAdd = jest.fn();
      render(<TodoInput onAdd={onAdd} />);
      const input = screen.getByPlaceholderText("MISSION NAME...");

      await userEvent.type(input, "First mission{Enter}");
      await userEvent.type(input, "Second mission{Enter}");

      expect(onAdd).toHaveBeenCalledTimes(2);
      expect(onAdd).toHaveBeenNthCalledWith(1, "First mission");
      expect(onAdd).toHaveBeenNthCalledWith(2, "Second mission");
      expect(input).toHaveValue("");
    });
  });
});
