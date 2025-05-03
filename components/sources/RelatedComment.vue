<template>
  <mark
    class="cursor-pointer"
    :data-linkedcomment="props.data"
    @click="() => retrieveComments(props)"
  >    
  <slot></slot>
  </mark>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { RelationNodeProps } from "directus-extension-flexible-editor/content";
import { useNavStore } from "@/stores/navigation";
import { useGlobalStore } from "~/stores/global";

const navStore = useNavStore();
const store = useGlobalStore();

// ✅ Destructure explicitly as `props`
const props = defineProps<{
  id: RelationNodeProps["id"];
  junction: RelationNodeProps["junction"];
  collection: RelationNodeProps["collection"];
  data?: RelationNodeProps["data"];
}>();

const { $directus } = useNuxtApp();

async function retrieveComments(com) {
  if (!com?.data) return;

  // Step 1: fetch the related_comments record
  const { data: relationData } = await useAsyncData(() =>
    $directus.items("related_comments").readOne(com.data, {
      fields: ["commentaires"], // Just need the M2O field
    })
  );


  const commentId = relationData.value?.commentaires;
  // console.log("commentId", commentId);
  if (!commentId) return;

  // Step 2: fetch the actual commentaire
  const { data: commentData } = await useAsyncData(() =>
    $directus.items("commentaires").readOne(commentId)
  );

  // console.log("commentData", commentData.value);

  store.commentaires = commentData.value;
  // console.log("store.commentaires", store.commentaires);
  
  navStore.comID = commentId;
  navStore.comVisibility = true;
  navStore.navVisibility = false;
}
</script>

<style scoped>
mark {
  background-color: rgba(255, 230, 0, 0.4);
  padding: 0 4px;
  border-radius: 4px;
}
</style>