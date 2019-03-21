import Vue from 'vue'
import VueI18n from 'vue-i18n'

import zh from './zh.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  fallbackLocale: 'zh',
  locale: 'zh',
  messages: {
    zh
  }
})

export default i18n
