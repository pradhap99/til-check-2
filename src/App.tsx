import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Index from "./pages/Index";
import Creators from "./pages/Creators";
import CreatorDetail from "./pages/CreatorDetail";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignManage from "./pages/CampaignManage";
import Messages from "./pages/Messages";
import ChatConversation from "./pages/ChatConversation";
import Notifications from "./pages/Notifications";
import Onboarding from "./pages/Onboarding";
import EditProfile from "./pages/EditProfile";
import MyApplications from "./pages/MyApplications";
import CreatorWorkspace from "./pages/CreatorWorkspace";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";
import Earnings from "./pages/Earnings";
import Escrow from "./pages/Escrow";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Reviews from "./pages/Reviews";
import SavedCreators from "./pages/SavedCreators";
import Admin from "./pages/Admin";
import CreatorMediaKit from "./pages/CreatorMediaKit";
import ManagedServices from "./pages/ManagedServices";
import Pricing from "./pages/Pricing";
import Community from "./pages/Community";
import Channels from "./pages/Channels";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <OnboardingProvider>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/creators" element={<ProtectedRoute><Creators /></ProtectedRoute>} />
              <Route path="/creators/:id" element={<ProtectedRoute><CreatorDetail /></ProtectedRoute>} />
              <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
              <Route path="/campaigns/create" element={<ProtectedRoute requiredRole="brand"><CreateCampaign /></ProtectedRoute>} />
              <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
              <Route path="/campaigns/:id/manage" element={<ProtectedRoute requiredRole="brand"><CampaignManage /></ProtectedRoute>} />
              <Route path="/campaigns/:id/applications" element={<ProtectedRoute requiredRole="brand"><CampaignManage /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/messages/:id" element={<ProtectedRoute><ChatConversation /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
              <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/workspace/:applicationId" element={<ProtectedRoute><CreatorWorkspace /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute requiredRole="brand"><Recommendations /></ProtectedRoute>} />
              <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
              <Route path="/escrow" element={<ProtectedRoute><Escrow /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
              <Route path="/saved" element={<ProtectedRoute requiredRole="brand"><SavedCreators /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
              <Route path="/media-kit/:userId" element={<CreatorMediaKit />} />
              <Route path="/media-kit" element={<ProtectedRoute><CreatorMediaKit /></ProtectedRoute>} />
              <Route path="/managed-services" element={<ProtectedRoute><ManagedServices /></ProtectedRoute>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/channels" element={<ProtectedRoute><Channels /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </OnboardingProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
