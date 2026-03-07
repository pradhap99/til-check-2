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
}

export const creators: Creator[] = [
  {
    id: "1", name: "Priya Sharma", handle: "@priyasharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    category: "Beauty", followers: "245K", engagement: "4.9%", platform: "Instagram", location: "Mumbai", rate: "₹40K–80K", verified: true,
    bio: "Beauty & skincare creator. Worked with Nykaa, Mamaearth, L'Oreal India. Level 3 creator."
  },
  {
    id: "2", name: "Arjun Mehta", handle: "@arjunmehta",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    category: "Tech", followers: "189K", engagement: "4.7%", platform: "YouTube", location: "Bangalore", rate: "₹50K–1L", verified: true,
    bio: "Tech reviewer & unboxer. Featured on T3 India. Specializes in smartphones, laptops, and audio gear."
  },
  {
    id: "3", name: "Sneha Kapoor", handle: "@snehakapoor",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    category: "Fashion", followers: "312K", engagement: "4.8%", platform: "Instagram", location: "Delhi", rate: "₹60K–1.2L", verified: true,
    bio: "Fashion influencer & stylist. Collaborated with Myntra, H&M India, and Zara."
  },
  {
    id: "4", name: "Rahul Verma", handle: "@rahulverma",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    category: "Food", followers: "98K", engagement: "4.6%", platform: "Instagram", location: "Chennai", rate: "₹25K–50K", verified: false,
    bio: "Food & travel creator. Street food explorer covering South India and Southeast Asia."
  },
  {
    id: "5", name: "Kavya Nair", handle: "@kavyanair",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    category: "Fitness", followers: "156K", engagement: "4.8%", platform: "Instagram", location: "Hyderabad", rate: "₹35K–70K", verified: true,
    bio: "ACE-certified trainer & wellness coach. Brand ambassador for Decathlon India."
  },
  {
    id: "6", name: "Dev Anand", handle: "@devanand",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    category: "Comedy", followers: "425K", engagement: "4.9%", platform: "Instagram", location: "Pune", rate: "₹1L–2.5L", verified: true,
    bio: "Stand-up comedian & content creator. Performed at Canvas Laugh Club. Brand partnerships with Swiggy, Dunzo."
  },
];

export const campaigns: Campaign[] = [
  {
    id: "1", brand: "Lenskart", logo: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop",
    title: "Lenskart SS'26 — Style Your Vision",
    budget: "₹8L–15L", category: "Fashion", deadline: "Mar 20, 2026",
    slots: 45, filled: 18, description: "Fashion-forward creators for our premium John Jacobs collection. Looking for outfit integration + eyewear styling content.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "2", brand: "Mamaearth", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop",
    title: "Mamaearth Vitamin C Range",
    budget: "₹3L–7L", category: "Beauty", deadline: "Mar 25, 2026",
    slots: 80, filled: 32, description: "Skincare & beauty creators for our new Vitamin C range launch. Must create before/after content with honest reviews.",
    platforms: ["Instagram"]
  },
  {
    id: "3", brand: "boAt", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    title: "boAt Summer Audio Launch",
    budget: "₹5L–10L", category: "Tech", deadline: "Apr 1, 2026",
    slots: 30, filled: 12, description: "Tech & lifestyle creators needed to review our new Airdopes 500 ANC range. Deliverables include 2 Reels + 1 YouTube Short.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "4", brand: "Zomato", logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&h=80&fit=crop",
    title: "Zomato Food Stories",
    budget: "₹4L–8L", category: "Food", deadline: "Mar 28, 2026",
    slots: 60, filled: 25, description: "Food creators for authentic street food and restaurant reviews across India. Video-first content preferred.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "5", brand: "Nykaa", logo: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&h=80&fit=crop",
    title: "Nykaa Festive Glow",
    budget: "₹2L–5L", category: "Beauty", deadline: "Apr 5, 2026",
    slots: 100, filled: 45, description: "Beauty creators for festive makeup looks and skincare routines. GRWM format preferred.",
    platforms: ["Instagram"]
  },
  {
    id: "6", brand: "Myntra", logo: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=80&h=80&fit=crop",
    title: "Myntra Style Drop",
    budget: "₹6L–12L", category: "Fashion", deadline: "Mar 18, 2026",
    slots: 20, filled: 8, description: "Premium fashion creators for exclusive designer collaboration. High-end styling content required.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "7", brand: "Swiggy", logo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=80&h=80&fit=crop",
    title: "Swiggy Dine Out",
    budget: "₹3L–6L", category: "Food", deadline: "Apr 10, 2026",
    slots: 75, filled: 30, description: "Food and lifestyle creators for restaurant discovery content. Focus on ambiance and dining experience.",
    platforms: ["Instagram"]
  },
  {
    id: "8", brand: "Noise", logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    title: "Noise Smartwatch Launch",
    budget: "₹4L–9L", category: "Tech", deadline: "Apr 8, 2026",
    slots: 40, filled: 15, description: "Tech reviewers & fitness creators for our latest smartwatch. Unboxing + 7-day review format.",
    platforms: ["YouTube", "Instagram"]
  },
];

export const categories = ["All", "Fashion", "Tech", "Fitness", "Food", "Travel", "Gaming", "Beauty", "Lifestyle", "Finance", "Comedy"];
export const platforms = ["All", "Instagram", "YouTube", "Twitter"];
