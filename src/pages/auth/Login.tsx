
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Gestion des différents types d'erreurs
        if (error.message.includes("Invalid login credentials")) {
          toast({
            variant: "destructive",
            title: "Erreur de connexion",
            description: "Email ou mot de passe incorrect",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email non confirmé",
            description: "Veuillez vérifier votre boîte mail et confirmer votre email",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la connexion",
          });
        }
        return;
      }

      if (data.user) {
        // Récupérer le rôle de l'utilisateur
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleError) {
          console.error('Erreur lors de la récupération du rôle:', roleError);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de récupérer votre rôle",
          });
          return;
        }

        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre tableau de bord",
        });

        // Rediriger vers le tableau de bord approprié
        if (roleData?.role) {
          navigate(`/dashboard/${roleData.role}`);
        } else {
          navigate('/'); // Redirection par défaut si aucun rôle n'est trouvé
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-gray-600">
            Bienvenue sur Jobster. Veuillez vous connecter pour continuer.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                disabled={isLoading}
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                disabled={isLoading}
                placeholder="Votre mot de passe"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
