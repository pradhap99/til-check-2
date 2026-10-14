import { describe, it, expect, vi } from "vitest";
import type { ReactElement } from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Pricing from "@/pages/Pricing";
import SuccessStories from "@/pages/SuccessStories";
import BrandCirclesRow from "@/components/home/BrandCirclesRow";
import SampleBadge from "@/components/SampleBadge";
import Escrow from "@/pages/Escrow";
import Earnings from "@/pages/Earnings";
import BankTransfer from "@/pages/BankTransfer";
import Redeem from "@/pages/Redeem";
import { campaigns } from "@/data/mockData";

// Pages read the auth context and the Supabase client. Neither is needed to check the copy, so
// the client is a chainable stub that resolves every query with empty data.
const { authState, makeChain } = vi.hoisted(() => {
  const makeChain = (): unknown =>
    new Proxy(() => undefined, {
      get: (_target, prop) =>
        prop === "then"
          ? (resolve: (value: unknown) => void) => resolve({ data: [], error: null, count: 0 })
          : makeChain(),
      apply: () => makeChain(),
    });
  return { authState: { role: "creator" as "creator" | "brand" }, makeChain };
});
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ signIn: vi.fn(), signUp: vi.fn(), user: { id: "test-user" }, role: authState.role }),
}));
vi.mock("@/integrations/supabase/client", () => ({ supabase: makeChain() }));

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

// ---------------------------------------------------------------------------------------------
// Payments are coming soon. TIL has no payment provider, so no screen may imply money moves.
// ---------------------------------------------------------------------------------------------

const renderPage = (ui: ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

/** Every UPI, escrow, payout or GST-invoicing mention must sit within 220 characters of "coming soon". */
const expectPaymentClaimsAreComingSoon = (text: string) => {
  const claim = /UPI|escrow|payouts?\b|GST-(?:ready|compliant)/gi;
  for (const match of text.matchAll(claim)) {
    const start = Math.max(0, (match.index ?? 0) - 220);
    const around = text.slice(start, (match.index ?? 0) + 220);
    expect(around, `"${match[0]}" is not marked coming soon near: ...${around}...`).toMatch(/coming soon/i);
  }
};

describe("Public pages: payment features are marked coming soon", () => {
  it("Landing (creator toggle) badges UPI payouts, escrow and the 'Get paid' step", () => {
    renderLanding();
    for (const title of ["UPI Payouts", "Escrow Protection", "Get paid via UPI"]) {
      const row = screen.getByText(title).parentElement as HTMLElement;
      expect(within(row).getByTestId("coming-soon-badge"), `${title} badge`).toHaveTextContent("Coming soon");
    }
    expect(screen.getByText(/UPI payouts, escrow and GST-ready invoicing are coming soon/)).toBeInTheDocument();
  });

  it("Landing (brand toggle) badges Secure Escrow and says escrow payments are coming soon", () => {
    renderLanding();
    fireEvent.click(screen.getByRole("button", { name: "For Brands" }));
    const row = screen.getByText("Secure Escrow").parentElement as HTMLElement;
    expect(within(row).getByTestId("coming-soon-badge")).toHaveTextContent("Coming soon");
    expect(screen.getByText(/Secure escrow payments are coming soon/)).toBeInTheDocument();
    expect(screen.getByText("UPI Payouts")).toBeInTheDocument();
  });

  it("Landing FAQ payment answers say coming soon and never promise instant payouts", () => {
    renderLanding();
    for (const question of ["How do creators get paid?", "How does GST & TDS compliance work?", "What does TIL charge?", "How are disputes resolved?"]) {
      fireEvent.click(screen.getByText(question));
      const answer = screen.getByText(question).closest("div")?.parentElement?.textContent ?? "";
      expect(answer, question).toMatch(/coming soon/i);
    }
  });

  it("no public page claims instant UPI payments, and every payment claim sits next to 'coming soon'", () => {
    const pages: Array<[string, () => string, boolean]> = [
      ["Landing (creator)", () => renderLanding().container.textContent ?? "", false],
      ["Landing (brand)", () => {
        const { container } = renderLanding();
        fireEvent.click(screen.getByRole("button", { name: "For Brands" }));
        return container.textContent ?? "";
      }, false],
      ["Auth", () => renderPage(<Auth />).container.textContent ?? "", false],
      ["Pricing", () => renderPage(<Pricing />).container.textContent ?? "", false],
    ];
    for (const [name, getText] of pages) {
      const text = getText();
      expect(text, `${name}: instant payments claim`).not.toMatch(/instant\s+(?:upi|payments?|payouts?|transfers?)/i);
      expect(text, `${name}: instant UPI claim`).not.toMatch(/upi[^.]{0,40}\binstant/i);
      expectPaymentClaimsAreComingSoon(text);
      document.body.innerHTML = "";
    }
  });

  it("Pricing keeps every tier and price, with a notice and badges on escrow, fee and billing lines", () => {
    const { container } = renderPage(<Pricing />);
    expect(screen.getByTestId("payments-coming-soon")).toHaveTextContent("Payments are coming soon");
    for (const price of ["₹0", "₹9,999", "₹29,999", "Custom"]) expect(container.textContent).toContain(price);
    for (const line of ["Basic escrow (7-day window)", "Express escrow (3-day window)", "Invoice-based billing", "5% platform fee per campaign"]) {
      const row = screen.getByText(line).parentElement as HTMLElement;
      expect(within(row).getByTestId("coming-soon-badge"), line).toBeInTheDocument();
    }
  });
});

describe("Signed-in payment screens: money actions are disabled", () => {
  // Buttons that would move money. Informational toggles such as 'How Milestone Release Works' are not in scope.
  const MONEY_BUTTON = /redeem|transfer to|withdraw|release payment|fund escrow|request payout|pay now/i;

  it("Escrow shows the notice, empty totals, and a disabled primary action (brand and creator)", () => {
    for (const role of ["brand", "creator"] as const) {
      authState.role = role;
      const { unmount } = renderPage(<Escrow />);
      expect(screen.getByTestId("payments-coming-soon")).toHaveTextContent("Payments are coming soon");
      const action = screen.getByTestId("escrow-primary-action");
      expect(action).toBeDisabled();
      expect(action).toHaveTextContent("Coming soon");
      expect(action).toHaveTextContent(role === "brand" ? "Fund escrow" : "Request payout");
      for (const button of screen.getAllByRole("button")) {
        if (MONEY_BUTTON.test(button.textContent ?? "")) expect(button, button.textContent ?? "").toBeDisabled();
      }
      unmount();
    }
    authState.role = "creator";
  });

  it("Earnings disables redeem-to-voucher, transfer-to-bank and affiliate link buttons", () => {
    renderPage(<Earnings />);
    expect(screen.getByTestId("payments-coming-soon")).toHaveTextContent("Payments are coming soon");
    expect(screen.getByTestId("earnings-redeem-voucher")).toBeDisabled();
    expect(screen.getByTestId("earnings-transfer-bank")).toBeDisabled();
    expect(screen.getByTestId("earnings-transfer-bank")).toHaveTextContent("Coming soon");
    for (const button of screen.getAllByTestId("earnings-copy-link")) expect(button).toBeDisabled();
    for (const button of screen.getAllByRole("button")) {
      if (MONEY_BUTTON.test(button.textContent ?? "")) expect(button, button.textContent ?? "").toBeDisabled();
    }
  });

  it("BankTransfer submit is disabled, and clicking it shows no success", () => {
    renderPage(<BankTransfer />);
    expect(screen.getByTestId("payments-coming-soon")).toBeInTheDocument();
    const submit = screen.getByTestId("bank-transfer-submit");
    expect(submit).toBeDisabled();
    fireEvent.click(submit);
    expect(document.body.textContent).not.toMatch(/Transfer initiated/i);
  });

  it("Redeem disables every voucher option and the hero voucher", () => {
    renderPage(<Redeem />);
    expect(screen.getByTestId("payments-coming-soon")).toBeInTheDocument();
    const options = screen.getAllByTestId("redeem-voucher-option");
    expect(options.length).toBeGreaterThan(0);
    for (const option of options) expect(option).toBeDisabled();
    expect(screen.getByTestId("redeem-hero-voucher")).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByTestId("redeem-hero-voucher"));
    expect(document.body.textContent).not.toMatch(/voucher redeemed/i);
  });
});

describe("No code path pretends a payment happened", () => {
  const sources = import.meta.glob(["../**/*.{ts,tsx}", "!../test/**", "!../integrations/supabase/types.ts"], {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;

  it("nothing writes a transactions row or announces a released payment", () => {
    const insertTransaction = new RegExp(w('from\\("', "transac", 'tions"\\)\\s*\\.insert'));
    const releasedNotice = new RegExp(w("Payment ", "Released|Final Payment ", "Released|payment ", "released!"));
    const redeemedToast = new RegExp(w("voucher ", "redeemed"));
    const transferToast = new RegExp(w("Transfer ", "initiated"));
    expect(Object.keys(sources).length).toBeGreaterThan(50);
    for (const [file, text] of Object.entries(sources)) {
      expect(text, `${file}: inserts a transaction`).not.toMatch(insertTransaction);
      expect(text, `${file}: announces a released payment`).not.toMatch(releasedNotice);
      expect(text, `${file}: success toast for a voucher`).not.toMatch(redeemedToast);
      expect(text, `${file}: success toast for a transfer`).not.toMatch(transferToast);
    }
  });
});
