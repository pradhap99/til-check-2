import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import BrandBottomNav from "../components/BrandBottomNav";

describe("Navigation Accessibility", () => {
  it("renders BottomNav with proper aria attributes and active state", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: /main navigation/i });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("aria-current", "page");

    const campaignsLink = screen.getByRole("link", { name: /campaigns/i });
    expect(campaignsLink).not.toHaveAttribute("aria-current");
  });

  it("renders BrandBottomNav with proper aria attributes and active state", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: /brand navigation/i });
    expect(nav).toBeInTheDocument();

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    const profileLink = screen.getByRole("link", { name: /profile/i });
    expect(profileLink).not.toHaveAttribute("aria-current");
  });
});
