<template>
  <div class="flex h-full min-h-0 overflow-hidden bg-white dark:bg-gray-900">
    <NavSource
      v-if="globalState.sources"
      :visible="navState.navVisibility"
      class="shrink-0"
    />

    <MainSource 
      :sourceID="navState.selectedSourceID" 
      class="flex-1 min-w-0 min-h-0"
    />
  </div>
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
  
  globalState.value.sources = response;
  return response;
});
</script>
