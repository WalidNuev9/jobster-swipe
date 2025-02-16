
import { useState } from 'react';
import JobCard from '@/components/JobCard';
import { toast } from '@/hooks/use-toast';

// Données de test
const jobs = [
  {
    id: '1',
    title: 'Développeur Frontend React',
    company: 'Tech Solutions',
    location: 'Paris, France',
    salary: '45-60k€/an',
    description: 'Nous recherchons un développeur Frontend React passionné pour rejoindre notre équipe et participer au développement de nos applications web innovantes.',
    skills: ['React', 'TypeScript', 'CSS', 'Git']
  },
  {
    id: '2',
    title: 'Développeur Full Stack',
    company: 'Digital Agency',
    location: 'Lyon, France',
    salary: '50-65k€/an',
    description: 'Rejoignez notre équipe en tant que développeur Full Stack et participez à des projets variés et stimulants.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    id: '3',
    title: 'Ingénieur DevOps',
    company: 'Cloud Solutions',
    location: 'Bordeaux, France',
    salary: '55-70k€/an',
    description: 'Nous recherchons un ingénieur DevOps expérimenté pour gérer notre infrastructure cloud et améliorer nos processus de déploiement.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
  }
];

const Index = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      toast({
        title: "Candidature envoyée !",
        description: "Votre candidature a été envoyée avec succès.",
        className: "bg-success text-success-foreground"
      });
    }

    setCurrentJobIndex((prev) => Math.min(prev + 1, jobs.length - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-white shadow-sm py-4 mb-8">
        <div className="container">
          <h1 className="text-3xl font-bold text-gray-800">Jobster</h1>
        </div>
      </header>

      <main className="container flex-1 flex flex-col items-center justify-center px-4 mb-8">
        {currentJobIndex < jobs.length ? (
          <JobCard 
            key={jobs[currentJobIndex].id}
            job={jobs[currentJobIndex]}
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Plus d'offres disponibles</h2>
            <p className="text-gray-600">Revenez plus tard pour découvrir de nouvelles opportunités</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
