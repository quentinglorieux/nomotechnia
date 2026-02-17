<template>
  <UDashboardPanel grow class="bg-white dark:bg-gray-900 border-none overflow-hidden h-full flex flex-col">
    <!-- Main Source Header -->
    <template #header>
      <div v-if="source?.data" class="flex items-center gap-3 bg-slate-100 w-full  border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur shrink-0">

        
        <div class="flex-1 min-w-0 flex flex-col">
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-semibold text-gray-100 dark:text-white py-6 px-4 bg-slate-900 w-4/5">
              {{ source?.data?.titre || 'Chargement...' }}
            </h1>
            <UBadge v-if="source?.data?.type_de_source" color="neutral" variant="soft" size="xs" class="shrink-0 uppercase tracking-tighter  w-1/5">
              {{ source?.data?.type_de_source?.Nom }}
            </UBadge>
          </div>
          <p v-if="source?.data?.meta" class="text-sm text-gray-900 dark:text-gray-400 bg-slate-300 truncate font-medium py-2 px-4">{{ source?.data?.meta }}</p>
        </div>
      </div>

    </template>

    <!-- Main Body -->
    <template #body>
      <UDashboardSidebarToggle class="md:hidden " />
      <UDashboardSidebarCollapse class="hidden md:flex " />
      <!-- Info Section if no source selected -->
      <div v-if="!source?.data" class="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-950/50">
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
          </div>
        </div>
      </div>

      <!-- Main Dual Panel View -->
      <UDashboardGroup v-else grow class="flex-1 w-full min-h-0 overflow-hidden divide-x divide-gray-200 dark:divide-gray-800">
        <!-- Panel 1: Source Content [Resizable] -->
        <UDashboardPanel grow :min-size="300" class="min-w-0 bg-white dark:bg-gray-900 overflow-y-auto">
          <div class="p-8 max-w-4xl mx-auto w-full">
            <div v-if="source?.data?.content" class="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert prose-slate prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white max-w-none">
              <FlexibleEditorContent :content="source?.data?.content" :relation-marks="relationMarks" />
            </div>
            <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 italic">
              <UIcon name="i-lucide-file-text" class="w-12 h-12 mb-4 opacity-20" />
              Aucun contenu disponible pour cette source
            </div>

            <!-- Fichiers files -->
            <UCard v-if="source?.data?.fichiers?.length" class="mt-12 border-gray-100 dark:border-gray-800 shadow-sm">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-paperclip" class="w-5 h-5 text-primary-500" />
                  <h3 class="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Pièces jointes</h3>
                </div>
              </template>
              <ul class="space-y-2">
                <li v-for="file in source.data.fichiers" :key="file.directus_files_id.id" class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-900 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all cursor-default">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-300 truncate mr-4">
                    {{ file.directus_files_id.filename_download }}
                  </span>
                  <UButton :to="`${baseUrl}/assets/${file.directus_files_id.id}`" target="_blank" download icon="i-lucide-download" variant="ghost" size="xs" color="neutral" />
                </li>
              </ul>
            </UCard>
          </div>
        </UDashboardPanel>

        <!-- Panel 2: Utility Center (Avant-propos, Commentaires, Details) [Resizable] -->
        <UDashboardPanel 
          id="utility-center"
          collapsible
          resizable
          side="right"
          :width="450"
          :min-size="350"
          class="bg-gray-50/30 dark:bg-gray-900 border-s border-gray-200 dark:border-gray-800 h-full flex flex-col min-h-0"
        >
          <!-- Unified Navigation Tabs Always Visible -->
          <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
            <UTabs 
              v-model="activeTabIndex" 
              :items="sourceTabs" 
              class="flex-1 flex flex-col min-h-0"
              :ui="{ 
                root: 'flex flex-col h-full',
                list: 'shrink-0 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-20',
                content: 'flex-1 min-h-0 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/20',
                trigger: 'px-4 h-8 text-[11px] font-black uppercase tracking-widest'
              }"
            >
              <template #content="{ item }">
                <div class="p-0">
                  <!-- Main Comments -->
                  <div v-if="item.value === 'Commentaires'">
                    <SourceComments
                      v-if="source?.data?.commentaires"
                      :source="source"
                    />
                  </div>
                  
                  <!-- Index (Keywords + Themes) -->
                  <div v-else-if="item.value === 'Index'" class="divide-y divide-gray-100 dark:divide-gray-800">
                    <div class="p-6">
                      <div class="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-primary-500">
                        <UIcon name="i-lucide-tag" /> Mots-clés
                      </div>
                      <SourceKeywords :source="source" />
                    </div>
                    <div class="p-6">
                      <div class="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-primary-500">
                        <UIcon name="i-lucide-layout-grid" /> Thèmes
                      </div>
                      <SourceThemes :source="source" />
                    </div>
                  </div>

                  <!-- Dynamic Generic (Avant-propos, etc.) -->
                  <div v-else>
                    <SourceGenericComments 
                      :comments="getCommentsByType(item.value)" 
                    />
                  </div>
                </div>
              </template>
            </UTabs>
          </div>
        </UDashboardPanel>
      </UDashboardGroup>
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
const activeTabIndex = ref('Commentaires'); // Default tab value

// Tab items for the source (right pane)
const sourceTabs = computed(() => {
  const tabs = [];
  
  // Custom logic to find Avant-propos
  const avantProposType = source.value?.data?.commentaires?.find(c => 
    String(c.type?.Nom || '').toLowerCase().includes('avant-propos')
  )?.type?.Nom;

  if (avantProposType) {
    tabs.push({ label: avantProposType, value: avantProposType });
  }

  // Before tabs (ignoring Avant-propos if already added)
  commentTypesBefore.value.forEach(typeNom => {
    if (typeNom !== avantProposType) {
      tabs.push({ label: typeNom, value: typeNom });
    }
  });

  // Main tabs
  tabs.push({ label: 'Commentaires', value: 'Commentaires' }); // Renamed 'Commentaires' to 'Apports' for premium feel, value stays same for logic
  tabs.push({ label: 'Details', value: 'Index' });

  // After tabs
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
    // Reset comment detail state when switching sources
    navState.value.comID = null;
    navState.value.comVisibility = false;

    activeTabIndex.value = 'Commentaires';
    retrieveSourceData(newVal);
    oldID.value = newVal;
  }
});

// Reset comment detail view when switching tabs manually
// If user clicks on any tab, we clear the specific comment selection to show the list/default view
watch(activeTabIndex, () => {
  navState.value.comID = null;
});

// Auto-switch tab when a specific comment ID is requested (e.g. from editor links)
watch(() => navState.value.comID, (newComID) => {
  if (newComID && source.value?.data?.commentaires) {
    const comment = source.value.data.commentaires.find(c => c.id === newComID);
    if (comment) {
      const type = (comment.type?.Nom === 'Commentaire') ? 'Commentaires' : comment.type?.Nom;
      if (type && activeTabIndex.value !== type) {
        activeTabIndex.value = type;
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
