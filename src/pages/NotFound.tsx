import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    gsap.fromTo(
      '.error-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="error-card w-full max-w-md shadow-glow text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-6xl font-bold text-foreground mb-2">404</CardTitle>
          <CardDescription className="text-base">
            Lo sentimos, esta página no existe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            La página que buscas no se encuentra disponible o ha sido movida.
          </p>
          <Button variant="default" className="w-full" onClick={() => navigate('/')}>
            <Home className="h-4 w-4" />
            Volver al Inicio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
