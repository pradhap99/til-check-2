import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { OnboardingProvider } from "@/contexts/OnboardingContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import GlobalCommandPalette from "@/components/GlobalCommandPalette";
import { pageVariants, reducedFade } from "@/lib/motion";
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
import CalendarEvents from "./pages/CalendarEvents";
import Alerts from "./pages/Alerts";
import Offers from "./pages/Offers";
import Redeem from "./pages/Redeem";
import BankTransfer from "./pages/BankTransfer";
import ExperienceCategory from "./pages/ExperienceCategory";
import SuccessStories from "./pages/SuccessStories";
import BrandDashboard from "./pages/brand/BrandDashboard";
import PostCampaign from "./pages/brand/PostCampaign";
import BrandApplications from "./pages/brand/BrandApplications";
import Help from "./pages/Help";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import Showcase from "./pages/Showcase";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  const reduced = useReducedMotion();
  const variants = reduced ? reducedFade : pageVariants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="contents"
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
                <Route path="/showcase" element={<Showcase />} />
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
                <Route path="/calendar" element={<ProtectedRoute><CalendarEvents /></ProtectedRoute>} />
                <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
                <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
                <Route path="/redeem" element={<ProtectedRoute><Redeem /></ProtectedRoute>} />
                <Route path="/bank-transfer" element={<ProtectedRoute><BankTransfer /></ProtectedRoute>} />
                <Route path="/experience/:category" element={<ProtectedRoute><ExperienceCategory /></ProtectedRoute>} />
                <Route path="/stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
                <Route path="/brand/dashboard" element={<ProtectedRoute requiredRole="brand"><BrandDashboard /></ProtectedRoute>} />
                <Route path="/brand/post-campaign" element={<ProtectedRoute requiredRole="brand"><PostCampaign /></ProtectedRoute>} />
                <Route path="/brand/applications" element={<ProtectedRoute requiredRole="brand"><BrandApplications /></ProtectedRoute>} />
                <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
                <Route path="/docs" element={<ProtectedRoute><Documentation /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <OnboardingProvider>
              <GlobalCommandPalette />
              <AnimatedRoutes />
            </OnboardingProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
