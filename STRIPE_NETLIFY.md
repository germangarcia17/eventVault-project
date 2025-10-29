# 💳 Configuración de Stripe en Netlify

Esta guía te ayudará a configurar la pasarela de pago con Stripe en tu aplicación desplegada en Netlify.

## 📋 Requisitos Previos

- Cuenta de Netlify activa
- Cuenta de Stripe (modo test)
- Aplicación ya desplegada en Netlify

---

## 🔧 Paso 1: Configurar Variables de Entorno en Netlify

1. Ve a tu dashboard de Netlify
2. Selecciona tu sitio
3. Ve a **Site settings** > **Environment variables**
4. Agrega las siguientes variables:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJh...
VITE_SUPABASE_ADMIN_EMAIL=tu_email_admin@example.com
VITE_GA_ID=G-XXXXXXXXXX (opcional)
```

⚠️ **Importante**: 
- El `STRIPE_SECRET_KEY` NO debe tener el prefijo `VITE_` (es solo para el backend)
- El `VITE_STRIPE_PUBLISHABLE_KEY` SÍ debe tener el prefijo `VITE_` (es para el frontend)

---

## 🚀 Paso 2: Redesplegar la Aplicación

Después de configurar las variables de entorno:

1. Ve a **Deploys** en tu dashboard de Netlify
2. Haz clic en **Trigger deploy** > **Deploy site**
3. Espera a que el deploy termine

---

## 🧪 Paso 3: Probar los Pagos

### Tarjetas de Prueba de Stripe

**✅ Pago Exitoso:**
```
Número:  4242 4242 4242 4242
Fecha:   12/25 (cualquier fecha futura)
CVC:     123 (cualquier 3 dígitos)
ZIP:     12345 (cualquier código)
```

**❌ Tarjeta Rechazada (fondos insuficientes):**
```
4000 0000 0000 9995
```

**❌ Tarjeta Rechazada (genérica):**
```
4000 0000 0000 0002
```

**🔐 Requiere Autenticación 3D Secure:**
```
4000 0025 0000 3155
```

---

## 📊 Manejo de Errores Implementado

La aplicación maneja los siguientes tipos de errores:

### Errores de Tarjeta
- ✅ `card_declined` - Tarjeta rechazada
- ✅ `insufficient_funds` - Fondos insuficientes
- ✅ `expired_card` - Tarjeta expirada
- ✅ `incorrect_cvc` - CVC incorrecto
- ✅ `incorrect_number` - Número de tarjeta incorrecto
- ✅ `processing_error` - Error al procesar

### Errores del Sistema
- ✅ Error al crear Payment Intent
- ✅ Error de conexión con Stripe
- ✅ Error al actualizar la base de datos

---

## 🔍 Verificar que Todo Funciona

### 1. Verificar Funciones Netlify

Ve a **Functions** en tu dashboard de Netlify. Deberías ver:
- `create-payment-intent`
- `confirm-payment`

### 2. Probar el Flujo Completo

1. Inicia sesión en tu aplicación
2. Selecciona un evento
3. Haz clic en "Reservar entrada"
4. Completa el formulario de pago con una tarjeta de prueba
5. Verifica que:
   - El pago se procesa correctamente
   - Recibes confirmación
   - La reserva aparece en tu dashboard
   - El QR code se genera

### 3. Ver Logs en Netlify

Si algo falla:
1. Ve a **Functions** > Selecciona la función
2. Ve a **Function log** para ver errores

---

## 🔐 Seguridad

✅ **Implementado:**
- Secret key solo en el backend (funciones de Netlify)
- CORS configurado correctamente
- Validación de datos en el servidor
- Payment Intents para pagos seguros

❌ **NO implementado (recomendado para producción):**
- Webhooks de Stripe para confirmación
- Emails de confirmación
- Rate limiting
- Auditoría de transacciones

---

## 🐛 Solución de Problemas

### Error: "Error creating payment intent"
- Verifica que `STRIPE_SECRET_KEY` esté configurada correctamente
- Asegúrate de que NO tenga el prefijo `VITE_`
- Verifica que la clave sea de test (`sk_test_...`)

### Error: "Cannot read client_secret"
- Verifica que las funciones de Netlify estén desplegadas
- Revisa los logs de la función `create-payment-intent`

### Los pagos no se reflejan en Supabase
- Verifica las credenciales de Supabase
- Revisa los permisos de RLS en Supabase

### Error 404 en funciones
- Asegúrate de que `netlify.toml` esté en la raíz del proyecto
- Verifica que el folder `netlify/functions` exista
- Redesplega la aplicación

---

## 📝 Notas Importantes

1. **Modo Test**: Actualmente estás en modo test. Las tarjetas reales no funcionarán.

2. **Producción**: Para ir a producción:
   - Cambia las claves de Stripe a modo live (`pk_live_...` y `sk_live_...`)
   - Configura webhooks de Stripe
   - Implementa emails de confirmación
   - Añade más validaciones

3. **Monitoreo**: Revisa regularmente:
   - Dashboard de Stripe para transacciones
   - Logs de Netlify Functions
   - Errores en Supabase

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs de Netlify Functions
2. Verifica las variables de entorno
3. Comprueba la consola del navegador
4. Revisa el dashboard de Stripe

---

**¡Listo para recibir pagos! 💰**
