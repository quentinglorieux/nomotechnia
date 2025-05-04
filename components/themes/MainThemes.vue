<template>
  <div class=" p-3 w-2/3 mx-auto">
    <div v-if="!theme">
      <h1>Sélectionnez un Theme</h1>
    </div>
    
    <div v-else class=" mx-auto mt-1">
      <div class="titre-page mx-2">
        <h1>  {{ theme.data.titre }}</h1>
      </div>
      
      <div class="w-full">
      <Panel class="px-2 mt-2" header="Introduction" toggleable :collapsed="isCollapsed" @click="isCollapsed=!isCollapsed">
        <div v-html="theme.data.introduction"></div>
        </Panel>

          <div class="flex"> <div style="width:100%">
          <Panel class="px-2 mt-2" header="Sources" toggleable :collapsed="isCollapsedSource" @click="isCollapsedSource=!isCollapsedSource">
            <ul>
            <li v-for="source in theme.data.sources">
              <NuxtLink
                class="hover:bg-sky-200"
                :to="{ name: 'sources' }"
                @click="updateRoute(source.id); navStore.comVisibility=false"
              >
                {{ source.titre }}</NuxtLink
              >
            </li>
          </ul>
        </Panel>
      </div>
      <!-- <div style="width:40%">
        <Panel class="px-2 mt-2" header="Mots-clés" toggleable :collapsed="isCollapsedKW" @click="isCollapsedKW=!isCollapsedKW">
            <ul>
            <li v-for="source in theme.data.sources">
              <NuxtLink
                class="hover:bg-sky-200"
                :to="{ name: 'keywords' }"
                @click="updateRoute(source.id)"
              >
                {{ source.titre }}</NuxtLink
              >
            </li>
          </ul>
        </Panel>
      </div> -->
      </div>

          <!-- <div class="theme-content">
          <div style="width:60%">
          <Panel header="Sources">
            <div>
          <ul>
            <li v-for="source in theme.data.sources">
              <NuxtLink
                class="hover:bg-sky-200"
                :to="{ name: 'sources' }"
                @click="updateRoute(source.id)"
              >
                {{ source.titre }}</NuxtLink
              >
            </li>
          </ul>
        </div>
        </Panel>
          </div>

         
          <div style="width:40%;">
            <h2>Mots-clés</h2>
          </div>
          
          </div> -->
        </div>
        <!-- </SplitterPanel> -->
      <!-- </Splitter> -->
    </div>
  </div>
</template>

<script setup>
import { useNavStore } from "@/stores/navigation";
const navStore = useNavStore();
const oldID = ref();
const isCollapsed = ref(false)
const isCollapsedSource = ref(false)
const isCollapsedKW =ref(false)

function updateRoute(id) {
  navStore.selectedSourceID = id;
}

const theme = ref();
// DataFetching of the selected Themes
const { $directus } = useNuxtApp();
async function retrieveThemeData(id) {
  theme.value = await useAsyncData(() => {
    return $directus.items("themes").readOne(id, {
      fields: ["id,titre,introduction,sources.id,sources.titre"],
    });
  });
}

if (navStore.selectedThemeID) {
  retrieveThemeData(navStore.selectedThemeID);
  oldID.value = navStore.selectedThemeID;
}

onUpdated(() => {
  if (navStore.selectedThemeID != oldID.value) {
    retrieveThemeData(navStore.selectedThemeID);
  }
  oldID.value = navStore.selectedThemeID;

  if (navStore.selectedThemeID != oldID.value) {
    retrieveThemeData(navStore.selectedThemeID);
  }
  oldID.value = navStore.selectedThemeID;

  const comments = document.getElementsByTagName("mark");
  for (const el of comments) {
    el.addEventListener("click", () => {
      const comments2 = document.getElementsByTagName("mark");
      for (const el2 of comments2) {
        var comId = el2.getAttribute("data-linkedcomment");
        if (
          el.getAttribute("data-linkedcomment") ==el2.getAttribute("data-linkedcomment") 
        ) {
          el2.setAttribute("style", "background-color:rgb(240, 220, 210);");
          comActiv.value = comId;
          retrieveComments(comId);
        } else {
          el2.setAttribute("style", "background-color:rgb(255, 248, 225);");
        }
      }
    });
  }
});
</script>
