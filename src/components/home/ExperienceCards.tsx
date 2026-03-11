const experiences = [
  { id: "cafes", label: "Cafés", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop" },
  { id: "dining", label: "Dining", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop" },
  { id: "staycations", label: "Staycations", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=300&h=200&fit=crop" },
  { id: "photoshoots", label: "Studios", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=200&fit=crop" },
  { id: "events", label: "Events", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop" },
  { id: "beauty", label: "Beauty", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300&h=200&fit=crop" },
];

interface ExperienceCardsProps {
  selected: string;
  onSelect: (id: string) => void;
}

const ExperienceCards = ({ selected, onSelect }: ExperienceCardsProps) => {
  return (
    <section className="mt-5">
      <h3 className="font-heading font-bold text-[15px] text-foreground px-5 mb-3">Browse by Experience</h3>
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-5 pb-1">
        {experiences.map((exp) => {
          const isActive = selected === exp.id;
          return (
            <button
              key={exp.id}
              onClick={() => onSelect(exp.id === selected ? "all" : exp.id)}
              className={`relative shrink-0 w-[100px] h-[72px] rounded-2xl overflow-hidden active:scale-95 transition-all duration-200 ${
                isActive ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : ""
              }`}
            >
              <img src={exp.image} alt={exp.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-2 left-2 text-white text-[11px] font-heading font-bold">
                {exp.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceCards;
