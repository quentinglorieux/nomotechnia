<template>
  <div class="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
    <NavThemes
      :visible="navState.navVisibility"
      class="shrink-0"
    />

    <MainThemes 
      :theme="navState.selectedThemeID" 
      class="flex-1 min-w-0"
    />
  </div>
</template>

<script setup>
import NavThemes from '~/components/themes/NavThemes.vue';
import MainThemes from '~/components/themes/MainThemes.vue';

const navState = useNavState();
const globalState = useGlobalState();
const { $directus } = useNuxtApp();

// Fetch themes data for navigation if not already present
const { data } = await useAsyncData('themes-nav', async () => {
  if (globalState.value.themes?.length) return globalState.value.themes;
  
  const response = await $directus.request({
    method: 'GET',
    path: '/items/themes',
    params: {
      fields: ['id', 'titre', 'introduction', 'sources.id', 'sources.titre'],
      sort: ['titre']
    }
  });
  
  globalState.value.themes = response;
  return response;
});
</script>