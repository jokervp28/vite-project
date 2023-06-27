import 'vuetify/styles'
import 'vuetify/dist/vuetify.min.css'
import { createVuetify } from 'vuetify'
import * as directives from 'vuetify/directives'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'

export default createVuetify({
  components: {
    ...directives,
    ...components,
    ...labsComponents
  },
  ssr: true,
  icons: {
    iconfont: 'md' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  }
})