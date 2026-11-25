import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomePortal from './components/HomePortal.vue'
import DocMeta from './components/DocMeta.vue'
import EndpointCopy from './components/EndpointCopy.vue'
import BillingCalculator from './components/BillingCalculator.vue'
import ConfigFill from './components/ConfigFill.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'doc-before': () => h(DocMeta)
  }),
  enhanceApp({ app }) {
    app.component('HomePortal', HomePortal)
    app.component('EndpointCopy', EndpointCopy)
    app.component('BillingCalculator', BillingCalculator)
    app.component('ConfigFill', ConfigFill)
  }
}
