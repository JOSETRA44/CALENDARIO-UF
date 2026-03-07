# Instrucciones — Calendario UF

Guía completa para configurar la base de datos en Supabase y desplegar en GitHub Pages.

---

## 1. SQL — Ejecutar en el SQL Editor de Supabase

Abre **Supabase → SQL Editor → New Query** y ejecuta los bloques en orden.

---

### BLOQUE 1 — Crear tablas

```sql
-- =============================================
-- TABLA: cumpleanios
-- =============================================
CREATE TABLE IF NOT EXISTS public.cumpleanios (
  id               UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre           VARCHAR(255) NOT NULL,
  fecha_nacimiento DATE         NOT NULL,   -- YYYY-MM-DD. Solo mes+día para la cuenta regresiva anual
  descripcion      TEXT,
  avatar_url       TEXT,
  departamento     VARCHAR(100),
  activo           BOOLEAN      DEFAULT TRUE,
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- =============================================
-- TABLA: dias_festivos
-- =============================================
CREATE TABLE IF NOT EXISTS public.dias_festivos (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre        VARCHAR(255) NOT NULL,
  fecha         DATE         NOT NULL,           -- YYYY-MM-DD
  descripcion   TEXT,
  tipo          VARCHAR(50)  DEFAULT 'nacional', -- 'nacional' | 'empresa' | 'regional'
  es_recurrente BOOLEAN      DEFAULT TRUE,       -- TRUE = se repite cada año (usa mes+día)
  icono         VARCHAR(10)  DEFAULT '🎉',       -- Emoji representativo
  activo        BOOLEAN      DEFAULT TRUE,
  created_at    TIMESTAMPTZ  DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  DEFAULT NOW()
);
```

---

### BLOQUE 2 — Habilitar Row Level Security (RLS)

```sql
-- Activar RLS en ambas tablas
ALTER TABLE public.cumpleanios   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dias_festivos ENABLE ROW LEVEL SECURITY;

-- ── CUMPLEANIOS ─────────────────────────────────────
-- Lectura pública (anon): solo registros activos
CREATE POLICY "anon_select_cumpleanios"
  ON public.cumpleanios FOR SELECT TO anon
  USING (activo = TRUE);

-- Escritura completa: solo usuarios autenticados (administradores)
CREATE POLICY "auth_all_cumpleanios"
  ON public.cumpleanios FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- ── DIAS FESTIVOS ────────────────────────────────────
-- Lectura pública (anon): solo registros activos
CREATE POLICY "anon_select_festivos"
  ON public.dias_festivos FOR SELECT TO anon
  USING (activo = TRUE);

-- Escritura completa: solo usuarios autenticados (administradores)
CREATE POLICY "auth_all_festivos"
  ON public.dias_festivos FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);
```

---

### BLOQUE 3 — Auto-actualizar `updated_at`

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_cumpleanios_updated_at
  BEFORE UPDATE ON public.cumpleanios
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_festivos_updated_at
  BEFORE UPDATE ON public.dias_festivos
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

---

### BLOQUE 4 — Días festivos de Chile 2026 (datos de ejemplo)

```sql
INSERT INTO public.dias_festivos (nombre, fecha, descripcion, tipo, es_recurrente, icono) VALUES
  ('Año Nuevo',                      '2026-01-01', 'Celebración del año nuevo',                       'nacional', TRUE, '🎆'),
  ('Día del Trabajo',                '2026-05-01', 'Día Internacional de los Trabajadores',            'nacional', TRUE, '👷'),
  ('Día de las Glorias Navales',     '2026-05-21', 'Conmemoración del Combate Naval de Iquique',       'nacional', TRUE, '⚓'),
  ('San Pedro y San Pablo',          '2026-06-29', 'Festividad religiosa',                             'nacional', TRUE, '⛪'),
  ('Día de la Virgen del Carmen',    '2026-07-16', 'Patrona de Chile',                                 'nacional', TRUE, '🙏'),
  ('Asunción de la Virgen',          '2026-08-15', 'Festividad religiosa',                             'nacional', TRUE, '✨'),
  ('Fiestas Patrias',                '2026-09-18', 'Primer día de las Fiestas Patrias',               'nacional', TRUE, '🇨🇱'),
  ('Día del Ejército',               '2026-09-19', 'Glorias del Ejército de Chile',                    'nacional', TRUE, '🪖'),
  ('Día de la Raza',                 '2026-10-12', 'Encuentro de dos mundos',                          'nacional', TRUE, '🌎'),
  ('Día de las Iglesias Evangélicas','2026-10-31', 'Festividad evangélica',                            'nacional', TRUE, '✝️'),
  ('Día de Todos los Santos',        '2026-11-01', 'Festividad religiosa',                             'nacional', TRUE, '🕯️'),
  ('Inmaculada Concepción',          '2026-12-08', 'Festividad religiosa',                             'nacional', TRUE, '💙'),
  ('Navidad',                        '2026-12-25', '¡Feliz Navidad!',                                  'nacional', TRUE, '🎄');
```

---

### BLOQUE 5 — Cumpleaños de ejemplo (reemplaza con los datos reales)

```sql
INSERT INTO public.cumpleanios (nombre, fecha_nacimiento, descripcion, departamento) VALUES
  ('María González', '1990-03-15', 'Le gusta el café americano', 'Recursos Humanos'),
  ('Carlos Pérez',   '1988-07-22', 'Fanático del fútbol',        'Tecnología'),
  ('Ana Martínez',   '1995-11-08', 'Ama los viajes',             'Marketing'),
  ('Juan Rodríguez', '1992-04-30', 'Chef amateur',               'Finanzas'),
  ('Sofía López',    '1993-12-20', 'Toca la guitarra',           'Ventas');
```

---

## 2. Gestión de datos — Comandos rápidos

### Agregar un cumpleaños
```sql
INSERT INTO public.cumpleanios (nombre, fecha_nacimiento, descripcion, departamento)
VALUES ('Nombre Apellido', 'YYYY-MM-DD', 'Descripción opcional', 'Área');
```

### Agregar un día festivo
```sql
INSERT INTO public.dias_festivos (nombre, fecha, descripcion, tipo, es_recurrente, icono)
VALUES ('Nombre festivo', 'YYYY-MM-DD', 'Descripción', 'nacional', TRUE, '🎉');
```

### Desactivar un registro (sin borrarlo)
```sql
UPDATE public.cumpleanios   SET activo = FALSE WHERE nombre = 'Nombre Apellido';
UPDATE public.dias_festivos SET activo = FALSE WHERE nombre = 'Nombre Festivo';
```

### Eliminar un registro por ID
```sql
DELETE FROM public.cumpleanios   WHERE id = 'uuid-del-registro';
DELETE FROM public.dias_festivos WHERE id = 'uuid-del-registro';
```

---

## 3. Seguridad — Resumen del modelo RLS

| Rol             | SELECT          | INSERT | UPDATE | DELETE |
|-----------------|-----------------|--------|--------|--------|
| `anon` (público)| ✅ Solo activos  | ❌     | ❌     | ❌     |
| `authenticated` | ✅ Todos         | ✅     | ✅     | ✅     |

- Los visitantes de la página **solo pueden leer** eventos activos.
- Para agregar/editar/borrar datos usa el **SQL Editor** o la **Table Editor** de Supabase.
- La clave `anon` en `.env.local` es pública por diseño — está protegida por las políticas RLS.

> **Nota sobre la API Key:**
> Si ves un error `401 Unauthorized`, ve a **Supabase → Project Settings → API** y copia la clave **anon public**. Pégala en `.env.local` en `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 4. Desarrollo local — Next.js

### Requisitos
- Node.js 20+
- npm

### Instalar y correr

```bash
# Desde la carpeta CALENDARIO_UF
npm install
npm run dev
```

El sitio estará en `http://localhost:3000`.

---

## 5. Despliegue en GitHub Pages — Next.js + GitHub Actions

El proyecto usa **Next.js static export** + **GitHub Actions** para despliegue automático.

### Paso 1 — Crear el repositorio

1. Ve a [github.com/new](https://github.com/new)
2. Nombre: `calendario-uf` (o el que prefieras)
3. Visibilidad: **Public** (requerido para Pages gratuito)
4. Sin README ni .gitignore inicial

### Paso 2 — Configurar GitHub Repository Variables

En tu repositorio → **Settings** → **Secrets and variables** → **Actions** → pestaña **Variables**:

| Nombre                        | Valor                                              |
|-------------------------------|----------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`    | `https://dnzzqjrmyyvukeadsxei.supabase.co`        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(tu clave anon de Supabase)*                  |
| `NEXT_PUBLIC_BASE_PATH`       | `/calendario-uf` *(nombre de tu repo con barra)*   |

> Si el repositorio se llama `calendario-uf`, el `BASE_PATH` es `/calendario-uf`.
> Si usas un dominio propio o `username.github.io`, deja `BASE_PATH` vacío.

### Paso 3 — Activar GitHub Pages con Actions

1. Repositorio → **Settings** → **Pages**
2. Source: **GitHub Actions** *(no "Deploy from a branch")*
3. Guarda.

### Paso 4 — Subir el proyecto

```bash
# Desde la carpeta CALENDARIO_UF
git init
git add .
git commit -m "feat: Calendario UF — Next.js + TypeScript"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/calendario-uf.git
git push -u origin main
```

> `.env.local` ya está en `.gitignore` y NO se sube.
> Las credenciales van en GitHub Variables (paso 2) y el workflow las inyecta al hacer el build.

El workflow `.github/workflows/deploy.yml` se ejecuta automáticamente en cada `push` a `main`.

### Paso 5 — Ver el sitio

Tras 2–3 minutos en la primera vez:
```
https://TU_USUARIO.github.io/calendario-uf/
```

### Actualizar el sitio

```bash
git add .
git commit -m "descripción del cambio"
git push
```

GitHub Actions reconstruye y despliega automáticamente.

---

## 6. Estructura del proyecto (Next.js)

```
CALENDARIO_UF/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (fuente, metadata)
│   │   ├── page.tsx            ← Página principal
│   │   └── globals.css         ← Tailwind v4 + design tokens
│   ├── components/
│   │   ├── Particles.tsx       ← Fondo animado (canvas)
│   │   ├── Header.tsx          ← Header sticky con fecha
│   │   ├── Hero.tsx            ← Próximo evento + countdown
│   │   ├── CountdownUnit.tsx   ← Dígito animado (Framer Motion)
│   │   ├── UpcomingStrip.tsx   ← Scroll horizontal de próximos
│   │   ├── EventsGrid.tsx      ← Grid con búsqueda y filtros
│   │   └── EventCard.tsx       ← Tarjeta de evento
│   ├── hooks/
│   │   ├── useEvents.ts        ← Fetch + procesamiento Supabase
│   │   └── useCountdown.ts     ← Countdown en tiempo real
│   ├── lib/
│   │   ├── supabase.ts         ← Cliente Supabase
│   │   └── dates.ts            ← Utilidades de fechas
│   └── types/
│       └── index.ts            ← TypeScript interfaces
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions — build + deploy
├── next.config.ts              ← Static export + basePath
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── .env.local                  ← Variables locales (NO subir a GitHub)
├── .gitignore
└── instrucciones.md            ← Esta guía
```
