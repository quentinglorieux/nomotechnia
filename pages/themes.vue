<template>
  <div class="flex min-h-screen">

    <!-- <NavThemes   @themeSelected="(e) => (themeSelection = e)" /> -->
    <MainThemes :theme="navStore.selectedThemeID"/>
    
  </div>
</template>

<script setup>

// DataFetching of Themes
import { useGlobalStore } from "~/stores/global";
const store = useGlobalStore();

import { useNavStore } from "~/stores/navigation";
const navStore = useNavStore();


const { $directus } = useNuxtApp();
async function retrieveFullThemesData() {
  const { data: publicData } = await useAsyncData(() => {
    return $directus.items("themes").readByQuery({
      fields: [
        "id,titre,introduction,sources.id,sources.titre",
      ],
    });
  });
  store.themes = publicData.value.data; //Storage of Themes data
}

onMounted(() => {
  if(store.themes[0]){
    retrieveFullThemesData();
  }
});







</script>

<style scoped lang="scss">

</style>