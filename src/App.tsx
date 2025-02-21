
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import JobSeekerDashboard from "./pages/dashboard/JobSeekerDashboard";
import RecruiterDashboard from "./pages/dashboard/RecruiterDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import JobOfferManager from "./pages/dashboard/JobOfferManager";
import CVManager from "./pages/profile/CVManager";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si un rôle est requis, vérifiez-le ici
  // Pour l'instant, nous permettons l'accès sans vérification de rôle

  return children;
};

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
          
          {/* Routes protégées */}
          <Route path="/dashboard/job-seeker" element={
            <ProtectedRoute requiredRole="job-seeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/recruiter" element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/job-offer/new" element={
            <ProtectedRoute requiredRole="recruiter">
              <JobOfferManager />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard/job-offer/:id/edit" element={
            <ProtectedRoute requiredRole="recruiter">
              <JobOfferManager />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/cv" element={
            <ProtectedRoute>
              <CVManager />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
