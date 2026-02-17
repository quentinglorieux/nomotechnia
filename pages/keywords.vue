<template>
  <UDashboardGroup storage-key="keywords-dashboard" class="relative flex-1 h-full min-h-0 overflow-hidden bg-white dark:bg-gray-900">
    <NavKeywords
      v-if="globalState.keywords"
      :visible="navState.navVisibility"
    />

    <MainKeywords
      :sourceID="navState.selectedKeywordID"
    />
  </UDashboardGroup>
</template>

<script setup>
import NavKeywords from "~/components/keywords/NavKeywords.vue";
import MainKeywords from "~/components/keywords/MainKeywords.vue";

const globalState = useGlobalState();
const navState = useNavState();
const { $directus } = useNuxtApp();

// Fetch keywords data for navigation if not already present
const { data } = await useAsyncData("keywords-nav", async () => {
  if (globalState.value.keywords?.length) return globalState.value.keywords;

  const response = await $directus.request({
    method: "GET",
    path: "/items/keywords",
    params: {
      fields: ["id", "titre", "introduction", "commentaires.id"],
      sort: ["titre"],
    },
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
});
</script>
