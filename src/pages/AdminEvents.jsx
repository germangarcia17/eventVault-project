import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import styles from './Admin.module.css';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const formRef = useRef(null);
  const eventRefs = useRef({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('music');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({ 
        title: 'Error', 
        description: 'No se pudieron cargar los eventos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eventData = {
      title,
      description,
      category,
      price: parseFloat(price),
      date,
      location,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    };

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast({ title: 'Evento actualizado', description: 'El evento se actualizó correctamente' });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);

        if (error) throw error;
        toast({ title: 'Evento creado', description: 'El evento se creó correctamente' });
      }

      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      toast({ 
        title: 'Error', 
        description: 'No se pudo guardar el evento',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (event, eventId) => {
    // Si ya estamos editando este evento, cerrar el formulario
    if (editingEvent && editingEvent.id === event.id) {
      resetForm();
      return;
    }

    setTitle(event.title);
    setDescription(event.description);
    setCategory(event.category);
    setPrice(event.price.toString());
    setDate(event.date);
    setLocation(event.location);
    setImageUrl(event.image_url);
    setEditingEvent(event);
    setShowForm(false); // No mostrar el formulario global

    setTimeout(() => {
      const eventElement = eventRefs.current[eventId];
      if (eventElement) {
        const offset = 100;
        const elementPosition = eventElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Evento eliminado', description: 'El evento se eliminó correctamente' });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({ 
        title: 'Error', 
        description: 'No se pudo eliminar el evento',
        variant: 'destructive'
      });
    }
  };

  // Filtrar eventos por búsqueda
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.subHeader}>
        <div className={styles.searchContainer}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search events by name, description or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button 
              className={styles.clearSearch}
              onClick={() => setSearchQuery('')}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
        <button 
          className={styles.newButton}
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {searchQuery && (
        <div className={styles.searchResults}>
          {filteredEvents.length} {filteredEvents.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </div>
      )}

      {showForm && (
        <div className={styles.formContainer} ref={formRef}>
          <h3>Create new event</h3>
          <form onSubmit={handleSubmit} className={styles.eventForm}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>Título</label>
              <input
                id="title"
                type="text"
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Nombre del evento"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>Descripción</label>
              <textarea
                id="description"
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows="4"
                placeholder="Descripción del evento"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Categoría</label>
                <select
                  id="category"
                  className={styles.select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="music">Música</option>
                  <option value="sports">Deportes</option>
                  <option value="art">Arte</option>
                  <option value="tech">Tecnología</option>
                  <option value="food">Gastronomía</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>Price ($)</label>
                <input
                  id="price"
                  type="number"
                  className={styles.input}
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date" className={styles.label}>Date and Time</label>
                <input
                  id="date"
                  type="datetime-local"
                  className={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>Location</label>
                <input
                  id="location"
                  type="text"
                  className={styles.input}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Lugar del evento"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="imageUrl" className={styles.label}>URL de la Imagen</label>
              <input
                id="imageUrl"
                type="url"
                className={styles.input}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Crear Evento
              </button>
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Cargando eventos...</div>
      ) : events.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay eventos creados</p>
          <p className={styles.emptySubtext}>Comienza creando tu primer evento</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No se encontraron eventos</p>
          <p className={styles.emptySubtext}>Intenta con otra búsqueda</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {filteredEvents.map((event) => (
            <div key={event.id} className={styles.eventWrapper}>
              <div 
                className={styles.eventCard}
                ref={(el) => eventRefs.current[event.id] = el}
              >
                <div className={styles.eventImage}>
                  <img src={event.image_url} alt={event.title} />
                  <span className={styles.categoryBadge}>{event.category}</span>
                </div>
                <div className={styles.eventContent}>
                  <h3>{event.title}</h3>
                  <p className={styles.eventDescription}>{event.description}</p>
                  <div className={styles.eventDetails}>
                    <div className={styles.eventDetail}>
                      <span className={styles.detailLabel}>Date:</span>
                      <span>{new Date(event.date).toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.detailLabel}>Location:</span>
                      <span>{event.location}</span>
                    </div>
                    <div className={styles.eventDetail}>
                      <span className={styles.detailLabel}>Price:</span>
                      <span className={styles.eventPrice}>{event.price}€</span>
                    </div>
                  </div>
                  <div className={styles.eventActions}>
                    <button
                      onClick={() => handleEdit(event, event.id)}
                      className={styles.editButton}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className={styles.deleteButton}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Formulario de edición debajo del evento */}
              {editingEvent && editingEvent.id === event.id && (
                <div className={styles.inlineFormContainer} ref={formRef}>
                  <h3>Editar Evento</h3>
                  <form onSubmit={handleSubmit} className={styles.eventForm}>
                    <div className={styles.formGroup}>
                      <label htmlFor={`title-${event.id}`} className={styles.label}>Título</label>
                      <input
                        id={`title-${event.id}`}
                        type="text"
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Nombre del evento"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor={`description-${event.id}`} className={styles.label}>Descripción</label>
                      <textarea
                        id={`description-${event.id}`}
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows="4"
                        placeholder="Descripción del evento"
                      />
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`category-${event.id}`} className={styles.label}>Categoría</label>
                        <select
                          id={`category-${event.id}`}
                          className={styles.select}
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                        >
                          <option value="music">Música</option>
                          <option value="sports">Deportes</option>
                          <option value="art">Arte</option>
                          <option value="tech">Tecnología</option>
                          <option value="food">Gastronomía</option>
                          <option value="other">Otro</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`price-${event.id}`} className={styles.label}>Price ($)</label>
                        <input
                          id={`price-${event.id}`}
                          type="number"
                          className={styles.input}
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`date-${event.id}`} className={styles.label}>Date and Time</label>
                        <input
                          id={`date-${event.id}`}
                          type="datetime-local"
                          className={styles.input}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`location-${event.id}`} className={styles.label}>Location</label>
                        <input
                          id={`location-${event.id}`}
                          type="text"
                          className={styles.input}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          placeholder="Lugar del evento"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor={`imageUrl-${event.id}`} className={styles.label}>URL de la Imagen</label>
                      <input
                        id={`imageUrl-${event.id}`}
                        type="url"
                        className={styles.input}
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button type="submit" className={styles.submitButton}>
                        Actualizar Evento
                      </button>
                      <button 
                        type="button" 
                        onClick={resetForm}
                        className={styles.cancelButton}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEvents;