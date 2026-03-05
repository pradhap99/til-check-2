export interface CreatorLevel {
  level: number;
  name: string;
  minFollowers: number;
  maxFollowers: number;
  basePay: string;
  badgeColor: string;
  badgeGradient: string;
  unlockedBrands: string;
}

export const CREATOR_LEVELS: CreatorLevel[] = [
  { level: 1, name: "Rising Star", minFollowers: 0, maxFollowers: 50000, basePay: "₹5K-₹15K", badgeColor: "text-amber-700", badgeGradient: "from-amber-600 to-amber-800", unlockedBrands: "Local cafés, salons, fitness studios, small D2C brands" },
  { level: 2, name: "Emerging Creator", minFollowers: 50000, maxFollowers: 100000, basePay: "₹15K-₹35K", badgeColor: "text-gray-400", badgeGradient: "from-gray-300 to-gray-500", unlockedBrands: "Mid-tier restaurants, fashion boutiques, regional brands" },
  { level: 3, name: "Established Creator", minFollowers: 100000, maxFollowers: 250000, basePay: "₹35K-₹75K", badgeColor: "text-yellow-500", badgeGradient: "from-yellow-400 to-amber-500", unlockedBrands: "Premium hotels, Mamaearth, Sugar, mid-tier electronics" },
  { level: 4, name: "Top Creator", minFollowers: 250000, maxFollowers: 500000, basePay: "₹75K-₹1.5L", badgeColor: "text-blue-300", badgeGradient: "from-blue-300 to-indigo-400", unlockedBrands: "boAt, Lenskart, Myntra partners, luxury hotels" },
  { level: 5, name: "Elite Creator", minFollowers: 500000, maxFollowers: 1000000, basePay: "₹1.5L-₹3L", badgeColor: "text-cyan-300", badgeGradient: "from-cyan-300 to-blue-500", unlockedBrands: "Top-tier brands, exclusive partnerships" },
  { level: 6, name: "Celebrity Creator", minFollowers: 1000000, maxFollowers: Infinity, basePay: "₹3L+", badgeColor: "text-red-400", badgeGradient: "from-red-400 to-pink-600", unlockedBrands: "ALL brands + exclusive invites + ambassadorships" },
];

export function getCreatorLevel(followers: number, engagementRate: number = 0, completedCampaigns: number = 0): {
  current: CreatorLevel;
  next: CreatorLevel | null;
  progressPercent: number;
  progressLabel: string;
} {
  // 70% followers, 20% engagement, 10% campaigns
  let levelIndex = 0;
  for (let i = CREATOR_LEVELS.length - 1; i >= 0; i--) {
    if (followers >= CREATOR_LEVELS[i].minFollowers) {
      // Check engagement + campaign requirements for higher levels
      if (i >= 2 && engagementRate < 3) { levelIndex = Math.min(i, 1); break; }
      if (i >= 4 && completedCampaigns < 15) { levelIndex = Math.min(i, 3); break; }
      if (i >= 2 && completedCampaigns < 5) { levelIndex = Math.min(i, 1); break; }
      levelIndex = i;
      break;
    }
  }

  const current = CREATOR_LEVELS[levelIndex];
  const next = levelIndex < CREATOR_LEVELS.length - 1 ? CREATOR_LEVELS[levelIndex + 1] : null;

  let progressPercent = 100;
  let progressLabel = "Max level reached!";
  if (next) {
    const range = next.minFollowers - current.minFollowers;
    const progress = followers - current.minFollowers;
    progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
    const needed = next.minFollowers - followers;
    progressLabel = needed > 0
      ? `${(needed / 1000).toFixed(0)}K more followers to reach ${next.name}`
      : `Ready for ${next.name}!`;
  }

  return { current, next, progressPercent, progressLabel };
}

export function getLevelRequiredForCampaign(budgetStr: string): number {
  const budget = parseInt(budgetStr.replace(/[^\d]/g, "")) || 0;
  if (budget >= 300000) return 6;
  if (budget >= 150000) return 5;
  if (budget >= 75000) return 4;
  if (budget >= 35000) return 3;
  if (budget >= 15000) return 2;
  return 1;
}
