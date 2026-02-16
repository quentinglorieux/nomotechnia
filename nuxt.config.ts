export default defineNuxtConfig({
  compatibilityDate: '2026-02-16',
  future: {
    compatibilityVersion: 4,
    
  },

  modules: [
    "@nuxt/ui",
    "@sidebase/nuxt-pdf"
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  ssr: true,

  runtimeConfig: {
    apiSecret: '1',
    public: {
      API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://admin.nomotechnia.rubidiumweb.fr'
    }
  },

  css: [
    "~/assets/main.css",
  ],

  devtools: {
    enabled: true,
  }
});
