import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { gsap } from 'gsap';

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      '.cancel-card',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }, []);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="cancel-card w-full max-w-md shadow-glow text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">Pago Cancelado</CardTitle>
          <CardDescription className="text-base">
            Tu reserva no se ha completado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            No se realizó ningún cargo. Puedes intentar reservar nuevamente cuando estés listo.
          </p>
          <div className="space-y-2">
            <Button variant="default" className="w-full" onClick={() => navigate(-1)}>
              Volver al Evento
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Ver Todos los Eventos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;
