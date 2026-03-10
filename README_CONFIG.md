# 📅 Calendario UF - Events Calendar

Modern, beautiful calendar application for managing birthdays and holidays with real-time updates from Supabase.

## ✨ Features

- 🎂 **Birthday Management** - Track and celebrate team birthdays
- 🎉 **Holiday Calendar** - Manage custom holidays and special dates
- ⏱️ **Live Countdown** - Real-time countdown to next events
- 📱 **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- 🚀 **Modern UI** - Glassmorphism, smooth animations, particle effects
- 🔄 **Auto-Updates** - Refreshes every 5 minutes
- 🌙 **Dark Theme** - Easy on the eyes with beautiful nebula gradients

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, CSS custom properties
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Database + Auth)
- **Hosting**: GitHub Pages (Static Export)

## 📋 Prerequisites

- Node.js 20 or later
- npm or yarn
- Supabase project (free tier works great)

## 🚀 Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/CALENDARIO_UF.git
cd CALENDARIO_UF

# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see your calendar.

### 2. Supabase Setup

Create two tables in Supabase:

#### Table: `cumpleanios` (Birthdays)
```sql
create table cumpleanios (
  id bigint primary key generated always as identity,
  nombre text not null,
  fecha_nacimiento date not null,
  departamento text,
  descripcion text,
  activo boolean default true,
  created_at timestamp default now()
);
```

#### Table: `dias_festivos` (Holidays)
```sql
create table dias_festivos (
  id bigint primary key generated always as identity,
  nombre text not null,
  fecha date not null,
  es_recurrente boolean default false,
  tipo text, -- 'empresa', 'regional', 'nacional'
  descripcion text,
  activo boolean default true,
  created_at timestamp default now()
);
```

### 3. Deploy to GitHub Pages

#### Option A: Using GitHub UI

1. Push your code to GitHub on the `main` branch
2. Go to Settings > Pages
3. Source: Select "GitHub Actions"
4. The workflow will automatically run on push

#### Option B: Manual Deployment

```bash
# Build the project
npm run build

# Test locally
npm run start

# The 'out' directory contains static files ready for GitHub Pages
```

## 📖 Configuration

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | (long JWT token) |
| `NEXT_PUBLIC_BASE_PATH` | URL path prefix (GitHub Pages) | `/CALENDARIO_UF` or empty |

### Local vs Production

**Local (.env.local)**:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_BASE_PATH=
```

**GitHub Pages (via workflow)**:
- URL is auto-detected
- Base path is set to `/repo-name` automatically
- Secrets can optionally be used for extra security

## 🔐 Security Notes

- The `NEXT_PUBLIC_` variables are intentionally public (embedded in browser bundle)
- We use Supabase's **anonymous key**, not the secret key
- Use Supabase RLS (Row Level Security) to restrict data access
- Keep the secret key stored safely server-side only (not needed for this app)

## 📚 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── Hero.tsx            # Hero section with countdown
│   ├── Header.tsx          # Sticky header
│   ├── EventCard.tsx       # Individual event card
│   ├── EventsGrid.tsx      # Grid with search/filter
│   ├── UpcomingStrip.tsx   # Horizontal scrollable strip
│   ├── CountdownUnit.tsx   # Countdown digit unit
│   └── Particles.tsx       # Background starfield animation
├── hooks/
│   ├── useEvents.ts        # Fetch events from Supabase
│   └── useCountdown.ts     # Calculate countdown values
├── lib/
│   ├── supabase.ts         # Supabase client init
│   ├── dates.ts            # Date utility functions
│   └── types/index.ts      # TypeScript types
```

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Violet (#8b5cf6)
- **Birthday**: Rose (#f43f5e)
- **Holiday**: Amber (#f59e0b)
- **Today**: Emerald (#10b981)

### Typography
- **Font**: Inter (system-ui fallback)
- **Scale**: Major Third ratio (1.25x)
- **Weights**: 400, 600, 700, 900

### Spacing
- **Base Unit**: 8px
- **Scale**: 0.5rem, 1rem, 1.5rem, 2rem, ...

## 🚨 Troubleshooting

### Connection issues to Supabase?
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

### Build fails?
```bash
# Clean and rebuild
rm -rf .next out
npm ci
npm run build
```

### Styling looks broken?
```bash
# Restart dev server to reload Tailwind
npm run dev
```

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export)
npm run start    # Run production build locally
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions:
1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Review [issue on GitHub](https://github.com/YOUR_USERNAME/CALENDARIO_UF/issues)
3. Create a new issue if needed

---

**Made with ❤️ for UF peru**
