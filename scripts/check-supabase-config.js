#!/usr/bin/env node

/**
 * Diagnostic script to verify Supabase configuration is embedded in the build
 * Run: node scripts/check-supabase-config.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.join(__dirname, '..', 'out');
const chunksDir = path.join(outDir, '_next', 'static', 'chunks');

console.log('🔍 Checking Supabase configuration in build...\n');

if (!fs.existsSync(outDir)) {
  console.error('❌ Build directory not found. Run: npm run build');
  process.exit(1);
}

// Read all .js files in chunks directory
if (!fs.existsSync(chunksDir)) {
  console.error('❌ Chunks directory not found.');
  process.exit(1);
}

let buildContent = '';
try {
  const files = fs.readdirSync(chunksDir);
  for (const file of files) {
    if (file.endsWith('.js')) {
      const content = fs.readFileSync(path.join(chunksDir, file), 'utf-8');
      buildContent += content;
    }
  }
} catch (err) {
  console.error('❌ Error reading build files:', err.message);
  process.exit(1);
}

const checks = [
  {
    name: 'Supabase URL',
    pattern: /dnzzqjrmyyvukeadsxei\.supabase\.co/,
    env: 'NEXT_PUBLIC_SUPABASE_URL',
  },
  {
    name: 'Supabase Anon Key',
    pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9/,
    env: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  },
];

let allPassed = true;

checks.forEach(check => {
  const found = check.pattern.test(buildContent);
  console.log(`${found ? '✅' : '❌'} ${check.name} (${check.env})`);
  if (!found) allPassed = false;
});

console.log('');

if (allPassed) {
  console.log('✨ All Supabase credentials are correctly embedded in the build!');
  console.log('The application should connect to Supabase successfully.');
  console.log('\nIf there are still connection issues:');
  console.log('  - Verify CORS settings in Supabase');
  console.log('  - Check network connectivity');
  console.log('  - Ensure your Supabase project is active');
} else {
  console.log('❌ Missing Supabase credentials in build!');
  console.log('Make sure your .env.local has:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-jwt');
  process.exit(1);
}
