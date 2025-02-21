
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
}

interface JobOffersListProps {
  jobOffers: JobOffer[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const JobOffersList = ({ jobOffers, isLoading, onDelete }: JobOffersListProps) => {
  const navigate = useNavigate();

  return (
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
                  onClick={() => onDelete(job.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default JobOffersList;
