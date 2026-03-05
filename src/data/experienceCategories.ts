export interface ExperienceCategory {
  id: string;
  label: string;
  emoji: string;
  group: string;
  img?: string;
}

export const CATEGORY_GROUPS = [
  "Food & Dining",
  "Hospitality & Travel",
  "Beauty & Wellness",
  "Fitness & Sports",
  "Fashion & Lifestyle",
  "Entertainment & Experiences",
  "Retail & Shopping",
  "Services & Professional",
] as const;

export const EXPERIENCE_CATEGORIES: ExperienceCategory[] = [
  // Food & Dining
  { id: "breakfast-cafes", label: "Breakfast & Brunch Cafés", emoji: "☕", group: "Food & Dining", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
  { id: "fine-dining", label: "Fine Dining & Rooftops", emoji: "🍽️", group: "Food & Dining", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400" },
  { id: "street-food", label: "Street Food & Local Eats", emoji: "🌮", group: "Food & Dining", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400" },
  { id: "cloud-kitchens", label: "Cloud Kitchens & Delivery", emoji: "🍱", group: "Food & Dining", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
  { id: "bakeries", label: "Bakeries & Dessert Parlours", emoji: "🧁", group: "Food & Dining", img: "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=400" },
  { id: "bars-nightlife", label: "Bars & Nightlife", emoji: "🍸", group: "Food & Dining", img: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400" },
  { id: "food-festivals", label: "Food Festivals & Pop-ups", emoji: "🎪", group: "Food & Dining", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
  { id: "home-chefs", label: "Home Chefs & Catering", emoji: "👨‍🍳", group: "Food & Dining", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400" },

  // Hospitality & Travel
  { id: "staycations", label: "Weekend Staycations", emoji: "🏖️", group: "Hospitality & Travel", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
  { id: "luxury-hotels", label: "Luxury Hotels & Resorts", emoji: "🏨", group: "Hospitality & Travel", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400" },
  { id: "budget-stays", label: "Budget Stays & Hostels", emoji: "🛏️", group: "Hospitality & Travel", img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400" },
  { id: "hill-stations", label: "Hill Stations & Adventure", emoji: "🏔️", group: "Hospitality & Travel", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400" },
  { id: "beaches", label: "Beach Destinations", emoji: "🏝️", group: "Hospitality & Travel", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
  { id: "heritage-tours", label: "Cultural & Heritage Tours", emoji: "🕌", group: "Hospitality & Travel", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400" },

  // Beauty & Wellness
  { id: "salons-spas", label: "Salons & Spas", emoji: "💅", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400" },
  { id: "makeup-studios", label: "Makeup Artists & Studios", emoji: "💄", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400" },
  { id: "hair-styling", label: "Hair Styling & Treatment", emoji: "💇", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400" },
  { id: "nail-art", label: "Nail Art & Extensions", emoji: "💅", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400" },
  { id: "tattoo-studios", label: "Tattoo & Piercing Studios", emoji: "🎨", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400" },
  { id: "ayurveda", label: "Ayurveda & Wellness Centers", emoji: "🧘", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400" },
  { id: "dermatology", label: "Dermatology & Skin Clinics", emoji: "🩺", group: "Beauty & Wellness", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400" },

  // Fitness & Sports
  { id: "gyms", label: "Gyms & Fitness Studios", emoji: "💪", group: "Fitness & Sports", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" },
  { id: "yoga", label: "Yoga & Meditation Centers", emoji: "🧘‍♀️", group: "Fitness & Sports", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400" },
  { id: "dance-zumba", label: "Dance & Zumba Classes", emoji: "💃", group: "Fitness & Sports", img: "https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?w=400" },
  { id: "sports", label: "Sports Facilities & Training", emoji: "⚽", group: "Fitness & Sports", img: "https://images.unsplash.com/photo-1461896836934-bd45ba25bcdd?w=400" },
  { id: "crossfit", label: "CrossFit & Functional Training", emoji: "🏋️", group: "Fitness & Sports", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
  { id: "martial-arts", label: "Martial Arts & Boxing", emoji: "🥊", group: "Fitness & Sports", img: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400" },

  // Fashion & Lifestyle
  { id: "fashion-brands", label: "Fashion Brands & Boutiques", emoji: "👗", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400" },
  { id: "jewelry", label: "Jewelry & Accessories", emoji: "💎", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1515562141589-67f0d5b95027?w=400" },
  { id: "ethnic-wear", label: "Ethnic Wear & Wedding Fashion", emoji: "👰", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400" },
  { id: "streetwear", label: "Streetwear & Sneakers", emoji: "👟", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400" },
  { id: "sustainable-fashion", label: "Sustainable & Eco Fashion", emoji: "♻️", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" },
  { id: "luxury-fashion", label: "Luxury & Designer Wear", emoji: "👔", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400" },
  { id: "kids-fashion", label: "Kids Fashion & Toys", emoji: "🧸", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400" },
  { id: "bags-footwear", label: "Bags & Footwear", emoji: "👜", group: "Fashion & Lifestyle", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },

  // Entertainment & Experiences
  { id: "photography", label: "Photography & Photoshoots", emoji: "📸", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
  { id: "events-concerts", label: "Events & Concerts", emoji: "🎭", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400" },
  { id: "adventure", label: "Adventure Activities", emoji: "⛷️", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400" },
  { id: "gaming", label: "Gaming & E-sports", emoji: "🎮", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400" },
  { id: "art-workshops", label: "Art & Craft Workshops", emoji: "🎨", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400" },
  { id: "pet-cafes", label: "Pet Cafés & Services", emoji: "🐾", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400" },
  { id: "bookstores", label: "Bookstores & Libraries", emoji: "📚", group: "Entertainment & Experiences", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400" },

  // Retail & Shopping
  { id: "shopping-malls", label: "Shopping Malls & Stores", emoji: "🛍️", group: "Retail & Shopping", img: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400" },
  { id: "electronics", label: "Electronics & Gadgets", emoji: "📱", group: "Retail & Shopping", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
  { id: "home-decor", label: "Home Decor & Furniture", emoji: "🛋️", group: "Retail & Shopping", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400" },
  { id: "plants-gardening", label: "Plants & Gardening", emoji: "🌱", group: "Retail & Shopping", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400" },
  { id: "stationery", label: "Stationery & Art Supplies", emoji: "✏️", group: "Retail & Shopping", img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400" },
  { id: "specialty-stores", label: "Specialty Stores", emoji: "🏪", group: "Retail & Shopping", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400" },

  // Services & Professional
  { id: "coworking", label: "Co-working Spaces", emoji: "💼", group: "Services & Professional", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400" },
  { id: "photo-equipment", label: "Photography Equipment Rental", emoji: "📷", group: "Services & Professional", img: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400" },
  { id: "vehicle-rentals", label: "Vehicle Rentals", emoji: "🏍️", group: "Services & Professional", img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400" },
  { id: "online-courses", label: "Online Courses & Education", emoji: "👨‍🏫", group: "Services & Professional", img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400" },
  { id: "financial-services", label: "Financial Services", emoji: "💳", group: "Services & Professional", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400" },
];

// Top 12 categories for landing page
export const TOP_CATEGORIES = EXPERIENCE_CATEGORIES.filter(c =>
  ["breakfast-cafes", "fine-dining", "staycations", "luxury-hotels", "salons-spas", "gyms", "fashion-brands", "photography", "electronics", "street-food", "bars-nightlife", "yoga"].includes(c.id)
);

// Flat label list for dropdowns
export const CATEGORY_LABELS = EXPERIENCE_CATEGORIES.map(c => c.label);

// Category templates for campaign creation
export interface CategoryTemplate {
  deliverables: { type: string; quantity: number; duration?: string; }[];
  dos: string;
  donts: string;
  budgetSuggestion: string;
}

export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  "Breakfast & Brunch Cafés": {
    deliverables: [
      { type: "Instagram Reel", quantity: 2, duration: "30s" },
      { type: "Instagram Story", quantity: 5 },
      { type: "Static Post", quantity: 2 },
    ],
    dos: "Show ambiance and natural lighting\nCapture coffee art and presentation\nInclude pricing in stories\nTag location for discoverability",
    donts: "Post during non-peak hours\nNegative comments about other cafés\nHeavy filters that alter food colors",
    budgetSuggestion: "₹15,000 - ₹45,000",
  },
  "Fine Dining & Rooftops": {
    deliverables: [
      { type: "Instagram Reel", quantity: 2, duration: "60s" },
      { type: "Instagram Story", quantity: 8 },
      { type: "Static Post", quantity: 3 },
    ],
    dos: "Capture ambiance, plating, and views\nMention signature dishes\nTag location and chef if possible",
    donts: "No flash photography\nDon't reveal pricing without permission\nNo competitor mentions",
    budgetSuggestion: "₹25,000 - ₹75,000",
  },
  "Weekend Staycations": {
    deliverables: [
      { type: "Instagram Reel", quantity: 3, duration: "60s" },
      { type: "Instagram Story", quantity: 10 },
      { type: "Static Post", quantity: 4 },
      { type: "YouTube Integration", quantity: 1, duration: "90s" },
    ],
    dos: "Room tour, amenities showcase\nCapture pool, view, dining experiences\nShow check-in to check-out journey",
    donts: "Don't show empty/messy areas\nNo competitor hotel mentions\nDon't share exact room rates unless approved",
    budgetSuggestion: "₹50,000 - ₹120,000",
  },
  "Luxury Hotels & Resorts": {
    deliverables: [
      { type: "Instagram Reel", quantity: 3, duration: "60s" },
      { type: "Instagram Story", quantity: 15 },
      { type: "Static Post", quantity: 4 },
      { type: "YouTube Integration", quantity: 1, duration: "90s" },
    ],
    dos: "Full property walkthrough\nHighlight unique amenities\nCapture sunrise/sunset moments",
    donts: "No negative aspects\nDon't show staff without consent\nNo competitor mentions",
    budgetSuggestion: "₹75,000 - ₹150,000",
  },
  "Salons & Spas": {
    deliverables: [
      { type: "Instagram Reel", quantity: 2, duration: "30s" },
      { type: "Instagram Story", quantity: 6 },
      { type: "Static Post", quantity: 2 },
    ],
    dos: "Show before/after transformation\nCapture the relaxing ambiance\nMention specific treatments",
    donts: "Don't share client faces without consent\nNo competitor mentions\nAvoid medical claims",
    budgetSuggestion: "₹15,000 - ₹40,000",
  },
  "Fashion Brands & Boutiques": {
    deliverables: [
      { type: "Instagram Reel", quantity: 2, duration: "30s" },
      { type: "Instagram Story", quantity: 5 },
      { type: "Static Post", quantity: 3 },
    ],
    dos: "Style multiple outfits\nShow sizing and fit details\nTag products for shopping",
    donts: "Don't alter product colors\nNo competitor brand logos visible\nDon't misrepresent fabric quality",
    budgetSuggestion: "₹20,000 - ₹60,000",
  },
};
