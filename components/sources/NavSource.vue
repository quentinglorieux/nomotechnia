<template>
  <UDashboardPanel
    id="nav-sources"
    resizable
    :min-size="20"
    :default-size="28"
    :max-size="40"
    class="w-80 min-w-80 max-w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
  >
    <template #header>
      <div class="flex flex-col w-full gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 font-semibold text-lg mx-6 pt-2 text-gray-700 dark:text-gray-200 uppercase tracking-wider">
            <UIcon name="i-lucide-library" class="w-4 h-4" />
            SOURCES
          </div>
          <UButton
            v-if="visible"
            icon="i-lucide-chevrons-left"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="toggleNav"
            aria-label="Fermer le menu"
          />
        </div>

        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Rechercher une source..."
          size="md"
          :ui="{ base: 'ps-6' }"
          class="w-full px-6"
          clearable
        />
      </div>
    </template>

    <template #body>
      <UScrollArea class="h-full">
        <div class="py-1">
          <button
            v-for="item in filteredItems"
            :key="item.id"
            type="button"
            class="w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            :title="item.titre"
            @click="selectSource(item)"
          >
            <div class="flex items-center justify-between gap-2 w-full">
              <span :class="[
                'text-sm leading-snug truncate whitespace-nowrap',
                navState.selectedSourceID === item.id ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
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
      <div v-if="!filteredItems.length" class="p-4 text-sm text-gray-500 dark:text-gray-400 italic">
        Aucune source trouvée.
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

const listItems = computed(() => Array.isArray(globalState.value.sources) ? globalState.value.sources : []);

const filteredItems = computed(() => {
  if (!searchQuery.value) return listItems.value;

  const query = searchQuery.value.toLowerCase();
  return listItems.value.filter(item =>
    item.titre?.toLowerCase().includes(query)
  );
});

function toggleNav() {
  navState.value.navVisibility = !navState.value.navVisibility;
}

function selectSource(selected) {
  if (!selected?.id) return;

  navState.value.selectedSourceID = selected.id;
  navState.value.comVisibility = false;
}
</script>
