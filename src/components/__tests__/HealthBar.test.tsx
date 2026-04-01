import React from "react";
import { render, screen } from "@testing-library/react";
import HealthBar from "@/components/HealthBar";

describe("HealthBar", () => {
  describe("rendering", () => {
    it("renders the health bar container", () => {
      render(<HealthBar completed={0} total={0} />);
      expect(screen.getByTestId("health-bar")).toBeInTheDocument();
    });

    it("renders the 'Mission Progress' label", () => {
      render(<HealthBar completed={0} total={0} />);
      expect(screen.getByText(/mission progress/i)).toBeInTheDocument();
    });

    it("displays completed/total count", () => {
      render(<HealthBar completed={3} total={5} />);
      expect(screen.getByText("3/5")).toBeInTheDocument();
    });

    it("renders the fill bar element", () => {
      render(<HealthBar completed={1} total={2} />);
      expect(screen.getByTestId("health-bar-fill")).toBeInTheDocument();
    });

    it("renders 10 segment dividers", () => {
      const { container } = render(<HealthBar completed={0} total={0} />);
      // 10 segment divider elements inside the absolute positioned flex container
      const segments = container.querySelectorAll(".absolute.inset-0.flex > div");
      expect(segments).toHaveLength(10);
    });
  });

  describe("fill percentage", () => {
    it("shows 0% width when no todos exist (0/0)", () => {
      render(<HealthBar completed={0} total={0} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("0%");
    });

    it("shows 0% width when no todos are completed (0/3)", () => {
      render(<HealthBar completed={0} total={3} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("0%");
    });

    it("shows 50% width when half todos are completed (1/2)", () => {
      render(<HealthBar completed={1} total={2} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("50%");
    });

    it("shows 100% width when all todos are completed (3/3)", () => {
      render(<HealthBar completed={3} total={3} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("100%");
    });

    it("rounds percentage to nearest integer (1/3 = 33%)", () => {
      render(<HealthBar completed={1} total={3} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("33%");
    });

    it("floors percentage to avoid false 100% (2/3 = 66%)", () => {
      render(<HealthBar completed={2} total={3} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("66%");
    });
  });

  describe("color coding", () => {
    it("uses cyan when completion is above 66%", () => {
      render(<HealthBar completed={3} total={3} />);
      const fill = screen.getByTestId("health-bar-fill");
      // jsdom converts hex to rgb
      expect(fill.style.background).toContain("rgb(0, 229, 255)");
    });

    it("uses orange when completion is between 34% and 66%", () => {
      render(<HealthBar completed={1} total={2} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.background).toContain("rgb(255, 102, 0)");
    });

    it("uses red when completion is at or below 33%", () => {
      render(<HealthBar completed={1} total={4} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.background).toContain("rgb(255, 51, 51)");
    });

    it("uses red when completion is 0% with todos present", () => {
      render(<HealthBar completed={0} total={5} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.background).toContain("rgb(255, 51, 51)");
    });
  });

  describe("box-shadow", () => {
    it("has no box-shadow when percentage is 0", () => {
      render(<HealthBar completed={0} total={0} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.boxShadow).toBe("none");
    });

    it("has box-shadow when percentage is greater than 0", () => {
      render(<HealthBar completed={1} total={1} />);
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.boxShadow).not.toBe("none");
      expect(fill.style.boxShadow).toContain("inset");
    });
  });

  describe("edge cases", () => {
    it("handles single todo (1/1 = 100%)", () => {
      render(<HealthBar completed={1} total={1} />);
      expect(screen.getByText("1/1")).toBeInTheDocument();
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("100%");
    });

    it("handles large numbers correctly (99/100)", () => {
      render(<HealthBar completed={99} total={100} />);
      expect(screen.getByText("99/100")).toBeInTheDocument();
      const fill = screen.getByTestId("health-bar-fill");
      expect(fill.style.width).toBe("99%");
    });

    it("displays 0/0 when no todos exist", () => {
      render(<HealthBar completed={0} total={0} />);
      expect(screen.getByText("0/0")).toBeInTheDocument();
    });
  });
});
