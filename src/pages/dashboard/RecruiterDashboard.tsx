
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock,
  ChartLine,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  created_at: string;
}

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Statistiques
  const stats = {
    activeJobs: jobOffers.filter(job => job.status === 'active').length,
    totalCandidates: 156,
    shortlisted: 45,
    pending: 23
  };

  const chartData = [
    { date: "Lun", candidates: 12 },
    { date: "Mar", candidates: 19 },
    { date: "Mer", candidates: 15 },
    { date: "Jeu", candidates: 25 },
    { date: "Ven", candidates: 32 },
    { date: "Sam", candidates: 18 },
    { date: "Dim", candidates: 14 }
  ];

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
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{stats.activeJobs}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Offres actives</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">{stats.totalCandidates}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total candidats</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
              <span className="text-2xl font-bold">{stats.shortlisted}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Présélectionnés</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.pending}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">En attente</h3>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Candidatures reçues</h2>
              <ChartLine className="h-5 w-5 text-gray-500" />
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="candidates" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="candidates"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#candidates)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Offres d'emploi</h2>
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/job-offer/new")}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center py-4">Chargement...</p>
              ) : jobOffers.length === 0 ? (
                <p className="text-center py-4 text-gray-500">Aucune offre d'emploi</p>
              ) : (
                jobOffers.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-800">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company} - {job.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/job-offer/${job.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteOffer(job.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
