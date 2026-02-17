<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="text-3xl sm:text-4xl font-black tracking-tight uppercase text-gray-900 dark:text-white">
        Nomotechnia
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6 text-lg font-medium text-gray-800 dark:text-gray-100">
        <NuxtLink to="/" class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
          <UIcon name="i-lucide-home" class="w-4 h-4" />
          Accueil
        </NuxtLink>
        <NuxtLink to="/sources" class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
          <UIcon name="i-lucide-book-open" class="w-4 h-4" />
          Sources
        </NuxtLink>
        <NuxtLink to="/keywords" class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
          <UIcon name="i-lucide-tags" class="w-4 h-4" />
          Mots clés
        </NuxtLink>

        <div 
          class="relative group"
          @mouseenter="isThemesOpen = true"
          @mouseleave="isThemesOpen = false"
        >
          <button class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
            <UIcon name="i-lucide-list" class="w-4 h-4" />
            Thèmes
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isThemesOpen }" />
          </button>
          <div 
            v-if="isThemesOpen"
            class="absolute right-0 top-full pt-2 z-50 w-72"
          >
            <div class="max-h-96 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2">
              <button
                v-for="theme in globalState.themes || []"
                :key="theme.id"
                type="button"
                class="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="openTheme(theme.id)"
              >
                {{ theme.titre }}
              </button>
            </div>
          </div>
        </div>

        <div 
          class="relative group"
          @mouseenter="isAuthorsOpen = true"
          @mouseleave="isAuthorsOpen = false"
        >
          <button class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
            <UIcon name="i-lucide-users" class="w-4 h-4" />
            Auteurs
            <UIcon name="i-lucide-chevron-down" class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': isAuthorsOpen }" />
          </button>
          <div 
            v-if="isAuthorsOpen"
            class="absolute right-0 top-full pt-2 z-50 w-72"
          >
            <div class="max-h-96 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2">
              <NuxtLink
                to="/auteurs"
                class="block px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Tous les auteurs
              </NuxtLink>
              <button
                v-for="author in globalState.authors || []"
                :key="author.id"
                type="button"
                class="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                @click="openAuthor(author.last_name)"
              >
                {{ author.first_name }} {{ author.last_name }}
              </button>
            </div>
          </div>
        </div>

        <NuxtLink to="/map" class="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400">
          <UIcon name="i-lucide-map" class="w-4 h-4" />
          Map
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <UButton
          icon="i-lucide-search"
          variant="ghost"
          color="neutral"
          square
          aria-label="Rechercher"
          class="hidden sm:inline-flex"
        />
        <UButton
          to="https://admin.nomotechnia.rubidiumweb.fr/"
          target="_blank"
          icon="i-lucide-settings"
          variant="ghost"
          color="neutral"
          square
          aria-label="Administration"
        />
        <UButton
          icon="i-lucide-panel-left"
          variant="ghost"
          color="neutral"
          class="md:hidden"
          @click="navState.navOpen = !navState.navOpen"
          aria-label="Toggle navigation"
        />
        <UColorModeButton />
        <UButton
          icon="i-lucide-menu"
          variant="ghost"
          color="neutral"
          class="md:hidden"
          @click="isMobileMenuOpen = true"
        />
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
    >
      <div class="p-4 space-y-2">
        <NuxtLink to="/" class="block py-1.5" @click="isMobileMenuOpen = false">Accueil</NuxtLink>
        <NuxtLink to="/sources" class="block py-1.5" @click="isMobileMenuOpen = false">Sources</NuxtLink>
        <NuxtLink to="/keywords" class="block py-1.5" @click="isMobileMenuOpen = false">Mots-clés</NuxtLink>
        <NuxtLink to="/themes" class="block py-1.5" @click="isMobileMenuOpen = false">Thèmes</NuxtLink>
        <NuxtLink to="/auteurs" class="block py-1.5" @click="isMobileMenuOpen = false">Auteurs</NuxtLink>
        <NuxtLink to="/map" class="block py-1.5" @click="isMobileMenuOpen = false">Map</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const globalState = useGlobalState();
const navState = useNavState();
const { $directus } = useNuxtApp();

const isMobileMenuOpen = ref(false);
const isThemesOpen = ref(false);
const isAuthorsOpen = ref(false);

const keywordCommentsCount = computed(() => {
  if (!Array.isArray(globalState.value.keywords)) return 0;
  return globalState.value.keywords.reduce((acc, kw) => {
    return acc + (kw.commentaires?.length || 0);
  }, 0);
});

async function openTheme(themeId) {
  navState.value.selectedThemeID = themeId;
  isThemesOpen.value = false;
  await navigateTo('/themes');
}

async function openAuthor(lastName) {
  isAuthorsOpen.value = false;
  await navigateTo(`/auteur-${lastName}`);
}

// Dynamic data fetching for Authors and Themes
async function fetchData() {
  try {
    const [authorsResponse, themesResponse] = await Promise.all([
      $directus.request({
        method: 'GET',
        path: '/users',
        params: {
          fields: ['id', 'first_name', 'last_name', 'avatar', 'commentaires.status'],
          filter: {
            role: { _starts_with: 'aeeefb57-7b36' }
          }
        }
      }),
      $directus.request({
        method: 'GET',
        path: '/items/themes',
        params: {
          fields: ['id', 'titre']
        }
      })
    ]);

    // Filter authors with published comments
    globalState.value.authors = authorsResponse.filter(user => 
      user.commentaires?.some(c => c.status === 'published')
    );
    globalState.value.themes = themesResponse;
  } catch (error) {
    console.error('Error fetching navigation data:', error);
  }
}

onMounted(() => {
  if (!globalState.value.authors?.length || !globalState.value.themes?.length) {
    fetchData();
  }
});
</script>
