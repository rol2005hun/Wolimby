// https://nuxt.com/docs/api/configuration/nuxt-config
import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
  app: {
    head: {
      title: 'Wolimby - Account',
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css', crossorigin: 'anonymous' },
        { rel: 'icon', href: 'https://i.imgur.com/Z4uWZ64.jpg', type: 'image/x-icon' }
      ],
      meta: [
        { name: 'title', content: 'Wolimby - Account' },
        { name: 'description', content: 'Manage your Wolimby Account' }
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
      apiBase: 'https://api.account.wolimby.hu',
      cookieDomain: 'wolimby.hu'
    }
  }
}

export default config;
