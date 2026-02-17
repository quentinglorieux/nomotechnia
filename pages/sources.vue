<template>
  <UDashboardGroup :ui="{ base: 'relative flex-1 flex overflow-hidden' }" class="flex-1 flex min-h-0 overflow-hidden">
    <NavSource />

    <MainSource 
      :sourceID="navState.selectedSourceID" 
    />
  </UDashboardGroup>
</template>

<script setup>
import NavSource from '~/components/sources/NavSource.vue';
import MainSource from '~/components/sources/MainSource.vue';

const navState = useNavState();
const globalState = useGlobalState();
const { $directus } = useNuxtApp();

// Fetch initial sources data if not already present
const { data } = await useAsyncData('sources-nav', async () => {
  if (globalState.value.sources?.length) return globalState.value.sources;
  
  const response = await $directus.request({
    method: 'GET',
    path: '/items/sources',
    params: {
      fields: ['id', 'titre'],
      filter: { status: { _eq: 'published' } },
      sort: ['titre']
    }
  });

  const sources = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  globalState.value.sources = sources;
  return sources;
});

watch(
  () => globalState.value.sources,
  (sources) => {
    if (!navState.value.selectedSourceID && Array.isArray(sources) && sources.length) {
      navState.value.selectedSourceID = sources[0].id;
      navState.value.comVisibility = false;
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  navState.value.navVisibility = true;
});
</script>
