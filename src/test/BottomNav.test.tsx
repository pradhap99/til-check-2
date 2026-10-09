import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import BottomNav from "@/components/BottomNav";
import BrandBottomNav from "@/components/BrandBottomNav";

describe("BottomNav and BrandBottomNav Accessibility", () => {
  it("renders BottomNav links with accessible labels and aria-current", () => {
    render(
      <BrowserRouter>
        <BottomNav />
      </BrowserRouter>
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("aria-label", "Home");

    const applicationsLink = screen.getByRole("link", { name: "Applications" });
    expect(applicationsLink).toBeInTheDocument();

    const campaignsLink = screen.getByRole("link", { name: "Campaigns" });
    expect(campaignsLink).toBeInTheDocument();
  });

  it("renders BrandBottomNav links with accessible labels", () => {
    render(
      <BrowserRouter>
        <BrandBottomNav />
      </BrowserRouter>
    );

    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("aria-label", "Dashboard");

    const applicantsLink = screen.getByRole("link", { name: "Applicants" });
    expect(applicantsLink).toBeInTheDocument();
  });
});
