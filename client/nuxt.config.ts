// https://nuxt.com/docs/api/configuration/nuxt-config
import { NuxtConfig } from '@nuxt/types';

const config: NuxtConfig = {
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
<<<<<<< HEAD
      apiBase: 'https://api.games.wolimby.hu'
=======
      //apiBase: 'localhost:2002',
      apiBase: 'https://api.games.wolimby.hu',
>>>>>>> 3055d34 (push)
    }
  }
}

export default config;
