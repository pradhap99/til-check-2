import { useState, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=400&fit=crop",
    title: "Trending Now — boAt Audio",
    subtitle: "Tech creators wanted for Summer Launch",
    badge: "₹5L–10L",
    campaignId: "1",
  },
  {
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=400&fit=crop",
    title: "Beauty Week — Mamaearth",
    subtitle: "Skincare creators for Vitamin C range",
    badge: "₹3L–7L",
    campaignId: "2",
  },
  {
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&h=400&fit=crop",
    title: "Big Fashion Drop — Lenskart SS'26",
    subtitle: "Fashion-forward eyewear styling",
    badge: "₹8L–15L",
    campaignId: "3",
  },
];

const HeroBannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 3000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="px-4 mt-3">
      <div
        className="relative h-[180px] rounded-2xl overflow-hidden cursor-pointer active:scale-[0.98] transition-transform duration-150"
        onClick={() => navigate(`/campaigns/${slides[current].campaignId}`)}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        ))}

        {/* Badge */}
        <div className="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm text-accent-foreground text-[11px] font-heading font-bold px-2.5 py-1 rounded-lg z-10">
          {slides[current].badge}
        </div>

        {/* Text */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-white font-heading font-bold text-base leading-tight">
            {slides[current].title}
          </h3>
          <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
            {slides[current].subtitle} <ChevronRight className="w-3 h-3" />
          </p>
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 right-4 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-4 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBannerCarousel;
