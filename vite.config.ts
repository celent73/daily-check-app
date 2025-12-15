import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configurazione Vite ottimizzata per Netlify e deploy statici
export default defineConfig({
  base: './', // 🔥 IMPORTANTISSIMO per evitare pagina bianca su Netlify
  plugins: [react()],
  build: {
    outDir: 'dist',       // cartella di output
    assetsDir: 'assets',  // cartella degli asset
    sourcemap: false      // disattiva mappe per ridurre dimensioni
  },
});
