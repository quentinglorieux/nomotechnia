<template>
  
  <mark
    class="cursor-pointer bg-yellow-400/30 dark:bg-yellow-600/30 hover:bg-yellow-400/50 dark:hover:bg-yellow-600/50 px-1 rounded transition-colors"
    :data-linkedcomment="props.data"
    @click="() => retrieveComments(props)"
  >    
    <slot></slot>
  </mark>
</template>

<script setup>
const navState = useNavState();
const globalState = useGlobalState();

const props = defineProps({
  id: {},
  junction: {},
  collection: {},
  data: {}
});

const { $directus } = useNuxtApp();

async function retrieveComments(com) {
  if (!com?.data) return;

  try {
    // Step 1: fetch the related_comments record
    const relationData = await $directus.request({
      method: 'GET',
      path: `/items/related_comments/${com.data}`,
      params: {
        fields: ["commentaires"]
      }
    });

    const commentId = relationData?.commentaires;
    if (!commentId) return;

    // Step 2: fetch the actual commentaire
    const commentData = await $directus.request({
      method: 'GET',
      path: `/items/commentaires/${commentId}`
    });

    if (commentData) {
      globalState.value.commentaires = commentData;
      navState.value.comID = commentId;
      navState.value.comVisibility = true;
      navState.value.navVisibility = false;
    }
  } catch (error) {
    console.error('Error fetching related comment:', error);
  }
}
</script>