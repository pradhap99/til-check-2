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
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    category: "Fashion", followers: "1.2M", engagement: "4.8%", platform: "Instagram", location: "Mumbai", rate: "₹50K–1L", verified: true,
    bio: "Fashion & lifestyle creator. Worked with Myntra, Nykaa, H&M India. 3+ years in brand collaborations."
  },
  {
    id: "2", name: "Arjun Reddy", handle: "@arjuntechtalks",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    category: "Tech", followers: "890K", engagement: "5.2%", platform: "YouTube", location: "Hyderabad", rate: "₹75K–1.5L", verified: true,
    bio: "Tech reviewer & unboxer. Featured on T3 India. Specializes in smartphones, laptops, and audio gear."
  },
  {
    id: "3", name: "Neha Kapoor", handle: "@nehakapoor.fit",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    category: "Fitness", followers: "650K", engagement: "6.1%", platform: "Instagram", location: "New Delhi", rate: "₹30K–60K", verified: true,
    bio: "ACE-certified trainer & sports nutritionist. Brand ambassador for Decathlon India."
  },
  {
    id: "4", name: "Vikram Singh", handle: "@vikramfoodie",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    category: "Food", followers: "2.1M", engagement: "3.9%", platform: "Instagram", location: "Jaipur", rate: "₹80K–2L", verified: true,
    bio: "Food critic & street food explorer. Featured on NDTV Food, collaborations with Zomato & Swiggy."
  },
  {
    id: "5", name: "Aisha Khan", handle: "@aisha.travels",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    category: "Travel", followers: "430K", engagement: "7.3%", platform: "Instagram", location: "Goa", rate: "₹25K–50K", verified: false,
    bio: "Solo travel blogger covering budget trips across India & Southeast Asia. MakeMyTrip partner creator."
  },
  {
    id: "6", name: "Rohit Mehta", handle: "@rohitmehta_",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    category: "Gaming", followers: "1.5M", engagement: "8.5%", platform: "YouTube", location: "Pune", rate: "₹1L–3L", verified: true,
    bio: "Professional esports player & content creator. BGMI champion, streaming partner with Loco."
  },
  {
    id: "7", name: "Kavya Nair", handle: "@kavyanairbeauty",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    category: "Beauty", followers: "780K", engagement: "5.7%", platform: "Instagram", location: "Kochi", rate: "₹40K–80K", verified: true,
    bio: "Skincare specialist & beauty reviewer. Collaborated with Sugar Cosmetics, Plum, and L'Oreal India."
  },
  {
    id: "8", name: "Saurabh Joshi", handle: "@saurabhjoshi",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
    category: "Lifestyle", followers: "3.2M", engagement: "4.2%", platform: "YouTube", location: "Lucknow", rate: "₹2L–5L", verified: true,
    bio: "Daily vlogger with 3.2M subscribers. Known for authentic storytelling. Worked with Samsung, OnePlus."
  },
  {
    id: "9", name: "Meera Patel", handle: "@meerapatel.fin",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    category: "Finance", followers: "520K", engagement: "6.8%", platform: "Twitter", location: "Ahmedabad", rate: "₹35K–70K", verified: false,
    bio: "SEBI-registered advisor simplifying personal finance. Collaborations with Groww, Zerodha, CRED."
  },
  {
    id: "10", name: "Dev Malhotra", handle: "@devmalhotra",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    category: "Comedy", followers: "1.8M", engagement: "9.1%", platform: "Instagram", location: "Bangalore", rate: "₹1.5L–4L", verified: true,
    bio: "Stand-up comedian & content creator. Performed at Canvas Laugh Club. Brand partnerships with Swiggy, Dunzo."
  },
];

export const campaigns: Campaign[] = [
  {
    id: "1", brand: "boAt", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    title: "Summer Audio Launch 2026",
    budget: "₹5L–10L", category: "Tech", deadline: "Apr 15, 2026",
    slots: 8, filled: 3, description: "Tech & lifestyle creators needed to review our new Airdopes 500 ANC range. Deliverables include 2 Reels + 1 YouTube Short.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "2", brand: "Mamaearth", logo: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=80&h=80&fit=crop",
    title: "Toxin-Free Skincare Drive",
    budget: "₹3L–7L", category: "Beauty", deadline: "Mar 30, 2026",
    slots: 12, filled: 7, description: "Skincare & beauty creators for our new Vitamin C range launch. Must create before/after content with honest reviews.",
    platforms: ["Instagram"]
  },
  {
    id: "3", brand: "Lenskart", logo: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=80&h=80&fit=crop",
    title: "Style Your Vision — SS'26",
    budget: "₹8L–15L", category: "Fashion", deadline: "May 1, 2026",
    slots: 15, filled: 5, description: "Fashion-forward creators for our premium John Jacobs collection. Looking for outfit integration + eyewear styling content.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "4", brand: "CRED", logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=80&fit=crop",
    title: "CRED Rewards Reloaded",
    budget: "₹10L–20L", category: "Finance", deadline: "Apr 20, 2026",
    slots: 6, filled: 2, description: "Creative storytellers to showcase CRED's new rewards ecosystem. High-concept, cinematic-style content preferred.",
    platforms: ["Instagram", "Twitter", "YouTube"]
  },
  {
    id: "5", brand: "Sugar Cosmetics", logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=80&fit=crop",
    title: "Bold Everyday Collection",
    budget: "₹4L–8L", category: "Beauty", deadline: "Mar 25, 2026",
    slots: 10, filled: 8, description: "Beauty creators for our festive-to-daily makeup transition campaign. GRWM format preferred. Product seeding included.",
    platforms: ["Instagram"]
  },
  {
    id: "6", brand: "Noise", logo: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    title: "NoiseFit Evolve X Launch",
    budget: "₹6L–12L", category: "Tech", deadline: "Apr 10, 2026",
    slots: 10, filled: 4, description: "Tech reviewers & fitness creators for our latest smartwatch. Unboxing + 7-day review format. Comparison content welcome.",
    platforms: ["YouTube", "Instagram"]
  },
];

export const categories = ["All", "Fashion", "Tech", "Fitness", "Food", "Travel", "Gaming", "Beauty", "Lifestyle", "Finance", "Comedy"];
export const platforms = ["All", "Instagram", "YouTube", "Twitter"];
