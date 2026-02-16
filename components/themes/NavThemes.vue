<template>
  <div>
    <div v-if="visible" class="w-80 min-w-80 max-w-80 flex flex-col h-full border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-gray-200 uppercase tracking-wider">
          <UIcon name="i-lucide-list" class="w-4 h-4" />
          THEMES
        </div>
        <UButton
          icon="i-lucide-chevrons-left"
          variant="ghost"
          color="neutral"
          size="sm"
          @click="toggleNav"
          aria-label="Fermer le menu"
        />
    </div>

      <div class="p-4 border-b border-gray-100 dark:border-gray-800">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Rechercher un thème..."
          size="sm"
          class="w-full"
          clearable
        />
      </div>

      <div class="flex-1 overflow-hidden h-96">
        <UScrollArea class="h-full">
          <UTable
            :data="filteredItems"
            :columns="columns"
            sticky
            class="w-full"
            :ui="{
              thead: 'hidden',
              tr: 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
              td: 'py-3 px-4'
            }"
            @select="onRowSelect"
          >
            <template #titre-cell="{ row }">
              <button
                type="button"
                class="w-full text-left"
                @click="selectTheme(row.original)"
                :title="row.original.titre"
              >
                <div :class="[
                  'text-sm leading-snug truncate whitespace-nowrap',
                  navState.selectedThemeID === row.original.id ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
                ]">
                  {{ row.original.titre }}
                </div>
              </button>
            </template>
          </UTable>
        </UScrollArea>
      </div>
    </div>

    <div v-if="!visible" class="p-2 border-r border-gray-200 dark:border-gray-800 h-full bg-white dark:bg-gray-900">
      <UButton
        icon="i-lucide-chevrons-right"
        variant="ghost"
        color="neutral"
        size="md"
        @click="toggleNav"
        aria-label="Ouvrir le menu"
      />
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

const columns = [
  { accessorKey: 'titre', header: 'Titre' }
];

const listItems = computed(() => globalState.value.themes || []);

const filteredItems = computed(() => {
  if (!listItems.value.length) return [];
  if (!searchQuery.value) return listItems.value;
  
  const query = searchQuery.value.toLowerCase();
  return listItems.value.filter(item => 
    item.titre?.toLowerCase().includes(query)
  );
});

function toggleNav() {
  navState.value.navVisibility = !navState.value.navVisibility;
}

function selectTheme(selected) {
  if (!selected?.id) return;

  navState.value.selectedThemeID = selected.id;
}

const onRowSelect = (event) => {
  const selected = event?.row?.original ?? event?.row ?? event?.original ?? event;
  selectTheme(selected);
};
</script>
