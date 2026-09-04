export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  category: string;
  followers: string;
  engagement: string;
  platform: "Instagram" | "YouTube" | "Twitter";
  location: string;
  rate: string;
  verified: boolean;
  bio: string;
}

export interface Campaign {
  id: string;
  brand: string;
  logo: string;
  title: string;
  budget: string;
  category: string;
  deadline: string;
  slots: number;
  filled: number;
  description: string;
  platforms: string[];
  location?: string;
  date?: string;
  type?: "Paid" | "Barter" | "Perks";
  perks?: string[];
  minLevel?: number;
}

export const creators: Creator[] = [
  {
    id: "1", name: "Priya Sharma", handle: "@priyasharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    category: "Beauty", followers: "42K", engagement: "5.8%", platform: "Instagram", location: "Mumbai", rate: "₹8K–15K", verified: true,
    bio: "Beauty & skincare creator. Worked with local D2C skincare brands and salons across Mumbai."
  },
  {
    id: "2", name: "Arjun Mehta", handle: "@arjunmehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    category: "Tech", followers: "67K", engagement: "4.9%", platform: "YouTube", location: "Bangalore", rate: "₹12K–25K", verified: true,
    bio: "Tech reviewer & unboxer covering budget smartphones, laptops, and audio gear for Indian buyers."
  },
  {
    id: "3", name: "Sneha Kapoor", handle: "@snehakapoor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    category: "Fashion", followers: "95K", engagement: "4.2%", platform: "Instagram", location: "Delhi", rate: "₹15K–25K", verified: true,
    bio: "Fashion influencer & stylist. Collaborated with regional boutiques and Myntra sellers."
  },
  {
    id: "4", name: "Rahul Verma", handle: "@rahulverma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    category: "Food", followers: "18K", engagement: "6.4%", platform: "Instagram", location: "Chennai", rate: "₹3K–7K", verified: false,
    bio: "Food & travel creator. Street food explorer covering Chennai and Tamil Nadu."
  },
  {
    id: "5", name: "Kavya Nair", handle: "@kavyanair",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    category: "Fitness", followers: "34K", engagement: "5.5%", platform: "Instagram", location: "Hyderabad", rate: "₹6K–12K", verified: true,
    bio: "Certified trainer & wellness coach. Works with local gyms and fitness studios."
  },
  {
    id: "6", name: "Dev Anand", handle: "@devanand",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    category: "Comedy", followers: "88K", engagement: "6.1%", platform: "Instagram", location: "Pune", rate: "₹12K–22K", verified: true,
    bio: "Stand-up comedian & reel creator. Performed at local comedy clubs across Pune and Mumbai."
  },
];

export const campaigns: Campaign[] = [
  {
    id: "1", brand: "Lenskart", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop",
    title: "Lenskart SS'26 — Style Your Vision",
    budget: "₹1.2L–1.5L", category: "Fashion", deadline: "Mar 20, 2026",
    slots: 45, filled: 18, description: "Fashion-forward creators for our premium John Jacobs collection.",
    platforms: ["Instagram", "YouTube"],
    location: "Select Citywalk, Delhi", date: "Apr 1 — Apr 20, 2026"
  },
  {
    id: "2", brand: "Mamaearth", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop",
    title: "Mamaearth Vitamin C Range",
    budget: "₹60K–90K", category: "Beauty", deadline: "Mar 25, 2026",
    slots: 80, filled: 32, description: "Skincare & beauty creators for our new Vitamin C range launch.",
    platforms: ["Instagram"],
    location: "Phoenix Marketcity, Mumbai", date: "Mar 28 — Apr 12, 2026"
  },
  {
    id: "3", brand: "boAt", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    title: "boAt Summer Audio Launch",
    budget: "₹80K–1.2L", category: "Tech", deadline: "Apr 1, 2026",
    slots: 30, filled: 12, description: "Tech & lifestyle creators needed to review our new Airdopes 500 ANC range.",
    platforms: ["Instagram", "YouTube"],
    location: "Forum Mall, Bangalore", date: "Apr 5 — Apr 25, 2026"
  },
  {
    id: "4", brand: "Zomato", logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop",
    title: "Zomato Food Stories",
    budget: "₹50K–80K", category: "Food", deadline: "Mar 28, 2026",
    slots: 60, filled: 25, description: "Food creators for authentic street food and restaurant reviews across India.",
    platforms: ["Instagram", "YouTube"],
    location: "DLF Cyber City, Gurgaon", date: "Apr 8 — Apr 22, 2026"
  },
  {
    id: "5", brand: "Nykaa", logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop",
    title: "Nykaa Festive Glow",
    budget: "₹40K–60K", category: "Beauty", deadline: "Apr 5, 2026",
    slots: 100, filled: 45, description: "Beauty creators for festive makeup looks and skincare routines.",
    platforms: ["Instagram"],
    location: "Phoenix Palassio, Lucknow", date: "Apr 3 — Apr 18, 2026"
  },
  {
    id: "6", brand: "Myntra", logo: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=80&h=80&fit=crop",
    title: "Myntra Style Drop",
    budget: "₹90K–1.4L", category: "Fashion", deadline: "Mar 18, 2026",
    slots: 20, filled: 8, description: "Premium fashion creators for exclusive designer collaboration.",
    platforms: ["Instagram", "YouTube"],
    location: "Indiranagar, Bangalore", date: "Mar 22 — Apr 2, 2026"
  },
  {
    id: "7", brand: "Swiggy", logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
    title: "Swiggy Dine Out",
    budget: "₹35K–55K", category: "Food", deadline: "Apr 10, 2026",
    slots: 75, filled: 30, description: "Food and lifestyle creators for restaurant discovery content.",
    platforms: ["Instagram"],
    location: "Connaught Place, Delhi", date: "Apr 5 — Apr 20, 2026"
  },
  {
    id: "8", brand: "Noise", logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    title: "Noise Smartwatch Launch",
    budget: "₹45K–70K", category: "Tech", deadline: "Apr 8, 2026",
    slots: 40, filled: 15, description: "Tech reviewers & fitness creators for our latest smartwatch.",
    platforms: ["YouTube", "Instagram"],
    location: "Sector 29, Gurgaon", date: "Apr 10 — Apr 28, 2026"
  },
  {
    id: "cafe-001", brand: "Blue Tokai Coffee", logo: "",
    title: "Blue Tokai — Coffee Culture Campaign",
    budget: "₹25K–40K", category: "Cafe", deadline: "Apr 5, 2026",
    slots: 20, filled: 8, description: "Coffee culture content creators for in-cafe experience shoots.",
    platforms: ["Instagram"],
    location: "Koramangala, Bangalore", date: "Mar 20 — Apr 5, 2026"
  },
  {
    id: "cafe-002", brand: "Third Wave Coffee", logo: "",
    title: "Third Wave — Morning Ritual Series",
    budget: "₹18K–30K", category: "Cafe", deadline: "Apr 15, 2026",
    slots: 16, filled: 8, description: "Morning routine content featuring Third Wave cafes.",
    platforms: ["Instagram"],
    location: "Bandra West, Mumbai", date: "Apr 1 — Apr 15, 2026"
  },
  {
    id: "dining-001", brand: "Social (by Impresario)", logo: "",
    title: "SOCIAL — Urban Dining Experience",
    budget: "₹30K–50K", category: "Dining", deadline: "Apr 10, 2026",
    slots: 25, filled: 10, description: "Urban dining experience content for SOCIAL outlets.",
    platforms: ["Instagram", "YouTube"],
    location: "Hauz Khas Village, Delhi", date: "Mar 25 — Apr 10, 2026"
  },
  {
    id: "staycation-001", brand: "Zostel", logo: "",
    title: "Zostel — Backpacker Stories",
    budget: "₹40K–65K", category: "Staycation", deadline: "Apr 30, 2026",
    slots: 12, filled: 6, description: "Backpacker and travel vlog content from Zostel locations.",
    platforms: ["Instagram", "YouTube"],
    location: "Manali, Himachal Pradesh", date: "Apr 10 — Apr 30, 2026"
  },
  // Perks campaigns
  {
    id: "cafe-perks-001", brand: "Third Wave Coffee", logo: "",
    title: "Coffee Content Creator — Meal Collab",
    budget: "Perks", category: "Cafe", deadline: "Apr 30, 2026",
    slots: 20, filled: 0, description: "Coffee culture content with complimentary meals and subscriptions.",
    platforms: ["Instagram"],
    location: "Indiranagar, Bangalore", date: "Apr 1 — Apr 30, 2026",
    type: "Perks", perks: ["Free meal for 2", "Monthly coffee subscription", "₹500 voucher"], minLevel: 1,
  },
  {
    id: "cafe-perks-002", brand: "Blue Tokai Coffee", logo: "",
    title: "Lifestyle Creator — Coffee & Content",
    budget: "Perks", category: "Cafe", deadline: "May 5, 2026",
    slots: 10, filled: 0, description: "Lifestyle content featuring Blue Tokai cafes and products.",
    platforms: ["Instagram"],
    location: "Koramangala, Bangalore", date: "Apr 5 — May 5, 2026",
    type: "Perks", perks: ["Free coffee for a month", "Launch event invite", "Merchandise kit"], minLevel: 2,
  },
  {
    id: "dining-perks-001", brand: "Social (by Impresario)", logo: "",
    title: "Food Creator — Dining Experience Pass",
    budget: "Perks", category: "Dining", deadline: "Apr 30, 2026",
    slots: 8, filled: 0, description: "Premium dining experience content for SOCIAL outlets.",
    platforms: ["Instagram"],
    location: "Hauz Khas Village, Delhi", date: "Every weekend, Apr 2026",
    type: "Perks", perks: ["Dinner for 2", "Creator evening event invite", "₹1,000 voucher"], minLevel: 2,
  },
];

export const categories = ["All", "Fashion", "Tech", "Fitness", "Food", "Travel", "Gaming", "Beauty", "Lifestyle", "Finance", "Comedy", "Cafe", "Dining", "Staycation"];
export const platforms = ["All", "Instagram", "YouTube", "Twitter"];
