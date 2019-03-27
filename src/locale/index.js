import Vue from 'vue'
import VueI18n from 'vue-i18n'

import en from './en.json'
import zh from './zh.json'
import vi from './vi.json'
import ko from './ko.json'

Vue.use(VueI18n)

const i18n = new VueI18n({
  fallbackLocale: 'en',
  locale: 'zh',
  messages: {
    en,
    zh,
    vi,
    ko
  }
})

export default i18n
