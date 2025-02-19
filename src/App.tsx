
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import JobSeekerDashboard from "./pages/dashboard/JobSeekerDashboard";
import RecruiterDashboard from "./pages/dashboard/RecruiterDashboard";
import JobOfferManager from "./pages/dashboard/JobOfferManager";
import CVManager from "./pages/profile/CVManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard/job-seeker" element={<JobSeekerDashboard />} />
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
          <Route path="/dashboard/job-offer/new" element={<JobOfferManager />} />
          <Route path="/dashboard/job-offer/:id/edit" element={<JobOfferManager />} />
          <Route path="/profile/cv" element={<CVManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
