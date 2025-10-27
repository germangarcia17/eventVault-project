import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { gsap } from 'gsap';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      '.success-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="success-card w-full max-w-md shadow-glow text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            ¡Reserva Confirmada!
          </CardTitle>
          <CardDescription className="text-base">
            Tu pago ha sido procesado exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Hemos enviado tu entrada y código QR a tu email. También puedes verlo en tu panel de
            reservas.
          </p>
          <div className="space-y-2">
            <Button variant="default" className="w-full" onClick={() => navigate('/dashboard')}>
              Ver Mis Reservas
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Explorar Más Eventos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
