<template>
  <div class="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 min-w-0">
    <!-- Welcome Screen -->
    <div v-if="!themeData" class="flex-1 flex items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-950">
      <UCard class="max-w-2xl shadow-xl border-dashed border-2 border-primary-200 dark:border-primary-800">
        <div class="flex flex-col items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-2">
            <UIcon name="i-lucide-list" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mt-0">Sélectionnez un Thème</h2>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-balance">
            Explorez les contenus par thématiques juridiques en sélectionnant un thème dans la liste à gauche.
          </p>
          <div class="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium mt-4">
            <UIcon name="i-lucide-arrow-left" class="animate-pulse" />
            Choisissez un thème pour commencer
          </div>
        </div>
      </UCard>
    </div>

    <!-- Theme Details -->
    <template v-else>
      <UScrollArea class="flex-1">
        <div class="p-6 space-y-8 w-full max-w-5xl mr-auto">
          <!-- Header -->
          <div class="border-b border-gray-100 dark:border-gray-800 pb-6">
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-start gap-3 break-words">
              <UIcon name="i-lucide-folder-root" class="text-primary-500" />
              {{ themeData.titre }}
            </h1>
          </div>

          <!-- Introduction -->
          <UCard :ui="{ body: 'prose dark:prose-invert max-w-none' }">
            <template #header>
              <div class="flex items-center gap-2 font-semibold">
                <UIcon name="i-lucide-info" class="text-primary-500" />
                Introduction
              </div>
            </template>
            <div v-if="themeData.introduction" v-html="themeData.introduction"></div>
            <p v-else class="text-sm text-gray-500 dark:text-gray-400 not-prose">
              Aucune introduction disponible pour ce thème.
            </p>
          </UCard>

          <!-- Sources -->
          <div class="space-y-4 min-h-40">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-bold flex items-center gap-2">
                <UIcon name="i-lucide-book" class="text-primary-500" />
                Sources associées
              </h2>
              <UBadge color="neutral" variant="soft" size="sm">{{ themeSources.length }}</UBadge>
            </div>

            <div v-if="themeSources.length" class="space-y-3">
              <UButton
                v-for="source in themeSources"
                :key="source.id"
                to="/sources"
                variant="soft"
                color="neutral"
                class="justify-start p-4 hover:ring-2 hover:ring-primary-500 transition-all rounded-xl border border-gray-100 dark:border-gray-800 group w-full"
                @click="updateRoute(source.id)"
              >
                <div class="flex items-center gap-3 w-full min-w-0">
                  <div class="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10">
                    <UIcon name="i-lucide-file-text" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate" :title="source.titre">{{ source.titre }}</span>
                  <UIcon name="i-lucide-arrow-right" class="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </UButton>
            </div>

            <UCard v-else>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Aucune source n’est associée à ce thème.
              </div>
            </UCard>
          </div>
        </div>
      </UScrollArea>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  theme: {
    type: [String, Number],
    default: null
  }
});

const navState = useNavState();
const { $directus } = useNuxtApp();

const { data: themeData } = await useAsyncData(`theme-detail-${props.theme}`, async () => {
  if (!props.theme) return null;
  return await $directus.request({
    method: 'GET',
    path: `/items/themes/${props.theme}`,
    params: {
      fields: ['id', 'titre', 'introduction', 'sources.id', 'sources.titre']
    }
  });
}, {
  watch: [() => props.theme]
});

const themeSources = computed(() => {
  return Array.isArray(themeData.value?.sources) ? themeData.value.sources : [];
});

function updateRoute(id) {
  navState.value.selectedSourceID = id;
}
</script>
