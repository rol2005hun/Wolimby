// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
  compatibilityDate: '2025-10-01',
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'hu'
      },
      title: 'Wolimby - Shortify',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/4AuMYW2.png', type: 'image/x-icon' }
      ],
      meta: [
        { name: 'title', content: 'Wolimby - Shortify' },
        { name: 'description', content: 'Link rövidítés egyszerűen.' }
      ]
    },
    rootId: 'app'
  },
  static: {
    directory: 'static'
  },
  buildModules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBase: 'https://api.shortify.wolimby.site',
    }
  }
}

export default config;