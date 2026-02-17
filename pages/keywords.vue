<template>
  <UDashboardGroup :ui="{ base: 'relative flex-1 flex overflow-hidden' }" class="flex-1 flex min-h-0 overflow-hidden">
    <NavKeywords v-if="globalState.keywords" />

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
