# 🔧 Troubleshooting - Problemas de Conexión a Supabase

## ❌ Error: No se conecta a Supabase en GitHub Pages

### Causa Probable
Las variables de entorno `NEXT_PUBLIC_SUPABASE_*` no están siendo correctamente embebidas en el bundle durante el build en GitHub Actions.

### Soluciones

#### 1. **Verificar Variables de Entorno Locales**
```bash
# Asegúrate de tener el archivo .env.local con:
cat .env.local
# Debe contener:
# NEXT_PUBLIC_SUPABASE_URL=https://dnzzqjrmyyvukeadsxei.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

#### 2. **Verificar Build Local**
```bash
# Test que el build incluye las credenciales
npm run build
node scripts/check-supabase-config.js
```

Si ves ✅ verde, las credenciales están embebidas. Si ves ❌, falta configuración.

#### 3. **Actualizar Secrets en GitHub**
1. Ve a tu repositorio en GitHub
2. Abre Settings > Secrets and variables > Actions
3. Crea o actualiza:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Nota**: En el workflow actual, usa `${{ secrets.VARIABLE_NAME || 'fallback' }}` para fallback a valores hardcodeados.

#### 4. **Revisar el Workflow en GitHub**
1. Ve a Actions en tu repositorio
2. Busca el workflow `Deploy Calendario UF to GitHub Pages`
3. Abre el último build y expande el paso `Build Next.js static export`
4. Verifica que las variables están siendo usadas:
   ```
   NEXT_PUBLIC_SUPABASE_URL: ...
   NEXT_PUBLIC_SUPABASE_ANON_KEY: ...
   ```

#### 5. **Verificar CORS en Supabase**
Si las variables están correctas pero aún no funciona:

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Configuration > Auth > Site URL
3. Agrega tu GitHub Pages URL:
   ```
   https://[username].github.io/[repo-name]
   ```

4. Authentication > URL Configuration
5. Agrega al campo "Redirect URLs"

#### 6. **Verificar Network Tab en Browser**
1. Abre tu sitio en GitHub Pages
2. Abre DevTools (F12)
3. Ve a Network tab
4. Busca requests a `dnzzqjrmyyvukeadsxei.supabase.co`
5. Si ves errores CORS, el problema es en Supabase auth

### ✅ Verificación Rápida
```bash
# En local, verifica que todo funciona
npm run dev
# Debería mostrar los eventos cargando

# Luego verifica el build
npm run build
npm run start
# Debería funcionar igual
```

### 📝 Checklist de Configuración

- [ ] `.env.local` tiene `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` tiene `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- [ ] `npm run build` completa sin errores
- [ ] `node scripts/check-supabase-config.js` muestra ✅
- [ ] GitHub Secrets están configurados (opcional, si usas)
- [ ] Supabase Site URL incluye GitHub Pages URL
- [ ] Browser console no muestra errores de CORS

### 🆘 Si Nada Funciona

1. **Crea un .env.local limpio**:
   ```bash
   cp .env.example .env.local
   # Edita y rellena con tus credenciales de Supabase
   ```

2. **Reinicia el dev server**:
   ```bash
   # Mata todos los procesos Node
   npm run dev
   ```

3. **Limpia caché y rebuilds**:
   ```bash
   rm -rf .next out node_modules
   npm ci
   npm run build
   ```

4. **Verifica credentials en Supabase**:
   - Project Settings > API
   - Copy el URL y Anon Key exactamente
   - Pega en `.env.local`

## 📚 Referencias

- [Supabase Environment Variables](https://supabase.com/docs/guides/api/env-vars)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [GitHub Pages Deployment](https://nextjs.org/docs/app/building-your-application/deploying/static-exports/github-pages)
