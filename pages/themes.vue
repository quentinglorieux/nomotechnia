<template>
  <UDashboardGroup storage-key="themes-dashboard" class="relative flex-1 h-full min-h-0 overflow-hidden bg-white dark:bg-gray-900">
    <NavThemes
      :visible="navState.navVisibility"
    />

    <MainThemes 
      :theme="navState.selectedThemeID" 
    />
  </UDashboardGroup>
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