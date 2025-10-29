# Google Analytics 4 - Event Vault

## Configuración

### 1. Variables de Entorno

Añade tu ID de medición de Google Analytics 4 en tu archivo `.env`:

```env
VITE_GA_ID=G-XXXXXXXXXX
```

### 2. Implementación

La implementación de Google Analytics está completamente integrada en la aplicación sin afectar su funcionamiento actual.

#### Archivos Principales

- **`src/lib/analytics.js`**: Módulo principal con todas las funciones de tracking
- **`src/App.jsx`**: Inicialización y tracking automático de page views

## Eventos Trackeados

### 🔐 Autenticación
- **Login**: Cuando un usuario inicia sesión
- **Signup**: Cuando un usuario crea una cuenta
- **Logout**: Cuando un usuario cierra sesión

### 📅 Eventos
- **View Event List**: Cuando un usuario visita la página de eventos
- **View Event Detail**: Cuando un usuario ve los detalles de un evento
- **Search**: Cuando un usuario busca eventos
- **Filter**: Cuando un usuario filtra eventos por categoría

### 🎫 Reservas y Pagos
- **Booking Initiated**: Cuando un usuario inicia una reserva
- **Payment Initiated**: Cuando se inicia un proceso de pago
- **Payment Success**: Cuando un pago se completa exitosamente
- **Payment Failed**: Cuando un pago falla
- **Booking Completed**: Cuando una reserva se completa
- **Booking Cancelled**: Cuando una reserva es cancelada

### 🧭 Navegación
- **Navigation**: Clicks en enlaces del menú principal
- **CTA Click**: Clicks en botones de llamada a la acción (CTAs)

### 👨‍💼 Admin
- **Admin Access**: Cuando un administrador accede al panel
- **Event Created**: Cuando se crea un evento
- **Event Edited**: Cuando se edita un evento
- **Event Deleted**: Cuando se elimina un evento

### 📊 Dashboard
- **Dashboard View**: Cuando un usuario accede a su dashboard
- **Tab Change**: Cuando cambia entre tabs (reservas/pagos)

## Uso de Analytics en el Código

### Tracking Básico

```javascript
import { analytics } from '@/lib/analytics';

// Track un evento simple
analytics.trackEventView(eventId, eventName);

// Track navegación
analytics.trackNavigation('Dashboard');

// Track CTA clicks
analytics.trackCTAClick('Reservar Ahora', 'Event Detail Page');
```

### Eventos Personalizados

```javascript
import { trackEvent } from '@/lib/analytics';

trackEvent(
  'Category',      // Categoría del evento
  'Action',        // Acción realizada
  'Label',         // Etiqueta descriptiva
  value            // Valor numérico (opcional)
);
```

## Páginas con Analytics Implementado

### ✅ Componentes y Páginas

1. **Home.jsx**
   - Hero Section CTAs
   - Events Section CTAs
   - Urgent Event CTA
   - Final CTA Section

2. **Events.jsx**
   - Page view tracking
   - Search tracking
   - Category filter tracking

3. **EventDetail.jsx**
   - Event view tracking
   - Booking initiation
   - CTA clicks

4. **Dashboard.jsx**
   - Dashboard views
   - Tab changes

5. **Payment.jsx**
   - Payment initiation
   - Payment success/failure
   - Booking completion

6. **Layout.jsx**
   - Navigation tracking
   - Admin access tracking

7. **useAuth.jsx** (Hook)
   - Login tracking
   - Signup tracking
   - Logout tracking

## Datos en Google Analytics

### Dimensiones Personalizadas Recomendadas

Para obtener insights más profundos, configura estas dimensiones personalizadas en GA4:

1. **Event Name** - Nombre del evento
2. **Event Category** - Categoría del evento
3. **User Type** - Admin/Regular User
4. **CTA Location** - Ubicación del CTA en la página

### Métricas Clave a Monitorear

- **Conversion Rate**: % de usuarios que completan reservas
- **Booking Funnel**: Desde view → initiate → complete
- **Payment Success Rate**: % de pagos exitosos
- **Popular Events**: Eventos más vistos
- **Search Queries**: Términos de búsqueda más comunes
- **CTA Performance**: CTAs con mejor rendimiento

## Privacidad

La implementación incluye:
- ✅ `anonymizeIp: true` - IPs anonimizadas
- ✅ Sin tracking de información personal sensible
- ✅ Cumple con GDPR básico

## Testing

Para verificar que los eventos se están enviando correctamente:

1. Abre Chrome DevTools
2. Ve a la pestaña "Network"
3. Filtra por "google-analytics" o "collect"
4. Realiza acciones en la app
5. Verifica que se envíen requests a GA4

También puedes usar:
- **GA Debugger** (extensión de Chrome)
- **Google Analytics Debug Mode** en GA4

## Desactivar en Desarrollo

Para desactivar el tracking en desarrollo, simplemente no configures la variable `VITE_GA_ID` o déjala vacía.

El sistema automáticamente verificará si existe antes de enviar eventos.

## Notas Adicionales

- Los eventos se envían solo si `VITE_GA_ID` está configurado
- No afecta el rendimiento de la aplicación
- Todos los eventos son no-bloqueantes
- Compatible con Single Page Application (SPA)
