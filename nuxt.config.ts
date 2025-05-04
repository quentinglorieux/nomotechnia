const baseUrl = '/';

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    '@pinia/nuxt',
    '@sidebase/nuxt-pdf'],
  ssr: false,
  runtimeConfig: {
    apiSecret: '1',
    public: {
      //API_BASE_URL: 'https://admin.nomotechnia.rubidiumweb.fr'
      // API_BASE_URL: 'https://jurisdirectus.rubidiumweb.eu'
      API_BASE_URL: 'http://localhost:5555'
    }
  },
  css: [
    //"primevue/resources/themes/saga-blue/theme.css",
    "~/assets/styles/theme/rb-light/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
    "~/assets/styles.scss",
  ],
  build: {
    transpile: ["primevue"],
  },

  components: [
    {
      path: "~/components/",
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: false,
  },

  /*app: {
    baseURL: baseUrl,
    head: {
        link: [
            {
                id: 'theme-link',
                rel: 'stylesheet',
                href: baseUrl + 'assets/styles/theme/arya-blue/theme.css'
            }
        ],
      }
    }*/
});

