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
    id: "1", name: "Priya Sharma", handle: "@priyacreates", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
    category: "Fashion", followers: "1.2M", engagement: "4.8%", platform: "Instagram", location: "Mumbai", rate: "₹50K-1L", verified: true,
    bio: "Fashion & lifestyle creator sharing everyday Indian glam"
  },
  {
    id: "2", name: "Arjun Reddy", handle: "@arjuntechtalks", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Arjun",
    category: "Tech", followers: "890K", engagement: "5.2%", platform: "YouTube", location: "Hyderabad", rate: "₹75K-1.5L", verified: true,
    bio: "Simplifying tech for Bharat, one video at a time"
  },
  {
    id: "3", name: "Neha Kapoor", handle: "@nehafitlife", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Neha",
    category: "Fitness", followers: "650K", engagement: "6.1%", platform: "Instagram", location: "Delhi", rate: "₹30K-60K", verified: true,
    bio: "Certified trainer & nutritionist | Plant-based athlete"
  },
  {
    id: "4", name: "Vikram Singh", handle: "@vikramfoodie", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Vikram",
    category: "Food", followers: "2.1M", engagement: "3.9%", platform: "Instagram", location: "Jaipur", rate: "₹80K-2L", verified: true,
    bio: "Exploring India's street food, one city at a time 🍛"
  },
  {
    id: "5", name: "Aisha Khan", handle: "@aishatravels", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aisha",
    category: "Travel", followers: "430K", engagement: "7.3%", platform: "Instagram", location: "Goa", rate: "₹25K-50K", verified: false,
    bio: "Solo traveler | Budget trips across India & SEA"
  },
  {
    id: "6", name: "Rohit Mehta", handle: "@rohitgaming", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rohit",
    category: "Gaming", followers: "1.5M", engagement: "8.5%", platform: "YouTube", location: "Pune", rate: "₹1L-3L", verified: true,
    bio: "Pro gamer & streamer | BGMI & Valorant"
  },
  {
    id: "7", name: "Kavya Nair", handle: "@kavyabeauty", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Kavya",
    category: "Beauty", followers: "780K", engagement: "5.7%", platform: "Instagram", location: "Kochi", rate: "₹40K-80K", verified: true,
    bio: "Dupes, skincare routines & honest beauty reviews"
  },
  {
    id: "8", name: "Saurabh Joshi", handle: "@saurabhvlogs", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Saurabh",
    category: "Lifestyle", followers: "3.2M", engagement: "4.2%", platform: "YouTube", location: "Lucknow", rate: "₹2L-5L", verified: true,
    bio: "Daily vlogs from the heart of UP 🎥"
  },
  {
    id: "9", name: "Meera Patel", handle: "@meerafinance", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Meera",
    category: "Finance", followers: "520K", engagement: "6.8%", platform: "Twitter", location: "Ahmedabad", rate: "₹35K-70K", verified: false,
    bio: "Making personal finance simple for millennials"
  },
  {
    id: "10", name: "Dev Malhotra", handle: "@devcomedian", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Dev",
    category: "Comedy", followers: "1.8M", engagement: "9.1%", platform: "Instagram", location: "Bangalore", rate: "₹1.5L-4L", verified: true,
    bio: "Stand-up clips & relatable Indian humor 😂"
  },
];

export const campaigns: Campaign[] = [
  {
    id: "1", brand: "BoAt", logo: "🎧", title: "Summer Audio Launch",
    budget: "₹5L-10L", category: "Tech", deadline: "Apr 15, 2026",
    slots: 8, filled: 3, description: "Looking for tech & lifestyle creators to promote our new wireless earbuds range.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "2", brand: "Mamaearth", logo: "🌿", title: "Natural Skincare Campaign",
    budget: "₹3L-7L", category: "Beauty", deadline: "Mar 30, 2026",
    slots: 12, filled: 7, description: "Seeking beauty & skincare creators for our new toxin-free product line launch.",
    platforms: ["Instagram"]
  },
  {
    id: "3", brand: "Lenskart", logo: "👓", title: "Style Your Vision",
    budget: "₹8L-15L", category: "Fashion", deadline: "May 1, 2026",
    slots: 15, filled: 5, description: "Fashion-forward creators needed for our premium eyewear collection.",
    platforms: ["Instagram", "YouTube"]
  },
  {
    id: "4", brand: "CRED", logo: "💳", title: "Rewards Reloaded",
    budget: "₹10L-20L", category: "Finance", deadline: "Apr 20, 2026",
    slots: 6, filled: 2, description: "Creative storytellers to showcase CRED's new rewards ecosystem.",
    platforms: ["Instagram", "Twitter", "YouTube"]
  },
  {
    id: "5", brand: "Sugar Cosmetics", logo: "💄", title: "Bold & Beautiful",
    budget: "₹4L-8L", category: "Beauty", deadline: "Mar 25, 2026",
    slots: 10, filled: 8, description: "Beauty creators for our festive makeup collection. Bold looks only!",
    platforms: ["Instagram"]
  },
  {
    id: "6", brand: "Noise", logo: "⌚", title: "Smartwatch Series X",
    budget: "₹6L-12L", category: "Tech", deadline: "Apr 10, 2026",
    slots: 10, filled: 4, description: "Tech reviewers and fitness influencers for our latest smartwatch launch.",
    platforms: ["YouTube", "Instagram"]
  },
];

export const categories = ["All", "Fashion", "Tech", "Fitness", "Food", "Travel", "Gaming", "Beauty", "Lifestyle", "Finance", "Comedy"];
export const platforms = ["All", "Instagram", "YouTube", "Twitter"];
