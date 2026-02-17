<template>
  <div class="h-full flex flex-col min-h-0">
    <!-- List View: Show if no specific comment is selected -->
    <div v-if="!navState.comID" class="p-3 pt-4 min-h-0 overflow-y-auto space-y-4">
      <div v-if="!commentairesSimples.length" class="text-xs text-gray-400 italic p-6 text-center bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Aucun commentaire pour cette source.
      </div>
      <div v-else class="space-y-2">
        <div v-for="com in commentairesSimples" :key="com.id">
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
    </div>

    <!-- Detail View: Show directly when an ID is present -->
    <div v-else class="flex-1 flex flex-col min-h-0 overflow-hidden relative">
      <CommentaireSide :com="navState.comID" />
    </div>
  </div>
</template>

<script setup>
import CommentaireSide from '../CommentaireSide.vue';

const props = defineProps(["source"]);
const navState = useNavState();

function openComment(com) {
  navState.value.comID = com.id;
}

const commentairesSimples = computed(() => {
  if (!props.source?.data?.commentaires) return [];
  return props.source?.data?.commentaires?.filter(
    (c) => c.type?.Nom?.toLowerCase() === "commentaire"
  ) || [];
});
</script>