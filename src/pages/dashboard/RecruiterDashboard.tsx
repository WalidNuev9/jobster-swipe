
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, CheckCircle, Clock, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/dashboard/StatCard";
import CandidatesChart from "@/components/dashboard/CandidatesChart";
import JobOffersList from "@/components/dashboard/JobOffersList";

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  created_at: string;
}

const chartData = [
  { date: "Lun", candidates: 12 },
  { date: "Mar", candidates: 19 },
  { date: "Mer", candidates: 15 },
  { date: "Jeu", candidates: 25 },
  { date: "Ven", candidates: 32 },
  { date: "Sam", candidates: 18 },
  { date: "Dim", candidates: 14 }
];

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const stats = {
    activeJobs: jobOffers.filter(job => job.status === 'active').length,
    totalCandidates: 156,
    shortlisted: 45,
    pending: 23
  };

  useEffect(() => {
    fetchJobOffers();
  }, []);

  const fetchJobOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobOffers(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les offres d'emploi"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return;

    try {
      const { error } = await supabase
        .from('job_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setJobOffers(prev => prev.filter(offer => offer.id !== id));
      toast({
        title: "Offre supprimée",
        description: "L'offre d'emploi a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'offre"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tableau de bord recruteur</h1>
          <Button onClick={() => navigate("/dashboard/job-offer/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle offre
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={Briefcase}
            value={stats.activeJobs}
            label="Offres actives"
          />
          <StatCard 
            icon={Users}
            value={stats.totalCandidates}
            label="Total candidats"
            iconColor="text-blue-500"
          />
          <StatCard 
            icon={CheckCircle}
            value={stats.shortlisted}
            label="Présélectionnés"
            iconColor="text-success"
          />
          <StatCard 
            icon={Clock}
            value={stats.pending}
            label="En attente"
            iconColor="text-yellow-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CandidatesChart data={chartData} />
          <JobOffersList 
            jobOffers={jobOffers}
            isLoading={isLoading}
            onDelete={handleDeleteOffer}
          />
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
