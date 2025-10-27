# 🎫 EventHub - Configuración del Proyecto

Este documento contiene todas las instrucciones necesarias para configurar y ejecutar la plataforma de reservas de eventos.

---

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase (gratuita)
- Cuenta de Stripe (modo test gratuito)

---

## 🚀 Instalación Inicial

### 1. Clonar e Instalar Dependencias

```bash
# Clonar el repositorio
git clone <tu-repo-url>
cd eventhub

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

## 🗄️ Configuración de Supabase

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda tu **URL del proyecto** y **Anon Key** (los necesitarás para el `.env`)

### 2. Crear las Tablas de Base de Datos

Ve a **SQL Editor** en Supabase y ejecuta los siguientes scripts:

#### Tabla de Usuarios (Profiles)

```sql
-- Crear tabla de perfiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Políticas de seguridad
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Trigger para crear perfil automáticamente
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### Tabla de Eventos

```sql
-- Crear tipo de categoría
create type event_category as enum ('music', 'sports', 'arts', 'tech', 'food', 'workshop');

-- Crear tabla de eventos
create table public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category event_category not null,
  price decimal(10,2) not null,
  date timestamp with time zone not null,
  location text not null,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.events enable row level security;

-- Políticas de seguridad
create policy "Events are viewable by everyone"
  on events for select
  using ( true );

create policy "Authenticated users can insert events"
  on events for insert
  to authenticated
  with check ( true );

create policy "Authenticated users can update events"
  on events for update
  to authenticated
  using ( true );

create policy "Authenticated users can delete events"
  on events for delete
  to authenticated
  using ( true );
```

#### Tabla de Reservas

```sql
-- Crear tipo de estado de pago
create type payment_status as enum ('pending', 'paid', 'canceled');

-- Crear tabla de reservas
create table public.reservations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  event_id uuid references public.events(id) on delete cascade not null,
  payment_status payment_status default 'pending' not null,
  qr_code text not null unique,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.reservations enable row level security;

-- Políticas de seguridad
create policy "Users can view their own reservations"
  on reservations for select
  using ( auth.uid() = user_id );

create policy "Users can create their own reservations"
  on reservations for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reservations"
  on reservations for update
  using ( auth.uid() = user_id );
```

### 3. Insertar Eventos de Ejemplo

Ejecuta este script SQL para insertar 25 eventos de ejemplo:

```sql
INSERT INTO public.events (title, description, category, price, date, location, image_url) VALUES
  ('Summer Music Festival 2025', 'Join us for an unforgettable night of live music featuring top artists from around the world. Experience amazing performances across multiple stages with state-of-the-art sound systems.', 'music', 75.00, '2025-07-15 18:00:00+00', 'Central Park, New York', 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=600&fit=crop'),
  
  ('Tech Innovation Summit 2025', 'Discover the latest in technology and innovation. Network with industry leaders, attend keynote speeches from tech giants, and explore cutting-edge solutions that will shape the future.', 'tech', 120.00, '2025-08-22 09:00:00+00', 'Convention Center, San Francisco', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'),
  
  ('Food & Wine Gala', 'An exquisite evening celebrating culinary excellence. Taste dishes from renowned chefs and sample premium wines from around the world in an elegant setting.', 'food', 95.00, '2025-09-10 19:00:00+00', 'Grand Hotel, Chicago', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'),
  
  ('Championship Finals', 'Witness history as the best teams compete for the championship title in this epic showdown. Don''t miss the most anticipated sporting event of the year!', 'sports', 150.00, '2025-06-30 20:00:00+00', 'Stadium Arena, Los Angeles', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'),
  
  ('Modern Art Exhibition', 'Explore contemporary masterpieces from emerging and established artists. A journey through modern creativity featuring installations, paintings, and sculptures.', 'arts', 25.00, '2025-07-05 10:00:00+00', 'Metropolitan Museum, New York', 'https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?w=800&h=600&fit=crop'),
  
  ('Digital Marketing Workshop', 'Learn proven strategies to grow your business online in this hands-on workshop with industry experts. Perfect for entrepreneurs and marketing professionals.', 'workshop', 45.00, '2025-08-15 14:00:00+00', 'Business Hub, Boston', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop'),
  
  ('Jazz Night Under the Stars', 'Enjoy smooth jazz melodies in an intimate outdoor setting. Perfect evening for music lovers with world-class musicians performing classic and contemporary jazz.', 'music', 50.00, '2025-07-20 20:30:00+00', 'Rooftop Terrace, Miami', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop'),
  
  ('Marathon City Run', 'Challenge yourself in our annual city marathon. All fitness levels welcome! Choose from 5K, 10K, half marathon, or full marathon distances.', 'sports', 30.00, '2025-09-05 07:00:00+00', 'Downtown, Seattle', 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&h=600&fit=crop'),
  
  ('Electronic Music Festival', 'Dance the night away with top DJs and electronic music producers. Multiple stages, incredible light shows, and non-stop beats until sunrise.', 'music', 85.00, '2025-08-08 21:00:00+00', 'Waterfront Park, Miami', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'),
  
  ('Startup Pitch Competition', 'Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and learn about the latest business trends in technology.', 'tech', 35.00, '2025-07-25 16:00:00+00', 'Innovation Center, Austin', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=600&fit=crop'),
  
  ('International Food Festival', 'Taste cuisines from around the world in one amazing event. Over 50 food vendors, cooking demonstrations, and live entertainment.', 'food', 40.00, '2025-08-18 12:00:00+00', 'City Square, Portland', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop'),
  
  ('Basketball Championship Game', 'The season finale featuring the two best teams battling for glory. Premium seats available for this must-see sporting event.', 'sports', 125.00, '2025-09-20 19:00:00+00', 'Arena Center, Chicago', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop'),
  
  ('Contemporary Dance Performance', 'Experience groundbreaking choreography from an internationally acclaimed dance company. A mesmerizing blend of classical and modern dance.', 'arts', 55.00, '2025-07-12 20:00:00+00', 'Performing Arts Theater, Boston', 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800&h=600&fit=crop'),
  
  ('Photography Masterclass', 'Learn from professional photographers in this intensive full-day workshop. Covers composition, lighting, editing, and building your portfolio.', 'workshop', 80.00, '2025-08-28 09:00:00+00', 'Studio Space, Los Angeles', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop'),
  
  ('Rock Concert Series', 'Classic rock meets modern alternative in this explosive concert event. Three bands, one unforgettable night of live music.', 'music', 65.00, '2025-09-15 19:00:00+00', 'Amphitheater, Denver', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'),
  
  ('AI & Machine Learning Conference', 'Dive deep into artificial intelligence and machine learning with leading researchers and practitioners. Hands-on sessions and networking opportunities.', 'tech', 150.00, '2025-09-08 08:30:00+00', 'Tech Campus, San Jose', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop'),
  
  ('Wine Tasting Evening', 'Sample exquisite wines from premier vineyards around the world. Expert sommeliers will guide you through each tasting with detailed explanations.', 'food', 70.00, '2025-07-30 18:30:00+00', 'Wine Bar, Napa Valley', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop'),
  
  ('Tennis Tournament Finals', 'Watch world-class tennis players compete in the championship finals. Courtside seats available for this prestigious sporting event.', 'sports', 95.00, '2025-08-25 14:00:00+00', 'Tennis Center, New York', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=600&fit=crop'),
  
  ('Street Art Gallery Opening', 'Celebrate urban art culture with works from renowned street artists. Opening night includes artist meet-and-greets and live painting demonstrations.', 'arts', 20.00, '2025-07-18 18:00:00+00', 'Urban Gallery, Brooklyn', 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=600&fit=crop'),
  
  ('Public Speaking Workshop', 'Master the art of public speaking and presentation skills. Overcome stage fright and learn techniques used by professional speakers.', 'workshop', 60.00, '2025-09-12 10:00:00+00', 'Conference Room, Seattle', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop'),
  
  ('Latin Music Night', 'Experience the rhythm and passion of Latin music with live bands playing salsa, bachata, and reggaeton. Dance lessons included!', 'music', 45.00, '2025-08-05 20:00:00+00', 'Club Tropicana, Miami', 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=600&fit=crop'),
  
  ('Blockchain & Web3 Summit', 'Explore the future of decentralized technology. Learn about blockchain, cryptocurrencies, NFTs, and the evolving web3 ecosystem.', 'tech', 110.00, '2025-07-22 09:00:00+00', 'Innovation Hub, San Francisco', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop'),
  
  ('Craft Beer Festival', 'Sample over 100 craft beers from local and international breweries. Food trucks, live music, and brewery tours included.', 'food', 50.00, '2025-09-18 15:00:00+00', 'Brewery District, Portland', 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800&h=600&fit=crop'),
  
  ('Soccer Championship Match', 'The ultimate showdown for the championship title. Experience the energy and excitement of professional soccer at its finest.', 'sports', 110.00, '2025-07-28 17:00:00+00', 'Soccer Stadium, Atlanta', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop'),
  
  ('Theater Production: Classic Drama', 'A powerful performance of a timeless dramatic masterpiece. Award-winning cast and stunning stage production.', 'arts', 65.00, '2025-08-12 19:30:00+00', 'Grand Theater, Chicago', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=600&fit=crop');
```

### 4. Configurar Autenticación en Supabase

1. Ve a **Authentication** > **Settings**
2. En **Site URL**, configura: `http://localhost:8080` (desarrollo) o tu dominio de producción
3. En **Redirect URLs**, agrega:
   - `http://localhost:8080/`
   - Tu URL de producción si la tienes

4. **Opcional pero recomendado para testing**: Desactiva "Confirm email" en **Authentication** > **Settings** > **Email Auth**

---

## 💳 Configuración de Stripe

### 1. Crear Cuenta y Obtener Claves

1. Regístrate en [stripe.com](https://stripe.com)
2. Ve a **Developers** > **API keys**
3. Copia tu **Publishable key** y **Secret key** (modo test)

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase

# Stripe (modo test)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_publishable_key
STRIPE_SECRET_KEY=sk_test_tu_secret_key
```

⚠️ **Importante**: Nunca subas el archivo `.env` a git. Ya está incluido en `.gitignore`.

---

## 🎯 Características Implementadas

### Frontend
- ✅ Sistema de autenticación (login/registro)
- ✅ Listado de eventos con búsqueda y filtros
- ✅ Página de detalle de evento
- ✅ Panel de usuario con reservas
- ✅ Generación de códigos QR
- ✅ Panel de administración
- ✅ Animaciones con GSAP
- ✅ Diseño responsive y accesible

### Backend (Listo para conectar)
- ✅ Estructura de base de datos
- ✅ Autenticación con Supabase
- ✅ RLS policies configuradas
- ✅ Preparado para Stripe Checkout

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

---

## 📱 Uso de la Aplicación

### Como Usuario

1. **Explorar eventos**: Navega por la página principal y usa filtros
2. **Registrarse**: Crea una cuenta en `/auth`
3. **Reservar**: Selecciona un evento y haz clic en "Reservar entrada"
4. **Ver reservas**: Accede a tu dashboard en `/dashboard`
5. **Descargar QR**: Descarga el código QR de tus reservas

### Como Administrador

1. Accede a `/admin`
2. Crea, edita o elimina eventos
3. Los cambios se reflejan inmediatamente en la aplicación

---

## 🚀 Despliegue a Producción

### Vercel / Netlify

1. Conecta tu repositorio
2. Configura las variables de entorno
3. Deploy automático

### Variables de entorno en producción:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_tu_publishable_key_de_produccion
```

⚠️ **Importante**: En producción, usa las claves LIVE de Stripe, no las de test.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Animaciones**: GSAP
- **Autenticación**: Supabase Auth
- **Base de datos**: PostgreSQL (via Supabase)
- **Pagos**: Stripe Checkout
- **QR Codes**: qrcode.react
- **Routing**: React Router v6
- **Estado**: React Query
- **UI Components**: shadcn/ui + Radix UI

---

## 📝 Notas Adicionales

- Este es un proyecto de portfolio
- Los eventos de ejemplo son ficticios
- El sistema de pagos está en modo test
- Para producción, configura webhooks de Stripe
- Considera agregar email notifications con Supabase

---

## 🐛 Solución de Problemas

### Error: "Invalid Supabase URL"
- Verifica que `.env` esté configurado correctamente
- Reinicia el servidor de desarrollo

### Error: "Authentication failed"
- Verifica las URLs de redirección en Supabase
- Asegúrate de que el email esté confirmado (o desactiva la confirmación)

### Estilos no se aplican
- Ejecuta `npm install` de nuevo
- Limpia el caché: `npm run build`

---

## 📧 Soporte

Para problemas o preguntas:
- Revisa la documentación de [Supabase](https://supabase.com/docs)
- Consulta los docs de [Stripe](https://stripe.com/docs)
- Verifica la consola del navegador para errores

---

**¡Proyecto creado con ❤️ como portfolio project!**
