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
      title: 'Wolimby - Social',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/G1Ev0W9.png', type: 'image/x-icon' }
      ],
      meta: [
        { name: 'title', content: 'Wolimby - Social' },
        { name: 'description', content: 'eZAZ.' }
      ]
    },
    rootId: 'app'
  },
  static: {
    directory: 'static'
  },
  buildModules: ['@pinia/nuxt'],
  modules: ['nuxt-socket-io'],
  io: {
    sockets: [{
      default: true,
      name: 'main',
      //url: 'http://localhost:2004',
      url: 'https://api.social.wolimby.site'
    }]
  },
  runtimeConfig: {
    public: {
      //apiBase: 'http://localhost:2004',
      apiBase: 'https://api.social.wolimby.site',
      imgurClientId: '80af936d45232db'
    }
  }
}

export default config;