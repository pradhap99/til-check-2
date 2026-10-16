import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import BrandBottomNav from "../components/BrandBottomNav";

describe("BottomNav accessibility", () => {
  it("renders nav element with aria-label and aria-current='page' on active link", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: /bottom navigation/i });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");

    const campaignsLink = screen.getByRole("link", { name: "Campaigns" });
    expect(campaignsLink).not.toHaveAttribute("aria-current");
  });
});

describe("BrandBottomNav accessibility", () => {
  it("renders nav element with aria-label and aria-current='page' on active link", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: /brand bottom navigation/i });
    expect(nav).toBeInTheDocument();

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    const campaignsLink = screen.getByRole("link", { name: "Campaigns" });
    expect(campaignsLink).not.toHaveAttribute("aria-current");
  });
});
