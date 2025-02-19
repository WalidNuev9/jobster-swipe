
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface CVAnalysis {
  formation?: string[];
  experience_professionnelle?: string[];
  competences_techniques?: string[];
  langues?: string[];
}

const CVManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysis | null>(null);
  const { toast } = useToast();

  const analyzeCV = async (fileUrl: string) => {
    setIsAnalyzing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Non authentifié");

      const { data, error } = await supabase.functions.invoke('analyze-cv', {
        body: { fileUrl }
      });

      if (error) throw error;

      const parsedAnalysis = JSON.parse(data.analysis);
      setAnalysisResult(parsedAnalysis);

      toast({
        title: "Analyse terminée",
        description: "Votre CV a été analysé avec succès"
      });

      return parsedAnalysis;
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast({
        variant: "destructive",
        title: "Erreur lors de l'analyse",
        description: "Une erreur est survenue lors de l'analyse de votre CV"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Type de fichier non valide",
        description: "Veuillez sélectionner un fichier PDF"
      });
      return;
    }

    setIsUploading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Non authentifié");

      const userId = user.data.user.id;
      const filePath = `${userId}/${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("cvs")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from("cvs")
        .insert({
          user_id: userId,
          file_url: publicUrl,
          title: file.name,
        });

      if (dbError) throw dbError;

      toast({
        title: "CV téléchargé avec succès",
        description: "Analyse du CV en cours..."
      });

      await analyzeCV(publicUrl);

    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors du téléchargement de votre CV"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const renderAnalysisSection = (title: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-1">
          {items.map((item, index) => (
            <li key={index} className="text-gray-600">{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gérer mon CV</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Télécharger votre CV</h2>
            <p className="text-gray-600 mb-4">
              Téléchargez votre CV au format PDF pour le partager avec les recruteurs
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              disabled={isUploading || isAnalyzing}
              onClick={() => document.getElementById("cv-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Téléchargement..." : 
               isAnalyzing ? "Analyse en cours..." : 
               "Sélectionner un fichier"}
            </Button>
            <input
              id="cv-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </Card>

      {analysisResult && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">Analyse du CV</h2>
            
            {renderAnalysisSection("Formation", analysisResult.formation)}
            {renderAnalysisSection("Expérience Professionnelle", analysisResult.experience_professionnelle)}
            {renderAnalysisSection("Compétences Techniques", analysisResult.competences_techniques)}
            {renderAnalysisSection("Langues", analysisResult.langues)}
          </CardContent>
        </Card>
      )}

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">CVs téléchargés</h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center py-4">
            La liste de vos CVs téléchargés apparaîtra ici
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CVManager;
