<template>
  <div class="p-3 pt-4 space-y-4">
    <div v-if="!comments.length" class="text-sm text-gray-500 italic p-4 text-center">
      Aucun contenu disponible.
    </div>
    <div v-else>
      <div v-if="comments.length > 1">
        <div 
          v-for="com in comments"
          :key="com.id"
          class="mb-2"
        >
          <button
            class="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            @click="selectComment(com)"
          >
            <UButton
              size="sm"
              color="neutral"
              variant="soft"
              icon="i-lucide-eye"
              :loading="loadingStates[com.id]"
              class="shrink-0 pointer-events-none"
            />
            <div class="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-2">
              {{ com.titre }}
            </div>
          </button>
        </div>
      </div>

      <CommentaireSide
        v-if="selectedCommentId"
        :com="selectedCommentId"
        :key="selectedCommentId"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
});

const globalState = useGlobalState();
const { $directus } = useNuxtApp();

const loadingStates = ref({});
const selectedCommentId = ref(null);

async function selectComment(com) {
  const id = com.id;
  selectedCommentId.value = id;
  loadingStates.value[id] = true;
  
  try {
    const data = await $directus.request({
      method: 'GET',
      path: `/items/commentaires/${id}`
    });
    
    if (data) {
      globalState.value.commentaires = data;
    }
  } catch (error) {
    console.error('Error fetching generic comment:', error);
  } finally {
    loadingStates.value[id] = false;
  }
}

watch(
  () => props.comments,
  (comments) => {
    if (!comments.length) {
      selectedCommentId.value = null;
      return;
    }

    const hasSelected = comments.some((c) => c.id === selectedCommentId.value);
    if (!hasSelected) {
      selectComment(comments[0]);
    }
  },
  { immediate: true, deep: true }
);
</script>