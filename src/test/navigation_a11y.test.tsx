import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import BrandBottomNav from "@/components/BrandBottomNav";
import Earnings from "@/pages/Earnings";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ signIn: vi.fn(), signUp: vi.fn(), user: { id: "test-user" }, role: "creator" }),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
  },
}));

describe("Accessibility attributes in navigation and earnings", () => {
  it("BottomNav has proper aria-label and aria-current on active link", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <BottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("aria-current", "page");

    const profileLink = screen.getByRole("link", { name: "Profile" });
    expect(profileLink).not.toHaveAttribute("aria-current");
  });

  it("BrandBottomNav has proper aria-label and aria-current on active link", () => {
    render(
      <MemoryRouter initialEntries={["/brand/dashboard"]}>
        <BrandBottomNav />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Brand Navigation" });
    expect(nav).toBeInTheDocument();

    const dashLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashLink).toHaveAttribute("aria-current", "page");
  });

  it("Earnings transaction history toggle has aria-expanded and aria-controls attributes", () => {
    render(
      <MemoryRouter>
        <Earnings />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole("button", { name: /Transaction History/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(toggleButton).toHaveAttribute("aria-controls", "transaction-history-list");
  });
});
