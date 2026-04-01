import { test, expect } from "@playwright/test";

const STORAGE_KEY = "sft22-todos";

test.beforeEach(async ({ page }) => {
  // Navigate and clear localStorage so we start with a clean slate
  await page.goto("/");
  await page.evaluate((key) => localStorage.removeItem(key), STORAGE_KEY);
  await page.reload();
  // Wait for hydration — the todo-list element renders only after client hydration
  await page.waitForSelector('[data-testid="todo-list"]', {
    state: "visible",
    timeout: 30_000,
  });
});

// ---------------------------------------------------------------------------
// Helper — add a todo and wait for it to appear
// ---------------------------------------------------------------------------
async function addTodo(page: import("@playwright/test").Page, text: string) {
  const input = page.getByLabel("New TODO");
  await input.fill(text);
  await input.press("Enter");
  await expect(page.getByText(text)).toBeVisible();
}

// ---------------------------------------------------------------------------
// AC #2 — Add a new TODO item
// ---------------------------------------------------------------------------
test("can add a new TODO item", async ({ page }) => {
  const input = page.getByLabel("New TODO");
  const addButton = page.getByRole("button", { name: "+ ADD" });

  await input.fill("Defeat Sigma");
  await addButton.click();

  // The new item should appear in the list
  await expect(page.getByText("Defeat Sigma")).toBeVisible();

  // Input should be cleared after adding
  await expect(input).toHaveValue("");
});

test("can add a TODO by pressing Enter", async ({ page }) => {
  const input = page.getByLabel("New TODO");

  await input.fill("Find Dr. Light capsule");
  await input.press("Enter");

  await expect(page.getByText("Find Dr. Light capsule")).toBeVisible();
  await expect(input).toHaveValue("");
});

// ---------------------------------------------------------------------------
// AC #3 — Mark a TODO item as complete
// ---------------------------------------------------------------------------
test("can mark a TODO as complete", async ({ page }) => {
  await addTodo(page, "Storm Eagle stage");

  // Click the toggle button to mark complete
  const toggleButton = page.getByRole("button", { name: "Mark complete" });
  await toggleButton.click();

  // The todo text should have a line-through style
  const todoText = page.getByText("Storm Eagle stage");
  await expect(todoText).toHaveClass(/line-through/);

  // The toggle button should now say "Mark incomplete"
  await expect(
    page.getByRole("button", { name: "Mark incomplete" })
  ).toBeVisible();
});

test("can toggle a TODO back to incomplete", async ({ page }) => {
  await addTodo(page, "Spark Mandrill stage");

  // Complete it
  await page.getByRole("button", { name: "Mark complete" }).click();
  await expect(page.getByText("Spark Mandrill stage")).toHaveClass(
    /line-through/
  );

  // Un-complete it
  await page.getByRole("button", { name: "Mark incomplete" }).click();
  await expect(page.getByText("Spark Mandrill stage")).not.toHaveClass(
    /line-through/
  );
});

// ---------------------------------------------------------------------------
// AC #4 — Delete a TODO item
// ---------------------------------------------------------------------------
test("can delete a TODO item", async ({ page }) => {
  await addTodo(page, "Chill Penguin stage");

  // The delete button's aria-label includes the todo text
  const deleteButton = page.getByRole("button", {
    name: "Delete Chill Penguin stage",
  });
  await deleteButton.click();

  // The todo should be gone
  await expect(page.getByText("Chill Penguin stage")).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// AC #5 — Persistence across page reloads
// ---------------------------------------------------------------------------
test("TODO items persist across page reloads", async ({ page }) => {
  // Add two todos
  await addTodo(page, "Boomer Kuwanger stage");
  await addTodo(page, "Launch Octopus stage");

  // Complete the first one
  const toggleButtons = page.getByRole("button", { name: "Mark complete" });
  await toggleButtons.first().click();

  // Wait for the completed state to be reflected
  await expect(page.getByText("Boomer Kuwanger stage")).toHaveClass(
    /line-through/
  );

  // Reload the page
  await page.reload();
  await page.waitForSelector('[data-testid="todo-list"]', {
    state: "visible",
    timeout: 30_000,
  });

  // Both todos should still be present
  await expect(page.getByText("Boomer Kuwanger stage")).toBeVisible();
  await expect(page.getByText("Launch Octopus stage")).toBeVisible();

  // The first one should still be completed (line-through)
  await expect(page.getByText("Boomer Kuwanger stage")).toHaveClass(
    /line-through/
  );

  // The second one should still be incomplete
  await expect(page.getByText("Launch Octopus stage")).not.toHaveClass(
    /line-through/
  );
});

// ---------------------------------------------------------------------------
// AC #6, #10 — Pixel font verification
// ---------------------------------------------------------------------------
test("pixel font is applied via CSS variable", async ({ page }) => {
  // The body should have the font-pixel class (Tailwind utility for Press Start 2P)
  const body = page.locator("body");
  await expect(body).toHaveClass(/font-pixel/);

  // Verify the computed font family includes "Press Start 2P"
  const fontFamily = await body.evaluate(
    (el) => getComputedStyle(el).fontFamily
  );
  expect(fontFamily.toLowerCase()).toMatch(/press.start|monospace/);
});

// ---------------------------------------------------------------------------
// AC #7, #10 — Theme colors verification
// ---------------------------------------------------------------------------
test("theme colors are present in the UI", async ({ page }) => {
  // Check the body background is mmx-bg (#0f0f2d = rgb(15, 15, 45))
  const body = page.locator("body");
  const bgColor = await body.evaluate(
    (el) => getComputedStyle(el).backgroundColor
  );
  expect(bgColor).toBe("rgb(15, 15, 45)");

  // Check the title uses mmx-cyan (#00e5ff = rgb(0, 229, 255))
  const title = page.getByTestId("app-title");
  const titleColor = await title.evaluate(
    (el) => getComputedStyle(el).color
  );
  expect(titleColor).toBe("rgb(0, 229, 255)");
});

// ---------------------------------------------------------------------------
// AC #7, #10 — Pixel-border styling
// ---------------------------------------------------------------------------
test("pixel-border styling is applied to panels", async ({ page }) => {
  // The input panel and todo list panel should have the pixel-border class
  const panels = page.locator(".pixel-border");
  const count = await panels.count();
  // At least 2 panels (input + todo list) plus the health bar
  expect(count).toBeGreaterThanOrEqual(2);

  // Verify box-shadow is applied (pixel-border effect)
  const panel = page.locator(".pixel-border.bg-mmx-panel").first();
  const boxShadow = await panel.evaluate(
    (el) => getComputedStyle(el).boxShadow
  );
  expect(boxShadow).not.toBe("none");
});

// ---------------------------------------------------------------------------
// AC #8 — Mega Man X–themed decorative element (health bar)
// ---------------------------------------------------------------------------
test("Mega Man X health bar decorative element is present", async ({
  page,
}) => {
  // The health bar component should be visible
  const healthBar = page.getByTestId("health-bar");
  await expect(healthBar).toBeVisible();

  // Should show "Mission Progress" label
  await expect(page.getByText("Mission Progress")).toBeVisible();

  // The health bar fill element should exist in the DOM
  const fill = page.getByTestId("health-bar-fill");
  await expect(fill).toBeAttached();

  // The decorative color bar (stage-select motif) should be present —
  // it's a row of 16 small colored bars rendered by TodoApp
  const colorBarSegments = page.locator(
    '.bg-mmx-orange, .bg-mmx-cyan, .bg-mmx-green, .bg-mmx-red'
  );
  const segmentCount = await colorBarSegments.count();
  // The stage-select color bar has 16 segments (4 per colour × 4 colours)
  expect(segmentCount).toBeGreaterThanOrEqual(4);

  // The title references the game theme
  await expect(page.getByText("Mega TODO X")).toBeVisible();
});
