import {build} from 'vite';
import vue from '@vitejs/plugin-vue'

// libraries
const libraries = [
  {
    entry: './src/lib.js',
    name: 'GridView',
    fileName: 'grid-view',
    formats: ['es', 'umd'],
  },
];

// build
libraries.forEach(async (item) => {
  await build({
    plugins: [vue()],
    configFile: false,
    emptyOutDir: false,
    publicDir: false,
    build: {
      cssCodeSplit: false,
      lib: item,
      emptyOutDir: false,
      rollupOptions: {
        external: ['vue'],
        output: {
          assetFileNames: `${item.fileName}.css`,
          globals: {
            vue: 'Vue'
          },
        }
      },
    },
  });
});
