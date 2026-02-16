<template>
  <div class="flex h-full min-h-0 overflow-hidden bg-white dark:bg-gray-900">
    <NavKeywords
      v-if="globalState.keywords"
      :visible="navState.navVisibility"
      class="shrink-0"
    />

    <MainKeywords 
      :sourceID="navState.selectedKeywordID" 
      class="flex-1 min-w-0 min-h-0"
    />
  </div>
</template>

<script setup>
import NavKeywords from '~/components/keywords/NavKeywords.vue';
import MainKeywords from '~/components/keywords/MainKeywords.vue';

const globalState = useGlobalState();
const navState = useNavState();
const { $directus } = useNuxtApp();

// Fetch keywords data for navigation if not already present
const { data } = await useAsyncData('keywords-nav', async () => {
  if (globalState.value.keywords?.length) return globalState.value.keywords;
  
  const response = await $directus.request({
    method: 'GET',
    path: '/items/keywords',
    params: {
      fields: [
        'id',
        'titre',
        'introduction',
        'commentaires.commentaires_id.id',
        'commentaires.commentaires_id.titre',
        'commentaires.commentaires_id.auteur_id.first_name',
        'commentaires.commentaires_id.auteur_id.last_name',
        'commentaires.commentaires_id.source_id.id',
        'commentaires.commentaires_id.source_id.titre'
      ],
      filter: {
        commentaires: {
          _nnull: true,
        },
      },
      sort: ['titre']
    }
  });
  
  const keywords = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  globalState.value.keywords = keywords;
  return keywords;
});

onMounted(() => {
  navState.value.navVisibility = true;

  if (!navState.value.selectedKeywordID && globalState.value.keywords?.length) {
    navState.value.selectedKeywordID = globalState.value.keywords[0].id;
  }
});

watch(
  () => globalState.value.keywords,
  (keywords) => {
    if (!navState.value.selectedKeywordID && Array.isArray(keywords) && keywords.length) {
      navState.value.selectedKeywordID = keywords[0].id;
    }
  },
  { deep: true }
);
</script>