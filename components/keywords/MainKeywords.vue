<template>

  <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 min-w-0">
    <!-- Welcome Screen -->
    <div v-if="!kw" class="flex-1 flex items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-950">
      <UCard class="max-w-2xl shadow-xl border-dashed border-2 border-primary-200 dark:border-primary-800">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2">
            <UIcon name="i-lucide-tags" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-0">Navigation par Mots-clés</h2>
          <div class="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
            <p>
              Cette section vous permet d’explorer les grands arrêts britanniques à travers une sélection de <strong>mots-clés juridiques</strong>.
            </p>
            <p>
              Chaque mot-clé regroupe des commentaires associés à des décisions majeures, offrant une lecture transversale des enjeux doctrinaux et jurisprudentiels.
            </p>
          </div>
          <div class="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium mt-4">
            <UIcon name="i-lucide-arrow-left" class="animate-pulse" />
            Choisissez un mot-clé dans la liste à gauche
          </div>
        </div>
      </UCard>
    </div>

    <!-- Keyword Details -->
    <template v-else>
      <div class="flex-1">
        <div class="p-6 space-y-8 max-w-5xl mx-auto">
          <!-- Header -->
          <div class="border-b border-gray-100 dark:border-gray-800 pb-6">
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <UIcon name="i-lucide-tag" class="text-primary-500" />
              {{ kw.titre }}
            </h1>
          </div>

          <!-- Introduction -->
          <UCard v-if="kw.introduction" :ui="{ body: 'prose dark:prose-invert max-w-none' }">
            <template #header>
              <div class="flex items-center gap-2 font-semibold">
                <UIcon name="i-lucide-info" class="text-primary-500" />
                Introduction
              </div>
            </template>
            <div v-html="kw.introduction"></div>
          </UCard>

          <!-- Associated Comments Table -->
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 class="text-xl font-bold flex items-center gap-2">
                <UIcon name="i-lucide-message-square" class="text-primary-500" />
                Commentaires associés
              </h2>
              <UInput
                v-model="searchQuery"
                icon="i-lucide-search"
                placeholder="Filtrer..."
                size="md"
                :ui="{ base: 'ps-6' }"
                class="w-full px-6 sm:w-64"
                clearable
              />
            </div>

            <UTable
              v-if="filteredComments.length > 0"
              :data="filteredComments"
              :columns="columns"
              class="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden"
              :ui="{
                thead: 'bg-gray-50 dark:bg-gray-800/50',
                tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                td: 'py-4'
              }"
            >
              <!-- Commentaire -->
              <template #commentaire-cell="{ row }">
                <NuxtLink
                  to="/sources"
                  class="font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  @click="navigateToComment(row.original.commentaires_id)"
                  
                >
                  {{ row.original.commentaires_id?.titre || 'Sans titre' }}
                </NuxtLink>
              </template>

              <!-- Source -->
              <template #source-cell="{ row }">
                <NuxtLink
                  v-if="row.original.commentaires_id?.source_id?.id"
                  to="/sources"
                  class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                  @click="navigateToSource(row.original.commentaires_id.source_id.id)"
                >
                  {{ row.original.commentaires_id.source_id.titre || 'Source sans titre' }}
                </NuxtLink>
                <span v-else class="text-sm text-gray-400">—</span>
              </template>

              <!-- Auteur -->
              <template #auteur-cell="{ row }">
                <NuxtLink
                  v-if="row.original.commentaires_id?.auteur_id?.last_name"
                  :to="`/auteur-${row.original.commentaires_id.auteur_id.last_name}`"
                  class="text-sm font-semibold hover:text-primary-600 dark:hover:text-primary-400"
                >
               
                  {{ row.original.commentaires_id.auteur_id.first_name }} {{ row.original.commentaires_id.auteur_id.last_name }}
                </NuxtLink>
                <span v-else class="text-sm text-gray-400">—</span>
              </template>

              <!-- Action -->
              <template #action-cell="{ row }">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-book-open"
                  label="Lire"
                  :disabled="!row.original.commentaires_id?.id"
                  @click="openSidebar(row.original.commentaires_id?.id)"
                />
              </template>
            </UTable>

            <!-- Empty State -->
            <div v-else class="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl space-y-4">
              <div class="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <UIcon name="i-lucide-message-square-off" class="text-gray-400 text-xl" />
              </div>
              <div class="text-center">
                <p class="text-lg font-semibold text-gray-900 dark:text-white">Aucun commentaire associé</p>
                <p class="text-sm text-gray-500">Essayez un autre mot-clé ou modifiez vos filtres.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Slideover for Comment Side -->
    <USlideover
      v-model:open="isSidebarOpen"
      title="Détails du commentaire"
      :ui="{ width: 'max-w-xl' }"
    >
      <div class="h-full bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <CommentaireSide v-if="selectedComId" :com="selectedComId" @close="isSidebarOpen = false" />
      </div>
    </USlideover>
  </div>
</template>

<script setup>
const { $directus } = useNuxtApp();

const props = defineProps({
  sourceID: {
    type: [String, Number],
    default: null
  }
});

const globalState = useGlobalState();
const navState = useNavState();

const isSidebarOpen = ref(false);
const selectedComId = ref(null);
const searchQuery = ref('');

const { data: commentsData } = await useAsyncData('keywords-commentaires', async () => {
  const response = await $directus.request({
    method: 'GET',
    path: '/items/commentaires',
    params: {
      fields: [
        'id',
        'titre',
        'auteur_id.first_name',
        'auteur_id.last_name',
        'source_id.id',
        'source_id.titre',
        'keywords_id.keywords_id.id'
      ],
      sort: ['titre']
    }
  });

  return Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];
});

const kw = computed(() => {
  const keywords = Array.isArray(globalState.value.keywords)
    ? globalState.value.keywords
    : [];

  const selectedKeywordId = props.sourceID || navState.value.selectedKeywordID;

  return keywords.find(k => k.id == selectedKeywordId) || null;
});

const columns = [
  { accessorKey: 'commentaires_id.titre', header: 'Commentaire', class: 'min-w-[300px]' },
  { accessorKey: 'commentaires_id.source_id.titre', header: 'Source', class: 'min-w-[200px]' },
  { accessorKey: 'commentaires_id.auteur_id', header: 'Auteur', class: 'min-w-[150px]' },
  { accessorKey: 'action', header: '', class: 'w-20' }
];

const filteredComments = computed(() => {
  const selectedKeywordId = kw.value?.id;

  const directRelationComments = Array.isArray(kw.value?.commentaires)
    ? kw.value.commentaires
      .filter((item) => item?.commentaires_id)
      .map((item) => item.commentaires_id)
    : [];

  const fallbackComments = Array.isArray(commentsData.value)
    ? commentsData.value.filter((comment) => {
      if (!Array.isArray(comment?.keywords_id) || !selectedKeywordId) return false;

      return comment.keywords_id.some((relation) => {
        const relatedKeywordId = relation?.keywords_id?.id ?? relation?.keywords_id;
        return String(relatedKeywordId) === String(selectedKeywordId);
      });
    })
    : [];

  const normalizedRows = (directRelationComments.length ? directRelationComments : fallbackComments)
    .map((comment) => ({ commentaires_id: comment }));

  if (!searchQuery.value) return normalizedRows;

  const query = searchQuery.value.toLowerCase();
  return normalizedRows.filter(c => {
    const com = c.commentaires_id;
    return (
      com?.titre?.toLowerCase().includes(query) ||
      com?.source_id?.titre?.toLowerCase().includes(query) ||
      com?.auteur_id?.first_name?.toLowerCase().includes(query) ||
      com?.auteur_id?.last_name?.toLowerCase().includes(query)
    );
  });
});

function openSidebar(id) {
  if (!id) return;
  selectedComId.value = id;
  isSidebarOpen.value = true;
}

function navigateToSource(id) {
  if (!id) return;
  navState.value.selectedSourceID = id;
  navState.value.comVisibility = false;
}

function navigateToComment(com) {
  if (!com?.id || !com?.source_id?.id) return;
  navState.value.selectedSourceID = com.source_id.id;
  navState.value.comID = com.id;
  navState.value.comVisibility = true;
  navState.value.navVisibility = false;
}
</script>
