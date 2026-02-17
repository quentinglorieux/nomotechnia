<template>
  <div class="h-full flex flex-col min-h-0">
    <div v-if="!comments?.length" class="p-6 text-center">
      <div class="text-xs text-gray-400 italic p-6 bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Aucun contenu disponible.
      </div>
    </div>

    <!-- Case 1: Multiple items (show list if no comment selected) -->
    <div v-else-if="comments.length > 1 && !navState.comID" class="p-3 pt-4 space-y-2 overflow-y-auto">
      <div 
        v-for="com in comments"
        :key="com.id"
      >
        <button
          class="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-gray-900 hover:bg-primary-100/10 dark:hover:bg-primary-900/20 transition-all group"
          @click="openComment(com)"
        >
          <div class="shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
            <UIcon name="i-lucide-file-text" class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400">
              {{ com.titre }}
            </div>
            <div v-if="com.meta" class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {{ com.meta }}
            </div>
          </div>
          <UIcon name="i-lucide-chevron-right" class="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors" />
        </button>
      </div>
    </div>

    <!-- Case 2: Singleton or item selected -->
    <div v-else class="flex-1 flex flex-col min-h-0 overflow-hidden relative">
      <!-- Only show back button if we are in a multi-item list mode -->
      <div v-if="comments.length > 1 && navState.comID" class="absolute top-2 left-4 z-30">

      </div>
      <CommentaireSide :com="selectedComId" />
    </div>
  </div>
</template>

<script setup>
import CommentaireSide from '../CommentaireSide.vue';

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  }
});

const navState = useNavState();

const selectedComId = computed(() => {
  // If a global comment is selected, show it
  if (navState.value.comID) return navState.value.comID;
  // If not, and we have a singleton, show the singleton
  if (props.comments.length === 1) return props.comments[0].id;
  return null;
});

function openComment(com) {
  navState.value.comID = com.id;
}
</script>