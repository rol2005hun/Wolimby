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
      title: 'Wolimby - Games',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/S3W7xAU.png', type: 'image/x-icon' }
      ],
      meta: [
        { name: 'title', content: 'Wolimby - Games' },
        { name: 'description', content: 'Játssz a Wolimby összes játékával egy helyen' }
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
      //apiBase: 'http://localhost:2002',
      apiBase: 'https://api.games.wolimby.site',
    }
  }
}

export default config;
