// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: {
        lang: 'hu'
      },
      title: 'Wolimby',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/Z4uWZ64.jpg', type: 'image/x-icon' },
        { rel: 'manifest', href: '/manifest.json' }
      ],
      meta: [
        { name: 'title', content: 'Wolimby' },
        { name: 'description', content: 'Próbáld ki. Csak ne szokj rá :)' }
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
      //apiBase: 'http://localhost:2000',
      apiBase: 'https://api.wolimby.hu',
    }
  }
}

export default config;