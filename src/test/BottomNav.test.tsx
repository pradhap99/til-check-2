import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BrandBottomNav from "@/components/BrandBottomNav";

describe("BottomNav accessibility", () => {
  it("renders navigation links with aria-label and sets aria-current for active route", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    const appsLink = screen.getByRole("link", { name: "Applications" });

    expect(homeLink).toHaveAttribute("aria-current", "page");
    expect(appsLink).not.toHaveAttribute("aria-current");
  });
});

describe("BrandBottomNav accessibility", () => {
  it("renders brand navigation links with aria-label and sets aria-current for active route", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    const campaignsLink = screen.getByRole("link", { name: "Campaigns" });

    expect(dashboardLink).toHaveAttribute("aria-current", "page");
    expect(campaignsLink).not.toHaveAttribute("aria-current");
  });
});
