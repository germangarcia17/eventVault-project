import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import { toast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import styles from './Admin.module.css';

const Admin = () => {
  const [events, setEvents] = useState(mockEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('music');
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      id: editingEvent?.id || Date.now().toString(),
      title,
      description,
      category: category,
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

  const handleEdit = (event) => {
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

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({ title: 'Evento eliminado', description: 'El evento se eliminó correctamente' });
  };

  return (
    <div className={`${styles.container} admin-content`}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Panel de Administración</h1>
          <p>Gestiona los eventos de la plataforma</p>
        </div>
        {!showForm && (
          <button className={styles.newButton} onClick={() => setShowForm(true)}>
            <Plus />
            Nuevo Evento
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>
              {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
            </h2>
            <p className={styles.formDescription}>
              Completa los detalles del evento
            </p>
          </div>
          <div className={styles.formContent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.gridRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Título</label>
                  <input
                    id="title"
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>Categoría</label>
                  <select
                    id="category"
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="music">Música</option>
                    <option value="sports">Deportes</option>
                    <option value="arts">Arte</option>
                    <option value="tech">Tecnología</option>
                    <option value="food">Gastronomía</option>
                    <option value="workshop">Talleres</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.label}>Descripción</label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.gridRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="price" className={styles.label}>Precio ($)</label>
                  <input
                    id="price"
                    className={styles.input}
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="date" className={styles.label}>Fecha y Hora</label>
                  <input
                    id="date"
                    className={styles.input}
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>Ubicación</label>
                <input
                  id="location"
                  className={styles.input}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imageUrl" className={styles.label}>URL de Imagen</label>
                <input
                  id="imageUrl"
                  className={styles.input}
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  {editingEvent ? 'Actualizar' : 'Crear'} Evento
                </button>
                <button type="button" className={styles.cancelButton} onClick={resetForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.eventsSection}>
        <h2 className={styles.eventsTitle}>Todos los Eventos</h2>
        <div className={styles.eventsList}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventInfo}>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventMeta}>
                  {event.location} • ${event.price}
                </p>
              </div>
              <div className={styles.eventActions}>
                <button className={styles.editButton} onClick={() => handleEdit(event)}>
                  <Edit />
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(event.id)}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
