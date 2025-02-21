
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StatCard from "@/components/dashboard/StatCard";
import { Users, Briefcase, UserCheck, Building } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalRecruiters: number;
  totalJobSeekers: number;
  totalJobOffers: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobSeekers: 0,
    totalJobOffers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { count: jobOffersCount } = await supabase
        .from('job_offers')
        .select('*', { count: 'exact', head: true });

      const { count: profilesCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: profilesCount || 0,
        totalRecruiters: Math.floor((profilesCount || 0) * 0.3), // Exemple
        totalJobSeekers: Math.floor((profilesCount || 0) * 0.7), // Exemple
        totalJobOffers: jobOffersCount || 0
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les statistiques"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administration</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                value={stats.totalUsers}
                label="Utilisateurs total"
                iconColor="text-blue-500"
              />
              <StatCard
                icon={Building}
                value={stats.totalRecruiters}
                label="Recruteurs"
                iconColor="text-green-500"
              />
              <StatCard
                icon={UserCheck}
                value={stats.totalJobSeekers}
                label="Chercheurs d'emploi"
                iconColor="text-purple-500"
              />
              <StatCard
                icon={Briefcase}
                value={stats.totalJobOffers}
                label="Offres d'emploi"
                iconColor="text-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Gestion des utilisateurs</h2>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/admin/users")}
                  >
                    Gérer les utilisateurs
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => navigate("/admin/roles")}
                  >
                    Gérer les rôles
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Gestion du contenu</h2>
                <div className="space-y-4">
                  <Button 
                    className="w-full"
                    onClick={() => navigate("/admin/job-offers")}
                  >
                    Gérer les offres d'emploi
                  </Button>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate("/admin/cvs")}
                  >
                    Gérer les CVs
                  </Button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
