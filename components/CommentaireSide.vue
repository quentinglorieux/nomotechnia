<template>
  <div class="w-full">
    <div
      v-if="fetched_data"
      class="bg-slate-100 dark:bg-gray-800 p-4 rounded-lg shadow-sm"
      ref="pdfSection"
    >
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ fetched_data.titre }}</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ fetched_data.meta }}</p>
        </div>
        <UButton
          icon="i-lucide-file-text"
          label="Exporter PDF"
          color="neutral"
          variant="ghost"
          @click="handleExportPdf"
        />
      </div>

      <div v-if="fetched_data.abstract" class="bg-slate-200 dark:bg-gray-700/50 p-4 rounded-xl mb-6 border border-slate-300 dark:border-gray-600">
        <div class="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-200">
          <UIcon name="i-lucide-info" class="w-4 h-4" />
          <h3 class="font-bold text-sm uppercase tracking-wider">Résumé</h3>
        </div>
        <div class="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 font-medium italic" v-html="fetched_data.abstract"></div>
      </div>

      <div v-if="fetched_data.keywords_id?.length" class="mb-6">
        <div class="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
          <UIcon name="i-lucide-tags" class="w-4 h-4" />
          <span class="text-xs font-bold uppercase tracking-wider">Mots-clés</span>
        </div>
        <CommentsKeywords :kwList="fetched_data.keywords_id" />
      </div>

      <div 
        class="prose dark:prose-invert max-w-none mb-8 prose-ul:list-disc prose-ol:list-decimal prose-li:mb-2 prose-li:leading-relaxed" 
        v-html="fetched_data.content"
      ></div>

      <div
        v-if="globalState.commentaires?.references"
        class="bg-slate-200 dark:bg-gray-700 p-4 rounded-lg mb-6 mt-12"
      >
        <h3 id="references" class="font-semibold mb-3 dark:text-white">Références :</h3>
        <ul class="space-y-2">
          <li v-for="ref in globalState.commentaires.references" :key="ref.id" class="dark:text-gray-300">
            <span :id="'ref' + ref.id" class="text-sm"> [{{ ref.id }}] {{ ref.titre }} </span>
            <UButton
              :to="'#s' + ref.id"
              label="Retour"
              variant="link"
              size="xs"
              class="ml-2"
            />
          </li>
        </ul>
      </div>

      <div
        v-if="fetched_data.citation"
        class="bg-slate-300 dark:bg-gray-600 p-4 rounded-lg"
      >
        <h3 class="font-semibold mb-2 dark:text-white">Citation :</h3>
        <div class="prose prose-sm dark:prose-invert max-w-none italic" v-html="fetched_data.citation"></div>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center p-12 text-gray-500 animate-pulse">
      <UIcon name="i-lucide-loader-2" class="animate-spin w-8 h-8 mb-3 text-primary-500" />
      <p class="text-sm font-medium">Chargement du commentaire...</p>
    </div>
  </div>
</template>

<script setup>
import CommentsKeywords from './sources/CommentsKeywords.vue';

const pdfSection = ref(null);
const globalState = useGlobalState();
const prop = defineProps(["com"]);

const documentOptions = {
  orientation: "p",
  unit: "mm",
  format: "a4",
  putOnlyUsedFonts: true,
};

const options = {
  autoPaging: "text",
  width: 206,
  windowWidth: 950,
  margin: [4, 2, 4, 2],
};

async function handleExportPdf() {
  if (!import.meta.client || !pdfSection.value) return;

  const { exportToPDF } = await import('#imports');
  await exportToPDF('commentaire.pdf', pdfSection, documentOptions, options);
}

const fetched_data = ref();

// DataFetching of the selected Commentaires(id)
const { $directus } = useNuxtApp();
async function retrieveCommentData(id) {
  if (!id) return;
  try {
    const data = await $directus.request({
      method: 'GET',
      path: `/items/commentaires/${id}`,
      params: {
        fields: [
          "id",
          "titre",
          "citation",
          "abstract",
          "content",
          "auteur_type",
          "auteur_name",
          "references",
          "meta",
          "keywords_id.keywords_id.*"
        ]
      }
    });

    if (data) {
      fetched_data.value = data;
      if (!globalState.value.commentaires) globalState.value.commentaires = {};
      globalState.value.commentaires.titre = data.titre;
      globalState.value.commentaires.references = data.references;
    }
  } catch (error) {
    console.error('Error fetching comment data:', error);
  }
}

onMounted(() => {
  retrieveCommentData(prop.com);

  const hash = window.location.hash;
  if (hash) {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  const target = document.querySelector('#references');
  if (target) {
    const scrollParent = document.querySelector('.p-scrollpanel-content');
    if (scrollParent) {
      const offset = target.offsetTop;
      scrollParent.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }
});

watch(() => prop.com, (newId) => {
  retrieveCommentData(newId);
});
</script>

<style>
#ref1 {
  scroll-behavior: smooth;
}
</style>
