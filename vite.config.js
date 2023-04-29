import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  base: '',
  root: "src/renderer/hotkeys",
  plugins: [
    vue(),
    renderer()
  ],
})
