<template>
  <UDashboardPanel grow class="bg-white dark:bg-gray-900 border-none overflow-hidden">
    <!-- Main Source Header -->
    <template v-if="source" #header>
      <div class="flex flex-col min-w-0">
        <div class="flex items-center gap-3 min-w-0 bg-slate-200">
          <h1 class="text-xl font-bold text-gray-100 bg-slate-900 dark:text-slate-900 dark:bg-slate-100 px-3 py-10 w-4/5">
            {{ source.data.titre }}
          </h1>
          <UBadge v-if="source.data.type_de_source" color="neutral" variant="soft" size="sm" class="shrink-0 pr-2 w-1/5">
            {{ source.data.type_de_source.Nom }}
          </UBadge>
        </div>
        <p v-if="source.data.meta" class="text-sm font-medium text-gray-100 pl-3 py-2 bg-slate-500 dark:text-gray-400 ">{{ source.data.meta }}</p>
      </div>
    </template>

    <!-- Main Body -->
    <template #body>
      <!-- Info Section if no source selected -->
      <div v-if="!source" class="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-950/50">
        <div class="max-w-md space-y-6">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-2">
            <UIcon name="i-lucide-book-open" class="w-10 h-10" />
          </div>
          
          <div class="space-y-2">
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
              Sélectionnez une Source
            </h3>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
              Cette section répertorie les principales décisions de justice britanniques analysées sur Nomotechnia.
            </p>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">
              Cliquez sur une source pour accéder à sa fiche complète : texte de l’arrêt, commentaires, notions juridiques et liens associés.
            </p>
          </div>
        </div>
      </div>

      <!-- Content Split View -->
      <div v-else class="flex-1 min-h-0 flex overflow-hidden h-full">
        <!-- Panel 1: Content -->
        <div class="flex-1 min-w-0 overflow-y-auto bg-white dark:bg-gray-900">
          <div class="p-8 max-w-4xl mx-auto w-full">
            <div v-if="source.data.content" class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert prose-slate prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none">
              <FlexibleEditorContent :content="source.data.content" :relation-marks="relationMarks" />
            </div>
            <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 italic">
              <UIcon name="i-lucide-file-text" class="w-12 h-12 mb-4 opacity-20" />
              Aucun contenu disponible pour cette source
            </div>

            <!-- PDF Download Card -->
            <UCard v-if="source.data.fichiers?.length" class="mt-8 border-gray-200 dark:border-gray-800">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Documents associés</h3>
                </div>
              </template>
              
              <ul class="space-y-2">
                <li
                  v-for="(file, index) in source.data.fichiers"
                  :key="file.directus_files_id"
                  class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300 truncate mr-4">
                    {{ file.directus_files_id.filename_download || `Document ${index + 1}` }}
                  </span>
                  <UButton
                    :to="`${baseUrl}/assets/${file.directus_files_id.id}`"
                    target="_blank"
                    download
                    icon="i-lucide-download"
                    label="Télécharger"
                    size="xs"
                    color="neutral"
                    variant="soft"
                    class="shrink-0"
                  />
                </li>
              </ul>
            </UCard>
          </div>
        </div>

        <!-- Panel 2: Details & Links -->
        <div class="w-[34rem] min-w-md max-w-[42vw] border-l border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col min-h-0 overflow-hidden">
          <div class="flex-1 flex flex-col min-h-0 overflow-hidden relative h-full">
            <UTabs :items="sourceTabs" v-model="activeTabIndex" class="flex-1 flex flex-col overflow-hidden min-h-0 h-full">
              <template #content="{ item }">
                <div class="flex-1 p-4 min-h-0 overflow-y-auto h-full">
                  <div v-if="item.slot === 'before-tabs'">
                    <SourceGenericComments :comments="getCommentsByType(item.label)" />
                  </div>
                  
                  <div v-else-if="item.slot === 'main-comments'">
                    <SourceComments
                      v-if="source?.data?.commentaires"
                      :source="source"
                      :comSelected="globalState.commentaires"
                    />
                  </div>

                  <div v-else-if="item.slot === 'keywords'">
                    <SourceKeywords :source="source" />
                  </div>

                  <div v-else-if="item.slot === 'themes'">
                    <SourceThemes :source="source" />
                  </div>

                  <div v-else-if="item.slot === 'after-tabs'">
                    <SourceGenericComments :comments="getCommentsByType(item.label)" />
          
                  </div>
                
                </div>
              </template>
            </UTabs>

            <div 
              v-if="navState.comVisibility" 
              class="absolute inset-0 bg-white dark:bg-gray-900 z-10 border-t border-gray-200 dark:border-gray-800 flex flex-col min-h-0 shadow-2xl transition-all duration-300"
            >
              <div class="flex items-center justify-between p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                <div class="truncate font-semibold px-2 text-sm text-gray-700 dark:text-gray-200">
                  {{ comTitre }}
                </div>
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  @click="navState.comVisibility = false"
                />
              </div>
              <UTabs :items="commentDetailTabs" class="flex-1 flex flex-col overflow-hidden min-h-0">
                <template #content="{ item }">
                  <div class="flex-1 p-4 min-h-0 overflow-y-auto h-full">
                    <div v-if="item.slot === 'content'">
                      <CommentaireSide :com="navState.comID" />
                    </div>
                    <div v-else-if="item.slot === 'keywords'">
                      <CommentsKeywords :kwList="kwSelectectComment" />
                    </div>
                  </div>
                </template>
              </UTabs>
           
            </div>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import { injectDataIntoContent } from "directus-extension-flexible-editor/content";
import FlexibleEditorContent from "directus-extension-flexible-editor/content/vue";
import RelatedComment from "./RelatedComment.vue";
import SourceGenericComments from "./SourceGenericComments.vue";
import SourceComments from "./SourceComments.vue";
import SourceKeywords from "./SourceKeywords.vue";
import SourceThemes from "./SourceThemes.vue";
import CommentaireSide from "../CommentaireSide.vue";
import CommentsKeywords from "./CommentsKeywords.vue";

const navState = useNavState();
const globalState = useGlobalState();
const config = useRuntimeConfig();
const baseUrl = config.public.API_BASE_URL;
const { $directus } = useNuxtApp();

const props = defineProps(["sourceID"]);
const source = ref();
const oldID = ref();
const activeTabIndex = ref('Commentaires'); // Default to 'Commentaires' tab

// Tab items for the source (right pane)
const sourceTabs = computed(() => {
  const tabs = [];
  
  // Before tabs
  commentTypesBefore.value.forEach(typeNom => {
    tabs.push({ label: typeNom, value: typeNom, slot: 'before-tabs' });
  });

  // Main tabs
  tabs.push({ label: 'Commentaires', value: 'Commentaires', slot: 'main-comments' });
  tabs.push({ label: 'Mots-clés', value: 'Mots-clés', slot: 'keywords' });
  tabs.push({ label: 'Thèmes', value: 'Thèmes', slot: 'themes' });

  // After tabs
  commentTypesAfter.value.forEach(typeNom => {
    tabs.push({ label: typeNom, value: typeNom, slot: 'after-tabs' });
  });

  return tabs;
});

// Tab items for the selected comment detail
const commentDetailTabs = computed(() => [
  { label: comTitre.value || 'Détail', slot: 'content', icon: 'i-lucide-file-text' },
  { label: 'Mots-clés associés', slot: 'keywords', icon: 'i-lucide-tags' }
]);

const comTitre = computed(() => {
  if (globalState.value.commentaires?.titre) {
    return globalState.value.commentaires.titre.length > 35 
      ? globalState.value.commentaires.titre.substring(0, 35) + "..." 
      : globalState.value.commentaires.titre;
  }
  return "";
});

// Data fetching
async function retrieveSourceData(id) {
  const { data } = await useAsyncData(`source-${id}`, () => {
    return $directus.request({
      method: 'GET',
      path: `/items/sources/${id}`,
      params: {
        fields: [
          "id", "titre", "type_de_source.*", "meta", 
          "fichiers.directus_files_id.id", "fichiers.directus_files_id.filename_download", 
          "texte", "content", "editor_nodes.id", "editor_nodes.item", "editor_nodes.collection", 
          "commentaires.*", "commentaires.type.*", "commentaires.keywords_id.keywords_id.*",
          "theme_id.titre", "theme_id.id"
        ]
      }
    });
  });

  if (data.value) {
    source.value = { data: data.value };
    activeTabIndex.value = 'Commentaires';
    
    if (source.value.data.editor_nodes && source.value.data.content) {
      injectDataIntoContent(
        source.value.data.editor_nodes,
        source.value.data.content
      );
    }

    const index = globalState.value.sources.findIndex((x) => x.id === id);
    if (index !== -1) {
      globalState.value.sources[index] = source.value.data;
    } else {
      globalState.value.sources.push(source.value.data);
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  if (navState.value.selectedSourceID) {
    retrieveSourceData(navState.value.selectedSourceID);
    oldID.value = navState.value.selectedSourceID;
  }
});

watch(() => navState.value.selectedSourceID, (newVal) => {
  if (newVal && newVal !== oldID.value) {
    navState.value.comVisibility = false;
    activeTabIndex.value = commentTypesBefore.value.length;
    retrieveSourceData(newVal);
    oldID.value = newVal;
  }
});

// Helpers
function getCommentsByType(typeNom) {
  if (!source.value?.data?.commentaires) return [];
  const normalizeType = (value) => String(value || '').trim().toLowerCase();
  return source.value.data.commentaires.filter(
    (c) => normalizeType(c.type?.Nom) === normalizeType(typeNom)
  );
}

const kwSelectectComment = computed(() => {
  if (!navState.value.selectedSourceID || !navState.value.comID) return [];
  const dataSource = globalState.value.sources.find((x) => x.id === navState.value.selectedSourceID);
  if (!dataSource || !dataSource.commentaires) return [];
  const dataSelectedComment = dataSource.commentaires.find((x) => x.id === navState.value.comID);
  return dataSelectedComment ? dataSelectedComment.keywords_id : [];
});

const commentairePosition = computed(() => {
  const commentaire = source.value?.data?.commentaires?.find(
    (c) => c.type?.Nom === "Commentaire"
  );
  return commentaire?.type?.sort ?? 0;
});

const commentTypesBefore = computed(() => {
  const raw = source.value?.data?.commentaires || [];
  const entries = raw
    .filter((c) => c.type?.Nom !== "Commentaire")
    .map((c) => ({
      nom: c.type.Nom,
      pos: c.type.sort ?? 999,
    }));

  const unique = new Map();
  entries.forEach(({ nom, pos }) => {
    if (!unique.has(nom)) unique.set(nom, pos);
  });

  return Array.from(unique.entries())
    .filter(([_, pos]) => pos < commentairePosition.value)
    .sort((a, b) => a[1] - b[1])
    .map(([nom]) => nom);
});

const commentTypesAfter = computed(() => {
  const raw = source.value?.data?.commentaires || [];
  const entries = raw
    .filter((c) => c.type?.Nom !== "Commentaire")
    .map((c) => ({
      nom: c.type.Nom,
      pos: c.type.sort ?? 999,
    }));

  const unique = new Map();
  entries.forEach(({ nom, pos }) => {
    if (!unique.has(nom)) unique.set(nom, pos);
  });

  return Array.from(unique.entries())
    .filter(([_, pos]) => pos > commentairePosition.value)
    .sort((a, b) => a[1] - b[1])
    .map(([nom]) => nom);
});

const relationMarks = [
  { collection: "related_comments", component: RelatedComment },
];

</script>
