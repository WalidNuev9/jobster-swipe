
import { Card } from "@/components/ui/card";
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock,
  ChartLine
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RecruiterDashboard = () => {
  // Données de test
  const stats = {
    activeJobs: 12,
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

  const recentJobs = [
    {
      id: "1",
      title: "Développeur Frontend React",
      applicants: 45,
      status: "active",
      posted: "2024-02-15"
    },
    {
      id: "2",
      title: "Développeur Full Stack",
      applicants: 32,
      status: "active",
      posted: "2024-02-14"
    },
    {
      id: "3",
      title: "Ingénieur DevOps",
      applicants: 28,
      status: "ended",
      posted: "2024-02-13"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord recruteur</h1>
        
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
            <h2 className="text-xl font-semibold mb-6">Offres récentes</h2>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.applicants} candidats</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status === 'active' ? 'Active' : 'Terminée'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
