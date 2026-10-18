import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import CampaignDetail from "@/pages/CampaignDetail";

// Mock dependencies
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ user: null, role: "creator" }),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({ data: null }),
          order: () => ({ limit: async () => ({ data: [] }) }),
        }),
      }),
    }),
  },
}));

describe("CampaignDetail Accessibility", () => {
  it("renders header icon buttons with proper ARIA labels and brand logo with descriptive alt text", async () => {
    render(
      <MemoryRouter initialEntries={["/campaigns/1"]}>
        <Routes>
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify header icon buttons have ARIA labels
    const backBtn = await screen.findByRole("button", { name: /go back/i });
    expect(backBtn).toBeInTheDocument();

    const shareBtn = screen.getByRole("button", { name: /share campaign/i });
    expect(shareBtn).toBeInTheDocument();

    const bookmarkBtn = screen.getByRole("button", { name: /bookmark campaign/i });
    expect(bookmarkBtn).toBeInTheDocument();

    // Verify brand logo image has descriptive alt text
    const logoImg = screen.getByAltText("Sample Eyewear logo");
    expect(logoImg).toBeInTheDocument();
  });
});
