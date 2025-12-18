import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';

// Configurazione Vite ottimizzata per Netlify e deploy statici
export default defineConfig({
  base: './', // 🔥 IMPORTANTISSIMO per evitare pagina bianca su Netlify
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11', 'Android >= 9'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'app-logo.png'],
      manifest: {
        name: 'Daily Check',
        short_name: 'Daily Check',
        description: 'Monitora le tue attività giornaliere in modo semplice e veloce.',
        theme_color: '#3b82f6',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'app-logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'app-logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',       // cartella di output
    assetsDir: 'assets',  // cartella degli asset
    sourcemap: false      // disattiva mappe per ridurre dimensioni
  },
});
