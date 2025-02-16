
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FilePdf, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const CVManager = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier que c'est bien un PDF
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

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from("cvs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Récupérer l'URL du fichier
      const { data: { publicUrl } } = supabase.storage
        .from("cvs")
        .getPublicUrl(filePath);

      // Enregistrer les informations dans la base de données
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
        description: "Votre CV a été enregistré"
      });
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
            <FilePdf className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Télécharger votre CV</h2>
            <p className="text-gray-600 mb-4">
              Téléchargez votre CV au format PDF pour le partager avec les recruteurs
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              disabled={isUploading}
              onClick={() => document.getElementById("cv-upload")?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Téléchargement..." : "Sélectionner un fichier"}
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

      <Card className="mt-8 p-6">
        <h2 className="text-xl font-semibold mb-4">CVs téléchargés</h2>
        <div className="space-y-4">
          {/* Cette section sera implémentée pour afficher les CVs existants */}
          <p className="text-gray-600 text-center py-4">
            La liste de vos CVs téléchargés apparaîtra ici
          </p>
        </div>
      </Card>
    </div>
  );
};

export default CVManager;
