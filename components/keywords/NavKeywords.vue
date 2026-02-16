<template>
  <div class="w-80 min-w-80 max-w-80 flex flex-col h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Title -->
    <div class="flex items-center justify-between p-4 border-bs border-gray-100 dark:border-gray-800">
      <div class="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">
        <UIcon name="i-lucide-tags" class="w-4 h-4" />
        MOTS CLÉS
      </div>
      <UButton
        v-if="visible"
        icon="i-lucide-chevrons-left"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="navState.navVisibility = !navState.navVisibility"
        aria-label="Fermer le menu"
      />
    </div>

    <!-- Search Area -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <UInput
        v-model="searchQuery"
        icon="i-lucide-search"
        placeholder="Rechercher un mot-clé..."
        size="sm"
        class="w-full"
        clearable
      />
    </div>

    <!-- List Area -->
    <div class="flex-1 overflow-hidden h-96">
      <UScrollArea class="h-full">
        <div class="py-1">
          <button
            v-for="item in filteredItems"
            :key="item.id"
            type="button"
            class="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            :title="item.titre"
            @click="selectKeyword(item)"
          >
            <div class="flex items-center justify-between gap-2 w-full">
              <span :class="[
                'text-sm leading-snug truncate whitespace-nowrap',
                navState.selectedKeywordID === item.id ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
              ]">
                {{ item.titre }}
              </span>
              <UBadge
                v-if="item.commentaires?.length"
                color="neutral"
                variant="soft"
                size="sm"
                class="font-mono shrink-0"
              >
                {{ item.commentaires.length }}
              </UBadge>
            </div>
          </button>
        </div>
      </UScrollArea>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: true
  }
});

const globalState = useGlobalState();
const navState = useNavState();

const searchQuery = ref('');

const filteredItems = computed(() => {
  const keywords = Array.isArray(globalState.value.keywords)
    ? globalState.value.keywords
    : [];

  if (!searchQuery.value) return keywords;
  
  const query = searchQuery.value.toLowerCase();
  return keywords.filter(item => 
    item.titre?.toLowerCase().includes(query)
  );
});

function selectKeyword(selected) {
  if (!selected?.id) return;

  navState.value.selectedKeywordID = selected.id;
}
</script>
