import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: "/[REPO_NAME]/",
  plugins: [
    react({
        plugins: [
          [
            '@swc/plugin-styled-components',
            {
              meaninglessFileNames: ['index', 'styles'],
            },
          ],
        ],
    }),
    // tsconfigPaths(),
  ],

  
})
