<template>
  <UDashboardSidebar
    id="nav-keywords"
    v-model:open="navState.navOpen"
    v-model:collapsed="isCollapsed"
    collapsible
    resizable
    side="left"
    :width="300"
    :ui="{ root: 'relative hidden md:flex flex-col shrink-0 border-e border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900' }"
    class="bg-white dark:bg-gray-900"
  >
    <template #header>
      <div class="flex items-center gap-3 w-full px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur shrink-0">
        <UDashboardSidebarCollapse class="hidden md:flex" />
        <div class="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">
          <UIcon name="i-lucide-tags" class="w-4 h-4" />
          MOTS CLÉS
        </div>
      </div>
    </template>

    <div class="p-4 pb-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
      <UInput
        v-model="searchQuery"
        leading
        placeholder="Rechercher..."
        size="md"
        variant="subtle"
        class="w-full"
      />
    </div>

    <UScrollArea class="flex-1 min-h-0">
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <button
          v-for="item in filteredItems"
          :key="item.id"
          class="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group relative"
          :class="navState.selectedKeywordID === item.id ? 'bg-primary-50 dark:bg-primary-900/10' : ''"
          @click="selectKeyword(item)"
        >
          <div v-if="navState.selectedKeywordID === item.id" class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500" />
          
          <div class="flex items-center justify-between gap-2">
            <span 
              class="text-sm font-medium line-clamp-2 leading-snug"
              :class="navState.selectedKeywordID === item.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-200'"
            >
              {{ item.titre }}
            </span>
            <UBadge
              v-if="item.commentaires?.length"
              :label="item.commentaires.length"
              color="primary"
              variant="subtle"
              size="sm"
              class="shrink-0 rounded-full font-bold px-2"
            />
          </div>
        </button>
      </div>

      <div v-if="!filteredItems.length" class="p-8 text-center text-sm text-gray-500 dark:text-gray-400 italic">
        <UIcon name="i-lucide-search-x" class="w-8 h-8 mb-2 mx-auto opacity-20" />
        Aucun mot-clé trouvé
      </div>
    </UScrollArea>
  </UDashboardSidebar>
</template>

<script setup>
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

const isCollapsed = computed({
  get: () => !navState.value.navVisibility,
  set: (val) => {
    navState.value.navVisibility = !val;
  }
});

function selectKeyword(selected) {
  if (!selected?.id) return;
  navState.value.selectedKeywordID = selected.id;
  navState.value.navOpen = false;
}
</script>
