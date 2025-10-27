import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/types';
import { toast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

const Admin = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('music');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    gsap.fromTo(
      '.admin-content',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('music');
    setPrice('');
    setDate('');
    setLocation('');
    setImageUrl('');
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title,
      description,
      category: category as Event['category'],
      price: parseFloat(price),
      date,
      location,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      created_at: editingEvent?.created_at || new Date().toISOString(),
    };

    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? eventData : e)));
      toast({ title: 'Evento actualizado', description: 'El evento se actualizó correctamente' });
    } else {
      setEvents([eventData, ...events]);
      toast({ title: 'Evento creado', description: 'El evento se creó correctamente' });
    }

    resetForm();
  };

  const handleEdit = (event: Event) => {
    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setPrice(event.price.toString());
    setDate(event.date);
    setLocation(event.location);
    setImageUrl(event.image_url);
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: 'Evento eliminado', description: 'El evento se eliminó correctamente' });
  };

  return (
    <div className="admin-content space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona los eventos de la plataforma</p>
        </div>
        {!showForm && (
          <Button variant="default" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Nuevo Evento
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="shadow-glow">
          <CardHeader>
            <CardTitle>{editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}</CardTitle>
            <CardDescription>
              Completa los detalles del evento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Música</SelectItem>
                      <SelectItem value="sports">Deportes</SelectItem>
                      <SelectItem value="arts">Arte</SelectItem>
                      <SelectItem value="tech">Tecnología</SelectItem>
                      <SelectItem value="food">Gastronomía</SelectItem>
                      <SelectItem value="workshop">Talleres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha y Hora</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de Imagen</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="default">
                  {editingEvent ? 'Actualizar' : 'Crear'} Evento
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Todos los Eventos</h2>
        <div className="grid gap-4">
          {events.map((event) => (
            <Card key={event.id} className="shadow-card">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.location} • ${event.price}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
