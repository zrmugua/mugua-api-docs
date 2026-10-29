import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePortal from './components/HomePortal.vue'
import DocMeta from './components/DocMeta.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(DocMeta)
  }),
  enhanceApp({ app }) {
    app.component('HomePortal', HomePortal)
  }
}
