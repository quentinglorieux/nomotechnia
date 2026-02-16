<template>
  <UContainer class="py-8">
    <div v-if="pending" class="flex items-center justify-center min-h-[400px]">
      <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <div v-else-if="author" class="space-y-8 max-w-5xl mx-auto">
      <!-- Author Header -->
      <div class="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
        <div
          v-if="author.avatar"
          class="w-52 h-52 rounded-full overflow-hidden ring-4 ring-primary-50 dark:ring-primary-900/20 shrink-0"
        >
          <img
            :src="'https://admin.nomotechnia.rubidiumweb.fr/assets/' + author.avatar + '?fit=cover&width=320&height=320&quality=80'"
            :alt="`${author.first_name} ${author.last_name}`"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="text-center sm:text-left space-y-2">
          <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {{ author.first_name }} {{ author.last_name }}
          </h1>
          <div class="flex items-center justify-center sm:justify-start gap-2 text-primary-600 dark:text-primary-400 font-medium">
            <UIcon name="i-lucide-award" />
            <span>Auteur contributeur</span>
          </div>
        </div>
      </div>

      <!-- Biography -->
      <UCard v-if="author.short_cv">
        <template #header>
          <div class="flex items-center gap-2 font-bold text-gray-900 dark:text-gray-100">
            <UIcon name="i-lucide-scroll" class="text-primary-500" />
            Biographie
          </div>
        </template>
        <div class="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          {{ author.short_cv }}
        </div>
      </UCard>

      <!-- Comments List -->
      <div class="space-y-4">
        <h2 class="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <UIcon name="i-lucide-message-square" class="text-primary-500" />
          Commentaires publiés
        </h2>

        <UTable
          :data="comments"
          :columns="columns"
          class="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
          :ui="{
            thead: 'bg-gray-50 dark:bg-gray-800/50',
            tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
            td: 'py-4 px-6'
          }"
        >
          <!-- Commentaire -->
          <template #titre-cell="{ row }">
            <NuxtLink
              to="/sources"
              class="font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              @click="navigateToComment(row.original)"
            >
              {{ row.original.titre }}
            </NuxtLink>
          </template>

          <!-- Source -->
          <template #source-cell="{ row }">
            <NuxtLink
              to="/sources"
              class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors flex items-center gap-1"
              @click="navigateToSource(row.original.source_id.id)"
            >
              <UIcon name="i-lucide-book" class="w-3.5 h-3.5" />
              {{ row.original.source_id.titre }}
            </NuxtLink>
          </template>

          <!-- Action -->
          <template #action-cell="{ row }">
            <div class="flex justify-end">
              <UButton
                size="sm"
                color="neutral"
                variant="ghost"
                icon="i-lucide-eye"
                label="Consulter"
                @click="openSlideover(row.original.id)"
              />
            </div>
          </template>
        </UTable>
      </div>
    </div>

    <!-- Slideover for Comment Side -->
    <USlideover
      v-model:open="isSlideoverOpen"
      title="Aperçu du commentaire"
      :ui="{ width: 'max-w-xl' }"
    >
      <div class="h-full bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        <CommentaireSide v-if="selectedComId" :com="selectedComId" @close="isSlideoverOpen = false" />
      </div>
    </USlideover>
  </UContainer>
</template>

<script setup>
const route = useRoute();
const navState = useNavState();
const { $directus } = useNuxtApp();

const isSlideoverOpen = ref(false);
const selectedComId = ref(null);

// Columns for the table
const columns = [
  { accessorKey: 'titre', header: 'Commentaire' },
  { accessorKey: 'source', header: 'Source' },
  { accessorKey: 'action', header: '', class: 'w-32' }
];

// Fetch Author Data
const { data: authorData, pending } = await useAsyncData(`author-${route.params.id}`, async () => {
  const [userData, commentsData] = await Promise.all([
    $directus.request({
      method: 'GET',
      path: '/users',
      params: {
        fields: ['id', 'first_name', 'last_name', 'avatar', 'short_cv'],
        filter: { last_name: { _eq: route.params.id } }
      }
    }),
    $directus.request({
      method: 'GET',
      path: '/items/commentaires',
      params: {
        fields: ['id', 'titre', 'source_id.titre', 'source_id.id'],
        filter: {
          auteur_id: { last_name: { _eq: route.params.id } },
          status: { _eq: 'published' }
        }
      }
    })
  ]);

  return {
    author: userData?.[0],
    comments: commentsData || []
  };
});

const author = computed(() => authorData.value?.author);
const comments = computed(() => authorData.value?.comments);

function navigateToSource(id) {
  navState.value.selectedSourceID = id;
  navState.value.comVisibility = false;
}

function navigateToComment(com) {
  navState.value.selectedSourceID = com.source_id.id;
  navState.value.comID = com.id;
  navState.value.comVisibility = true;
  navState.value.navVisibility = false;
}

function openSlideover(id) {
  selectedComId.value = id;
  isSlideoverOpen.value = true;
}
</script>
