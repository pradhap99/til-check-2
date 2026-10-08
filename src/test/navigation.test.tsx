import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BrandBottomNav from "@/components/BrandBottomNav";

describe("Navigation Accessibility", () => {
  it("renders BottomNav with aria-label and correct aria-current on active link", () => {
    render(
      <MemoryRouter initialEntries={["/campaigns"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(nav).toBeInTheDocument();

    const activeLink = screen.getByRole("link", { name: "Campaigns" });
    expect(activeLink).toHaveAttribute("aria-current", "page");

    const inactiveLink = screen.getByRole("link", { name: "Home" });
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });

  it("renders BrandBottomNav with aria-label and correct aria-current on active link", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Brand Navigation" });
    expect(nav).toBeInTheDocument();

    const activeLink = screen.getByRole("link", { name: "Dashboard" });
    expect(activeLink).toHaveAttribute("aria-current", "page");

    const inactiveLink = screen.getByRole("link", { name: "Campaigns" });
    expect(inactiveLink).not.toHaveAttribute("aria-current");
  });
});
