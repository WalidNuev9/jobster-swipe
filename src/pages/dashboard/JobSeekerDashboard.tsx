
import { Card } from "@/components/ui/card";
import { ArrowUpFromLine, Clock, CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const JobSeekerDashboard = () => {
  // Données de test
  const stats = {
    totalApplications: 24,
    pendingApplications: 8,
    acceptedApplications: 12,
    rejectedApplications: 4
  };

  const recentApplications = [
    {
      id: "1",
      jobTitle: "Développeur Frontend React",
      company: "Tech Solutions",
      status: "pending",
      date: "2024-02-15"
    },
    {
      id: "2",
      jobTitle: "Développeur Full Stack",
      company: "Digital Agency",
      status: "accepted",
      date: "2024-02-14"
    },
    {
      id: "3",
      jobTitle: "Ingénieur DevOps",
      company: "Cloud Solutions",
      status: "rejected",
      date: "2024-02-13"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <ArrowUpFromLine className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{stats.totalApplications}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total des candidatures</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Clock className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.pendingApplications}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">En attente</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
              <span className="text-2xl font-bold">{stats.acceptedApplications}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Acceptées</h3>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="h-8 w-8 text-danger" />
              <span className="text-2xl font-bold">{stats.rejectedApplications}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600">Refusées</h3>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Progression des candidatures</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tech Solutions</span>
                  <span className="text-sm font-medium">3 étapes sur 5</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Digital Agency</span>
                  <span className="text-sm font-medium">2 étapes sur 4</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Cloud Solutions</span>
                  <span className="text-sm font-medium">4 étapes sur 5</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Candidatures récentes</h2>
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-800">{application.jobTitle}</h3>
                    <p className="text-sm text-gray-600">{application.company}</p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {application.status === 'pending' ? 'En attente' :
                       application.status === 'accepted' ? 'Acceptée' : 'Refusée'}
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

export default JobSeekerDashboard;
