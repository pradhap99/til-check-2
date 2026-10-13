import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import BottomNav from "@/components/BottomNav";
import BrandBottomNav from "@/components/BrandBottomNav";

describe("BottomNav", () => {
  it("renders with proper aria-label on nav element and hides decorative icons", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const navElement = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(navElement).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/home");
  });
});

describe("BrandBottomNav", () => {
  it("renders with proper aria-label on nav element and hides decorative icons", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const navElement = screen.getByRole("navigation", { name: "Brand Navigation" });
    expect(navElement).toBeInTheDocument();

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/brand/dashboard");
  });
});
