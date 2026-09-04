# Make App Numbers Realistic (Grounded / Early-Stage)

Re-tune all mock figures across the app to believable early-stage Indian influencer-market values: mostly nano/micro creators, modest budgets, wallet balances in the hundreds-to-thousands range.

## Number targets

- **Creator stats** (`src/data/mockData.ts`): followers 8K–95K (mostly nano/micro), engagement 3.5%–6.5%, rates ₹3K–₹25K
- **Campaign budgets** (`src/data/mockData.ts`, map view, detail pages): ₹20K–₹1.5L total; per-creator payouts ₹2K–₹15K; Perks campaigns stay perk-only
- **Creator level system** (`src/lib/creatorLevels.ts`): keep 6 tiers but recalibrate base pay — L1 ₹2K–₹5K, L2 ₹5K–₹12K, L3 ₹12K–₹30K, L4 ₹30K–₹60K, L5 ₹60K–₹1.2L, L6 ₹1.2L+ (level-up thresholds in creatorLevels.ts stay follower-based)
- **Earnings & wallet** (`src/pages/Earnings.tsx`, `Redeem.tsx`, `BankTransfer.tsx`, `Index.tsx` seed stats): total earnings ~₹8K–₹25K, pending ₹1K–₹5K, individual transactions ₹500–₹5,000
- **Escrow** (`src/pages/Escrow.tsx`, `CampaignManage.tsx`): milestones ₹2K–₹12K per milestone
- **Offers/Affiliate** (`src/pages/Offers.tsx`, Earnings affiliate cards): commissions ₹50–₹500 per conversion, voucher values ₹100–₹1,000
- **Home seed data** (`src/pages/Index.tsx` hardcoded level/stats, hero banners, map pins): align with above; level demo uses ~12K followers at Level 1–2
- **Misc pages**: Alerts, Notifications, Channels, CreatorDetail, MyApplications, Campaigns, Recommendations, BrandDashboard, Landing stats — sweep for oversized figures (₹15L budgets, 425K followers, 4.9% engagement everywhere) and bring in line

## How

1. Rewrite `src/data/mockData.ts` creators + campaigns with grounded numbers (single source used by most screens)
2. Recalibrate `creatorLevels.ts` pay bands and any follower-threshold display strings
3. Edit per-page hardcoded figures (Earnings, Escrow, Offers, Redeem, BankTransfer, Alerts, Notifications, Landing, HeroBannerCarousel, CampaignMapView, BrandDashboard)
4. Keep all ₹ Indian-formatting (toLocaleString en-IN) and gold/dark design untouched — numbers only
5. Verify build is clean and spot-check Home, Campaigns, Earnings, Escrow screens

## Out of scope

- No layout/design changes, no new features, no database changes
- Level gating logic (getLevelRequiredForCampaign) stays as-is unless new budgets break thresholds — will adjust thresholds to match new budget bands if needed
