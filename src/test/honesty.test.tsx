import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import SuccessStories from "@/pages/SuccessStories";
import BrandCirclesRow from "@/components/home/BrandCirclesRow";
import SampleBadge from "@/components/SampleBadge";
import { campaigns } from "@/data/mockData";

// Auth reads the auth context and the Supabase client. Neither is needed to check the copy.
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ signIn: vi.fn(), signUp: vi.fn(), user: null, role: null }),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

// The forbidden words are assembled from fragments on purpose, so a repo-wide scan for those
// words (the honesty gate) does not flag this test file itself.
const w = (...parts: string[]) => parts.join("");

const REAL_BRANDS = [
  w("bo", "At"),
  w("Lens", "kart"),
  w("Mama", "earth"),
  w("Zo", "mato"),
  w("Ny", "kaa"),
  w("My", "ntra"),
  w("Swig", "gy"),
  w("Blue ", "Tokai"),
  w("Third ", "Wave"),
  w("Zos", "tel"),
  w("Bewa", "koof"),
];
const REAL_BRAND_PATTERN = new RegExp(REAL_BRANDS.join("|"));

// Anything that reads as an invented number, a ranking, a real company or a fabricated endorsement.
const BANNED: RegExp[] = [
  new RegExp(w("12", ",?", "400")),
  new RegExp(w("8", ",?", "200")),
  new RegExp(w("26", ",?", "000")),
  new RegExp(w("25", "\\s?", "Cr")),
  new RegExp(w("India's ", "#", "1")),
  REAL_BRAND_PATTERN,
  new RegExp(w("\\bSu", "gar\\b")),
  new RegExp(w("\\bCR", "ED\\b")),
  new RegExp(w("Trus", "ted by"), "i"),
  new RegExp(w("Testi", "monials"), "i"),
  new RegExp(w("As featu", "red in"), "i"),
  new RegExp(w("By the ", "numbers"), "i"),
  /\b\d[\d,.]*\+\s*(creators|brands|campaigns)\b/i,
];

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>,
  );

const expectNoBannedClaims = (text: string) => {
  for (const pattern of BANNED) {
    expect(text, `unexpected match for ${pattern}`).not.toMatch(pattern);
  }
};

describe("Landing page honesty", () => {
  it("has no invented stats, endorsements, logos or rankings on the creator toggle", () => {
    const { container } = renderLanding();
    expectNoBannedClaims(container.textContent ?? "");
    expect(container.querySelector(`img[alt="${REAL_BRANDS[0]}"]`)).toBeNull();
    expect(screen.getByText("Built for Indian creators and brands")).toBeInTheDocument();
  });

  it("has no invented stats, endorsements, logos or rankings on the brand toggle", () => {
    const { container } = renderLanding();
    fireEvent.click(screen.getByRole("button", { name: "For Brands" }));
    expectNoBannedClaims(container.textContent ?? "");
    expect(screen.getByText("Everything your brand needs")).toBeInTheDocument();
    expect(screen.getByText(/for your brand/)).toBeInTheDocument();
  });

  it("shows the three plain feature lines instead of a stats band", () => {
    renderLanding();
    expect(screen.getByText("Campaigns with a stated budget")).toBeInTheDocument();
    expect(screen.getByText("Content approval built in")).toBeInTheDocument();
    expect(screen.getByText("One inbox for every collaboration")).toBeInTheDocument();
  });

  it("replaces the numbers section with a two-column 'How it works'", () => {
    renderLanding();
    const heading = screen.getByRole("heading", { name: "How it works" });
    const section = heading.closest("section") as HTMLElement;
    expect(within(section).getByText("Set up a profile with your own rates")).toBeInTheDocument();
    expect(within(section).getByText("Apply to campaigns that fit you")).toBeInTheDocument();
    expect(within(section).getByText("Talk to brands in one inbox")).toBeInTheDocument();
    expect(within(section).getByText("Post a campaign with a budget")).toBeInTheDocument();
    expect(within(section).getByText("Invite creators who fit")).toBeInTheDocument();
    expect(within(section).getByText("Approve content before it goes live")).toBeInTheDocument();
  });
});

describe("Other signed-out pages", () => {
  it("Auth no longer claims a creator count", () => {
    const { container } = render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>,
    );
    expectNoBannedClaims(container.textContent ?? "");
  });

  it("Pricing keeps its tiers but drops the popularity claim", () => {
    const { container } = render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );
    expect(container.textContent).not.toMatch(/Most Popular/i);
    expect(container.textContent).toContain("₹29,999");
    expect(container.textContent).toContain("5% platform fee per campaign");
  });
});

describe("Signed-in sample data", () => {
  it("SampleBadge renders the visible label", () => {
    render(<SampleBadge />);
    expect(screen.getByTestId("sample-badge")).toHaveTextContent("Sample data");
  });

  it("mock campaigns only use placeholder brand names", () => {
    for (const c of campaigns) {
      expect(c.brand, `${c.id} brand`).toMatch(/^(Sample|Example|Demo|Placeholder)/);
      expect(c.title, `${c.id} title`).not.toMatch(REAL_BRAND_PATTERN);
    }
  });

  it("BrandCirclesRow shows placeholder brands and a Sample data label", () => {
    render(<BrandCirclesRow selectedBrand={null} onSelectBrand={() => {}} />);
    expect(screen.getByText("Sample data")).toBeInTheDocument();
    expect(screen.getByText("Sample Eyewear")).toBeInTheDocument();
    expect(screen.getByText("Demo Audio")).toBeInTheDocument();
    expect(screen.queryByText(REAL_BRAND_PATTERN)).toBeNull();
  });

  it("SuccessStories shows an honest empty state, not invented quotes", () => {
    const { container } = render(
      <MemoryRouter>
        <SuccessStories />
      </MemoryRouter>,
    );
    expect(screen.getByText("No stories yet")).toBeInTheDocument();
    expect(screen.getByText("Finish a campaign and yours could be the first.")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/first brand deal in just|more than my salary|Real earnings/);
  });
});
