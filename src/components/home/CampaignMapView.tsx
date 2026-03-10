import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

// Indian city coordinates for campaigns
const campaignLocations: Record<string, { lat: number; lng: number; city: string }> = {
  "1": { lat: 28.6139, lng: 77.209, city: "Delhi" },       // Lenskart
  "2": { lat: 19.076, lng: 72.8777, city: "Mumbai" },       // Mamaearth
  "3": { lat: 28.4595, lng: 77.0266, city: "Gurugram" },    // boAt
  "4": { lat: 12.9716, lng: 77.5946, city: "Bangalore" },   // Zomato
  "5": { lat: 19.076, lng: 72.8777, city: "Mumbai" },       // Nykaa
  "6": { lat: 12.9716, lng: 77.5946, city: "Bangalore" },   // Myntra
  "7": { lat: 12.9716, lng: 77.5946, city: "Bangalore" },   // Swiggy
  "8": { lat: 28.6139, lng: 77.209, city: "Delhi" },        // Noise
};

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

function createBrandIcon(logoUrl: string) {
  return L.divIcon({
    className: "brand-map-pin",
    html: `<div style="width:44px;height:44px;border-radius:50%;border:3px solid hsl(45,93%,58%);overflow:hidden;background:#1a1a2e;box-shadow:0 2px 12px rgba(0,0,0,0.5);">
      <img src="${logoUrl}" style="width:100%;height:100%;object-fit:cover;" />
    </div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26],
  });
}

function RecenterButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView([INDIA_CENTER.lat, INDIA_CENTER.lng], 5, { animate: true })}
      className="absolute bottom-4 right-4 z-[1000] w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center shadow-lg hover:bg-secondary transition-colors"
      title="Re-center map"
    >
      <Crosshair className="w-5 h-5 text-accent" />
    </button>
  );
}

interface CampaignMapViewProps {
  campaigns: Array<{
    id: string;
    brand: string;
    logo: string;
    title: string;
    budget: string;
    category: string;
  }>;
}

const CampaignMapView = ({ campaigns }: CampaignMapViewProps) => {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border h-[320px] opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
      <MapContainer
        center={[INDIA_CENTER.lat, INDIA_CENTER.lng]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ background: "hsl(var(--background))" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {campaigns.map((campaign) => {
          const loc = campaignLocations[campaign.id];
          if (!loc) return null;
          return (
            <Marker
              key={campaign.id}
              position={[loc.lat, loc.lng]}
              icon={createBrandIcon(campaign.logo)}
            >
              <Popup className="brand-map-popup">
                <div className="flex flex-col gap-2 min-w-[180px] p-1">
                  <p className="font-heading font-bold text-sm text-foreground leading-tight">{campaign.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">{loc.city}</span>
                    <span className="text-[10px] font-semibold text-accent">{campaign.budget}</span>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 text-[11px] rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    Apply Now
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <RecenterButton />
      </MapContainer>
    </div>
  );
};

export default CampaignMapView;
