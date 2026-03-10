import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { campaigns } from "@/data/mockData";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, isSameDay } from "date-fns";

// Assign dates to campaigns for the calendar view
const campaignDates: Record<string, Date> = {
  "1": new Date(2026, 2, 20),
  "2": new Date(2026, 2, 25),
  "3": new Date(2026, 3, 1),
  "4": new Date(2026, 2, 28),
  "5": new Date(2026, 3, 5),
  "6": new Date(2026, 2, 18),
  "7": new Date(2026, 3, 10),
  "8": new Date(2026, 3, 8),
};

const campaignCities: Record<string, string> = {
  "1": "Delhi", "2": "Mumbai", "3": "Gurugram", "4": "Bangalore",
  "5": "Mumbai", "6": "Bangalore", "7": "Bangalore", "8": "Delhi",
};

const campaignImageMap: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=240&fit=crop",
  "2": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=240&fit=crop",
  "3": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=240&fit=crop",
  "4": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=240&fit=crop",
  "5": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=240&fit=crop",
  "6": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=240&fit=crop",
  "7": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=240&fit=crop",
  "8": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=240&fit=crop",
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarEvents = () => {
  const navigate = useNavigate();
  const today = new Date(2026, 2, 10); // Mar 10, 2026
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // Generate next 7 days for scroller
  const next7Days = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  // Get campaigns for selected date, or show all upcoming if today
  const filteredCampaigns = isSameDay(selectedDate, today)
    ? campaigns
    : campaigns.filter((c) => {
        const d = campaignDates[c.id];
        return d && isSameDay(d, selectedDate);
      });

  // For display, always show campaigns grouped - featured first then grid
  const displayCampaigns = filteredCampaigns.length > 0 ? filteredCampaigns : campaigns;
  const featuredCampaign = displayCampaigns[0];
  const gridCampaigns = displayCampaigns.slice(1);

  return (
    <Layout>
      <div className="radial-gradient-bg min-h-screen">
        {/* Header */}
        <header className="px-5 pt-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Campaign Calendar</p>
              <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">
                Upcoming in India 🇮🇳
              </h1>
            </div>
            <CalendarDays className="w-5 h-5 text-accent" />
          </div>
        </header>

        {/* Horizontal Date Scroller */}
        <section className="px-5 mt-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {next7Days.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[52px] h-[68px] rounded-2xl border transition-all duration-200 shrink-0",
                    isSelected
                      ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20"
                      : "bg-card border-border text-muted-foreground hover:border-accent/30"
                  )}
                >
                  <span className={cn("text-[10px] font-medium", isSelected && "text-accent-foreground")}>
                    {dayNames[day.getDay()]}
                  </span>
                  <span className={cn("text-lg font-heading font-bold mt-0.5", isSelected ? "text-accent-foreground" : "text-foreground")}>
                    {day.getDate()}
                  </span>
                  <span className={cn("text-[8px]", isSelected ? "text-accent-foreground/70" : "text-muted-foreground")}>
                    {format(day, "MMM")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* View Full Calendar Button */}
        <div className="px-5 mt-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-9 rounded-xl text-xs gap-2">
                <CalendarDays className="w-3.5 h-3.5" />
                View Full Calendar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Label */}
        <div className="px-5 mt-5 mb-3">
          <h2 className="font-heading font-bold text-sm text-foreground">
            {isSameDay(selectedDate, today) ? "All Upcoming Campaigns" : format(selectedDate, "EEEE, MMM d")}
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {displayCampaigns.length} campaign{displayCampaigns.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Featured Campaign (Hero) */}
        {featuredCampaign && (
          <section className="px-5 mb-4">
            <div
              onClick={() => navigate(`/campaigns/${featuredCampaign.id}`)}
              className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer active:scale-[0.98] transition-transform duration-150 opacity-0 animate-fade-up"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="relative h-[160px]">
                <img
                  src={campaignImageMap[featuredCampaign.id]}
                  alt={featuredCampaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-[10px] font-heading font-bold px-3 py-1 rounded-lg shadow-lg">
                  Apply
                </span>
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <h3 className="text-white font-heading font-bold text-base leading-tight">
                    {featuredCampaign.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white/80 text-[11px]">{featuredCampaign.brand}</span>
                    <span className="text-white/60 text-[10px]">•</span>
                    <span className="text-accent text-[11px] font-semibold">{featuredCampaign.budget}</span>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{campaignCities[featuredCampaign.id]}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Deadline: {featuredCampaign.deadline}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Campaign Grid (2 columns) */}
        {gridCampaigns.length > 0 && (
          <section className="px-5 pb-8">
            <div className="grid grid-cols-2 gap-3">
              {gridCampaigns.map((campaign, i) => (
                <div
                  key={campaign.id}
                  onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  className="rounded-2xl overflow-hidden bg-card border border-border cursor-pointer active:scale-[0.96] transition-transform duration-150 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "forwards" }}
                >
                  <div className="relative h-[100px]">
                    <img
                      src={campaignImageMap[campaign.id]}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-[8px] font-heading font-bold px-2 py-0.5 rounded-md">
                      Apply
                    </span>
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-[11px] font-heading font-semibold text-foreground leading-tight line-clamp-2">
                      {campaign.title}
                    </h4>
                    <div className="flex items-center gap-1 mt-1.5">
                      <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground">{campaignCities[campaign.id]}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-accent mt-1 inline-block">{campaign.budget}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default CalendarEvents;
