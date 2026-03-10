import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const brandLocations: Record<string, [number, number]> = {
  Lenskart: [28.6139, 77.209],
  Mamaearth: [19.076, 72.8777],
  boAt: [12.9716, 77.5946],
  CRED: [17.385, 78.4867],
  Sugar: [22.5726, 88.3639],
  Nykaa: [19.076, 72.8777],
  Myntra: [12.9716, 77.5946],
  Swiggy: [12.9716, 77.5946],
  Noise: [28.6139, 77.209],
  Zomato: [28.6139, 77.209],
};

const customIcon = (brandName: string) =>
  L.divIcon({
    className: "",
    html: `<div style="width:40px;height:40px;border-radius:50%;background:#1a1a2e;border:2px solid #f59e0b;display:flex;align-items:center;justify-content:center;color:#f59e0b;font-weight:bold;font-size:14px;box-shadow:0 0 8px rgba(245,158,11,0.4)">${brandName[0]}</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

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
    <div style={{ height: "300px", width: "100%", position: "relative" }} className="rounded-2xl overflow-hidden border border-border">
      <MapContainer
        key="campaign-map"
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {campaigns.map((campaign) => {
          const pos = brandLocations[campaign.brand] || [20.5937, 78.9629];
          return (
            <Marker key={campaign.id} position={pos} icon={customIcon(campaign.brand)}>
              <Popup>
                <div className="flex flex-col gap-2 min-w-[160px] p-1">
                  <p className="font-bold text-sm">{campaign.brand}</p>
                  <p className="text-xs">{campaign.title}</p>
                  <span className="text-xs font-semibold text-amber-600">{campaign.budget}</span>
                  <Button
                    size="sm"
                    className="h-7 text-[11px] rounded-lg"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    Apply Now
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default CampaignMapView;
