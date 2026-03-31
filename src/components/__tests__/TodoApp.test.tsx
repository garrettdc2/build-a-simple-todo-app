import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoApp from "@/components/TodoApp";

// Mock crypto.randomUUID for deterministic IDs in tests
let uuidCounter = 0;
const mockUUID = jest.fn(() => `test-uuid-${++uuidCounter}`);
Object.defineProperty(globalThis, "crypto", {
  value: { randomUUID: mockUUID },
  writable: true,
});

// localStorage mock is provided by jest-environment-jsdom
const STORAGE_KEY = "sft8-todos";

beforeEach(() => {
  uuidCounter = 0;
  mockUUID.mockClear();
  localStorage.clear();
});

describe("TodoApp", () => {
  describe("initial render", () => {
    it("renders the MEGA TODO heading", async () => {
      render(<TodoApp />);
      await waitFor(() => {
        expect(screen.getByText("MEGA TODO")).toBeInTheDocument();
      });
    });

    it("renders the input panel prompt", async () => {
      render(<TodoApp />);
      await waitFor(() => {
        expect(screen.getByText(/ENTER MISSION/i)).toBeInTheDocument();
      });
    });

    it("shows empty state initially when localStorage is empty", async () => {
      render(<TodoApp />);
      await waitFor(() => {
        expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument();
      });
    });

    it("shows LOADING state before hydration completes then resolves to list", async () => {
      render(<TodoApp />);
      // After hydration, either loading or list should be shown
      await waitFor(() => {
        // After async hydration, loading disappears
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument();
      });
    });
  });

  describe("adding todos", () => {
    it("adds a new todo when text is typed and submitted via button", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Defeat Bospider");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));

      expect(screen.getByText("Defeat Bospider")).toBeInTheDocument();
    });

    it("adds a new todo when Enter is pressed", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Defeat Rangda Bangda{Enter}"
      );

      expect(screen.getByText("Defeat Rangda Bangda")).toBeInTheDocument();
    });

    it("clears input field after adding a todo", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "New mission{Enter}");
      expect(input).toHaveValue("");
    });

    it("does not add a todo for whitespace-only input", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      // Button should be disabled for whitespace
      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "   "
      );
      expect(screen.getByRole("button", { name: /\+ ADD/i })).toBeDisabled();
    });

    it("trims whitespace from todo text before adding", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      // Type text with leading/trailing spaces via direct input manipulation
      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "  Trimmed mission  ");
      await userEvent.click(screen.getByRole("button", { name: /\+ ADD/i }));

      expect(screen.getByText("Trimmed mission")).toBeInTheDocument();
    });

    it("adds multiple todos and shows them all", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Mission 1{Enter}");
      await userEvent.type(input, "Mission 2{Enter}");
      await userEvent.type(input, "Mission 3{Enter}");

      expect(screen.getByText("Mission 1")).toBeInTheDocument();
      expect(screen.getByText("Mission 2")).toBeInTheDocument();
      expect(screen.getByText("Mission 3")).toBeInTheDocument();
    });

    it("removes empty-state message once a todo is added", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "First mission{Enter}");

      expect(screen.queryByText("NO MISSIONS FOUND.")).not.toBeInTheDocument();
    });
  });

  describe("toggling todos", () => {
    it("marks a todo complete when toggle button is clicked", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Toggle me{Enter}"
      );

      await userEvent.click(
        screen.getByRole("button", { name: /mark complete/i })
      );

      expect(
        screen.getByRole("button", { name: /mark incomplete/i })
      ).toBeInTheDocument();
    });

    it("marks a completed todo incomplete when toggle is clicked again", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Toggle me twice{Enter}"
      );

      // Toggle to complete
      await userEvent.click(
        screen.getByRole("button", { name: /mark complete/i })
      );
      // Toggle back to incomplete
      await userEvent.click(
        screen.getByRole("button", { name: /mark incomplete/i })
      );

      expect(
        screen.getByRole("button", { name: /mark complete/i })
      ).toBeInTheDocument();
    });

    it("shows DONE badge after toggling complete", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Show done{Enter}"
      );

      await userEvent.click(
        screen.getByRole("button", { name: /mark complete/i })
      );

      expect(screen.getByText("DONE")).toBeInTheDocument();
    });
  });

  describe("deleting todos", () => {
    it("removes a todo when delete button is clicked", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Delete me{Enter}"
      );
      expect(screen.getByText("Delete me")).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: /delete todo/i })
      );

      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    });

    it("shows empty state after last todo is deleted", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Only todo{Enter}"
      );

      await userEvent.click(
        screen.getByRole("button", { name: /delete todo/i })
      );

      expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument();
    });

    it("only deletes the targeted todo when multiple are present", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Keep me{Enter}");
      await userEvent.type(input, "Delete me{Enter}");

      const deleteButtons = screen.getAllByRole("button", {
        name: /delete todo/i,
      });
      // Delete the second todo (index 1)
      await userEvent.click(deleteButtons[1]);

      expect(screen.getByText("Keep me")).toBeInTheDocument();
      expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    });
  });

  describe("localStorage persistence", () => {
    it("persists todos to localStorage when added", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Persist me{Enter}"
      );

      await waitFor(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        expect(stored).not.toBeNull();
        const parsed = JSON.parse(stored!);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].text).toBe("Persist me");
      });
    });

    it("loads existing todos from localStorage on mount", async () => {
      const existingTodos = [
        { id: "pre-1", text: "Pre-existing mission", completed: false },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTodos));

      render(<TodoApp />);

      await waitFor(() => {
        expect(screen.getByText("Pre-existing mission")).toBeInTheDocument();
      });
    });

    it("restores completed state from localStorage", async () => {
      const existingTodos = [
        { id: "pre-2", text: "Already done", completed: true },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingTodos));

      render(<TodoApp />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /mark incomplete/i })
        ).toBeInTheDocument();
        expect(screen.getByText("DONE")).toBeInTheDocument();
      });
    });

    it("handles corrupted localStorage gracefully (starts fresh)", async () => {
      localStorage.setItem(STORAGE_KEY, "NOT_VALID_JSON");

      render(<TodoApp />);

      await waitFor(() => {
        // Should not crash — shows empty state
        expect(screen.getByText("NO MISSIONS FOUND.")).toBeInTheDocument();
      });
    });

    it("persists toggle state to localStorage", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Toggle and persist{Enter}"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /mark complete/i })
      );

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored[0].completed).toBe(true);
      });
    });

    it("removes deleted todos from localStorage", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      await userEvent.type(
        screen.getByPlaceholderText("MISSION NAME..."),
        "Delete from storage{Enter}"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /delete todo/i })
      );

      await waitFor(() => {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored).toHaveLength(0);
      });
    });
  });

  describe("active missions counter", () => {
    it("shows correct active/total count after adding todos", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Mission A{Enter}");
      await userEvent.type(input, "Mission B{Enter}");

      // Both active: "ACTIVE MISSIONS (2/2):"
      expect(screen.getByText(/ACTIVE MISSIONS \(2\/2\)/i)).toBeInTheDocument();
    });

    it("updates counter when a todo is completed", async () => {
      render(<TodoApp />);
      await waitFor(() =>
        expect(screen.queryByText("LOADING...")).not.toBeInTheDocument()
      );

      const input = screen.getByPlaceholderText("MISSION NAME...");
      await userEvent.type(input, "Mission A{Enter}");
      await userEvent.type(input, "Mission B{Enter}");

      await userEvent.click(
        screen.getAllByRole("button", { name: /mark complete/i })[0]
      );

      // 1 active out of 2
      expect(screen.getByText(/ACTIVE MISSIONS \(1\/2\)/i)).toBeInTheDocument();
    });
  });
});
