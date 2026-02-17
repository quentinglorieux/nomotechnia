<template>
  <UDashboardPanel id="nav-keywords" resizable :min-size="20" :default-size="30" :max-size="40" class="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <template #header>
      <div class="flex flex-col w-full gap-4">
        <!-- Title -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 font-semibold text-lg mx-6 pt-2 text-gray-700 dark:text-gray-200 uppercase tracking-wider">
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
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Rechercher un mot-clé..."
          size="md"
          :ui="{ base: 'ps-6' }"
          class="w-full px-6"
          clearable
        />
      </div>
    </template>

    <!-- List Area -->
    <template #body>
      <div v-if="filteredItems.length" class="py-1 text-sm">
        <button
          v-for="item in filteredItems"
          :key="item.id"
          type="button"
          class="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
          :title="item.titre"
          @click="selectKeyword(item)"
        >
          <div class="flex items-center justify-between gap-2 w-full">
            <span :class="[
              'truncate whitespace-nowrap',
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
      <div v-else class="flex flex-col items-center justify-center p-8 text-center space-y-2">
        <UIcon name="i-lucide-tags" class="text-gray-300 dark:text-gray-700 text-3xl mb-2" />
        <p class="text-sm font-medium text-gray-500">Aucun mot-clé trouvé</p>
      </div>
    </template>
  </UDashboardPanel>
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
