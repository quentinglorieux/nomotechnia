<template>
    <UDashboardGroup>
  <UDashboardPanel grow class="bg-white dark:bg-gray-900 border-none overflow-hidden resizable">
    <!-- Main Source Header -->
    <template #header>
      <div v-if="source?.data" class="flex items-center gap-3 w-full px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur shrink-0">
        <UDashboardSidebarToggle class="md:hidden" />
        <UDashboardSidebarCollapse class="hidden md:flex" />
        
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-bold text-gray-900 dark:text-white truncate">
              {{ source?.data?.titre || 'Chargement...' }}
            </h1>
            <UBadge v-if="source?.data?.type_de_source" color="neutral" variant="soft" size="xs" class="shrink-0 uppercase tracking-tighter text-[10px]">
              {{ source?.data?.type_de_source?.Nom }}
            </UBadge>
          </div>
          <p v-if="source?.data?.meta" class="text-xs text-gray-500 dark:text-gray-400 truncate font-medium">{{ source?.data?.meta }}</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Add any extra header buttons here -->
        </div>
      </div>
      <div v-else class="flex items-center gap-3 w-full px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur shrink-0">
        <UDashboardSidebarToggle class="md:hidden" />
        <UDashboardSidebarCollapse class="hidden md:flex" />
        <span class="text-sm font-medium text-gray-500 italic">Sélectionnez une source...</span>
      </div>
    </template>

    <!-- Main Body -->
    <template #body>
      <!-- Info Section if no source selected -->
      <div v-if="!source?.data" class="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-950/50">
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

      <!-- Content Split View using Dashboard Components -->
      <UDashboardGroup v-else grow class="flex-1 h-full min-h-0 overflow-hidden">
        <!-- Panel 1: Content -->
        <UDashboardPanel grow :min-size="300" class="min-w-0 bg-white dark:bg-gray-900 overflow-y-auto">
          <div v-if="source?.data" class="p-8 max-w-4xl mx-auto w-full">
            <div v-if="source?.data?.content" class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert prose-slate prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none">
              <FlexibleEditorContent :content="source?.data?.content" :relation-marks="relationMarks" />
            </div>
            <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 italic">
              <UIcon name="i-lucide-file-text" class="w-12 h-12 mb-4 opacity-20" />
              Aucun contenu disponible pour cette source
            </div>

            <!-- PDF Download Card -->
            <UCard v-if="source?.data?.fichiers?.length" class="mt-8 border-gray-200 dark:border-gray-800">
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
        </UDashboardPanel>

        <!-- Panel 2: Details & Links (Categories & Comments) -->
        <UDashboardSidebar 
          id="source-details-panel"
          collapsible 
          resizable 
          side="right"
          :width="400"
          :ui="{ root: 'relative hidden md:flex flex-col shrink-0 border-s border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl' }"
          class="bg-white dark:bg-gray-900 shadow-xl"
        >
          <div v-if="source?.data" class="flex-1 flex flex-col min-h-0 relative">
            <!-- Context 1: Comment Detail view (Priority) -->
            <div v-if="navState.comID" class="flex-1 flex flex-col min-h-0 bg-white dark:bg-gray-900 z-10 overflow-hidden">
              <div class="p-2 border-b border-gray-100 dark:border-gray-800 shrink-0 flex items-center bg-gray-50/50 dark:bg-gray-800/50">
                <UButton
                  icon="i-lucide-arrow-left"
                  variant="ghost"
                  color="gray"
                  size="xs"
                  label="Retour aux textes"
                  @click="closeComment"
                />
              </div>
              <div class="flex-1 overflow-hidden">
                <CommentaireSide :com-id="navState.comID" />
              </div>
            </div>

            <!-- Context 2: Category Tabs (Default) -->
            <div v-else class="flex-1 flex flex-col min-h-0">
              <UTabs 
                v-model="activeTabIndex" 
                :items="sourceTabs" 
                class="flex-1 flex flex-col min-h-0"
                :ui="{ 
                  root: 'flex flex-col h-full',
                  list: 'shrink-0 px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur',
                  content: 'flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-900',
                  trigger: 'px-3 py-1.5 text-xs font-bold uppercase tracking-wider'
                }"
              >
                <template #content="{ item }">
                  <div class="flex-1 min-h-0 overflow-y-auto p-0">
                    <!-- Standard main comments -->
                    <div v-if="item.value === 'Commentaires'">
                      <SourceComments
                        v-if="source?.data?.commentaires"
                        :source="source"
                        :target-com-id="navState.comID"
                      />
                    </div>
                    
                    <!-- Keyword management -->
                    <div v-else-if="item.value === 'Mots-clés'">
                      <SourceKeywords :source="source" />
                    </div>

                    <!-- Theme management -->
                    <div v-else-if="item.value === 'Thèmes'">
                      <SourceThemes :source="source" />
                    </div>

                    <!-- Dynamic generic comments (Avant-propos, etc.) -->
                    <div v-else>
                      <SourceGenericComments 
                        :comments="getCommentsByType(item.value)" 
                        :target-com-id="navState.comID"
                      />
                    </div>
                  </div>
                </template>
              </UTabs>
            </div>
          </div>
          <!-- Loading placeholder -->
          <div v-else class="flex-1 flex flex-col items-center justify-center p-8 text-gray-400 bg-gray-50/50 dark:bg-gray-900/50">
            <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin mb-2 opacity-20" />
            <span class="text-sm italic">Initialisation du panel...</span>
          </div>
        </UDashboardSidebar>
      </UDashboardGroup>
    </template>
  </UDashboardPanel>
  </UDashboardGroup>
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
  
  // Before tabs (types < main)
  commentTypesBefore.value.forEach(typeNom => {
    tabs.push({ label: typeNom, value: typeNom });
  });

  // Main tabs
  tabs.push({ label: 'Commentaires', value: 'Commentaires' });
  tabs.push({ label: 'Mots-clés', value: 'Mots-clés' });
  tabs.push({ label: 'Thèmes', value: 'Thèmes' });

  // After tabs (types > main)
  commentTypesAfter.value.forEach(typeNom => {
    tabs.push({ label: typeNom, value: typeNom });
  });

  return tabs;
});

// Tab items for the selected comment detail
const commentDetailTabs = computed(() => [
  { label: 'Contenu', slot: 'content', icon: 'i-lucide-file-text' },
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
  if (!id) return;
  try {
    const data = await $directus.request({
      method: 'GET',
      path: `/items/sources/${id}`,
      params: {
        fields: [
          "id", "titre", "type_de_source.*", "meta", 
          "fichiers.directus_files_id.id", "fichiers.directus_files_id.filename_download", 
          "texte", "content", "editor_nodes.id", "editor_nodes.item", "editor_nodes.collection", 
          "commentaires.*", "commentaires.type.*", "commentaires.keywords_id.keywords_id.id",
          "commentaires.keywords_id.keywords_id.titre",
          "theme_id.titre", "theme_id.id"
        ]
      }
    });

    if (data) {
      source.value = { data: data };
      
      if (data.editor_nodes && data.content) {
        injectDataIntoContent(
          data.editor_nodes,
          data.content
        );
      }

      const index = globalState.value.sources.findIndex((x) => x.id === id);
      if (index !== -1) {
        globalState.value.sources[index] = data;
      } else {
        globalState.value.sources.push(data);
      }
    }
  } catch (error) {
    console.error('Error fetching source:', error);
  }
}

// Lifecycle hooks
onMounted(async () => {
  // Ensure sidebar is visible by default on this page
  if (navState.value.navVisibility === undefined || navState.value.navVisibility === null) {
    navState.value.navVisibility = true;
  }
  
  if (!globalState.value.sources?.length) {
    retrieveSourceData(navState.value.selectedSourceID);
    oldID.value = navState.value.selectedSourceID;
  }
});

watch(() => navState.value.selectedSourceID, (newVal) => {
  if (newVal && newVal !== oldID.value) {
    activeTabIndex.value = 'Commentaires';
    retrieveSourceData(newVal);
    oldID.value = newVal;
  }
});

// Auto-switch tab when a specific comment ID is requested (e.g. from editor links)
watch(() => navState.value.comID, (newComID) => {
  if (newComID && source.value?.data?.commentaires) {
    const comment = source.value.data.commentaires.find(c => c.id === newComID);
    if (comment) {
      const type = comment.type?.Nom;
      if (type) {
        // If type is 'Commentaire', switch to the 'Commentaires' tab (main tab)
        // Otherwise switch to the generic tab named after the type
        activeTabIndex.value = (type === 'Commentaire') ? 'Commentaires' : type;
      }
    }
  }
});

function closeComment() {
  navState.value.comID = null;
  navState.value.comVisibility = false;
}

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
  const commentaire = source.value?.data?.commentaires?.filter(
    (c) => c.type?.Nom?.toLowerCase() === "commentaire"
  ) || [];
  return commentaire[0]?.type?.sort ?? 0;
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
