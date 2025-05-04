<template>
    <div class="p-3 pt-4">
      <li 
        v-for="com in comments"
        :key="com.id"
        class="mb-2 no-marker-li"
      >
        <div class="flex items-center p-1">
          <template v-if="comments.length === 1">
            <!-- Pas de bouton œil si un seul commentaire, juste le titre -->
            <div class="grow text-lg">
                <CommentaireSide
                  :com="comments[0].id"
                  :key="com.id">
                </CommentaireSide>
            </div>
          </template>
  
          <template v-else>
            <Button
              rounded
              class="shrink-0 min-w-fit bg-gray-200 hover:bg-blue-100 mr-2"
              icon="pi pi-eye"
              text
              @click="retrieveComments(com)"
            />
            <div class="grow text-lg">
              {{ com.titre }}
            </div>
          </template>
        </div>
      </li>
    </div>
  </template>
  
  <script setup>
  import { useNavStore } from "@/stores/navigation";
  import { useGlobalStore } from "~/stores/global";
  
  const props = defineProps({
    comments: {
      type: Array,
      required: true,
    },
  });
  
  const navStore = useNavStore();
  const store = useGlobalStore();
  const { $directus } = useNuxtApp();
  
  async function retrieveComments(com) {
    const { data } = await useAsyncData(() => {
      return $directus.items("commentaires").readOne(com.id);
    });
  
    store.commentaires = data.value;
    navStore.comVisibility = true;
    navStore.navVisibility = false;
    navStore.comID = com.id;
  }
  </script>