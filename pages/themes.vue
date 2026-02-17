<template>
  <UDashboardGroup :ui="{ base: 'relative flex-1 flex overflow-hidden' }" class="flex-1 flex min-h-0 overflow-hidden">
    <NavThemes />

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

onMounted(() => {
  navState.value.navVisibility = true;
});
</script>