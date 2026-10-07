import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import BottomNav from "../components/BottomNav";
import BrandBottomNav from "../components/BrandBottomNav";

describe("BottomNav accessibility", () => {
  it("renders nav element with accessible label and correct aria-current on active link", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");

    const campaignsLink = screen.getByRole("link", { name: "Campaigns" });
    expect(campaignsLink).not.toHaveAttribute("aria-current");
  });
});

describe("BrandBottomNav accessibility", () => {
  it("renders brand nav element with accessible label and correct aria-current on active link", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Brand Navigation" });
    expect(nav).toBeInTheDocument();

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toHaveAttribute("aria-current", "page");

    const profileLink = screen.getByRole("link", { name: "Profile" });
    expect(profileLink).not.toHaveAttribute("aria-current");
  });
});
