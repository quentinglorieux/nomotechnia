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
            <div 
              class="text-sm font-medium line-clamp-2 transition-colors"
              :class="selectedCommentId === com.id ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-gray-700 dark:text-gray-200'"
            >
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
  targetComId: {
    type: [String, Number],
    default: null
  }
});

const globalState = useGlobalState();
const { $directus } = useNuxtApp();

const loadingStates = ref({});
const selectedCommentId = ref(null);

async function selectComment(com) {
  if (!com?.id) return;
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
  () => props.targetComId,
  (newId) => {
    if (newId) {
      const com = props.comments.find(c => c.id === newId);
      if (com) {
        selectComment(com);
      }
    }
  },
  { immediate: true }
);

watch(
  () => props.comments,
  (comments) => {
    if (!comments?.length) {
      selectedCommentId.value = null;
      return;
    }

    // External target takes priority
    if (props.targetComId) {
      const targetCom = comments.find(c => c.id === props.targetComId);
      if (targetCom) {
        selectComment(targetCom);
        return;
      }
    }

    // Check if current selection is still valid for this set of comments
    const stillExists = comments.some(c => c.id === selectedCommentId.value);
    if (!stillExists || !selectedCommentId.value) {
      selectComment(comments[0]);
    }
  },
  { immediate: true, deep: true }
);
</script>