<template>
  <div class="flex flex-col w-full h-full min-h-0 overflow-hidden">
    <!-- Info Section if no source selected -->
    <div v-if="!source" class="m-6 p-6 bg-slate-100 dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 lg:w-1/2">
      <h3 class="text-xl font-bold text-slate-800 dark:text-gray-100 mb-4">Sélectionnez une Source</h3>
      <div class="text-slate-700 dark:text-gray-300 leading-relaxed text-justify prose dark:prose-invert max-w-none">
        <p>
          Cette section répertorie les principales
          <strong>décisions de justice britanniques</strong> analysées sur
          Nomotechnia.
        </p>
        <p>
          Vous y trouverez des arrêts sélectionnés pour leur portée doctrinale,
          leur intérêt pédagogique ou leur valeur fondatrice.
        </p>
        <p>
          Cliquez sur une source pour accéder à sa fiche complète. Celle-ci inclut
          le texte de l’arrêt, des commentaires associés, les notions juridiques
          mobilisées, ainsi que des liens vers les auteurs ou d'autres arrêts
          connexes.
        </p>
        <p>
          Vous pouvez aussi explorer les sources via les mots-clés ou les grands
          thèmes accessibles depuis la page d’accueil.
        </p>
      </div>
    </div>

    <!-- Main Source Display -->
    <div v-else class="flex flex-col h-full min-h-0 overflow-hidden">
      <div class="px-6 py-4 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">{{ source.data.titre }}</h1>
            <p v-if="source.data.meta" class="text-sm text-slate-500 dark:text-gray-400 mt-1">{{ source.data.meta }}</p>
          </div>
          <UBadge v-if="source.data.type_de_source" color="neutral" variant="soft">
            {{ source.data.type_de_source.Nom }}
          </UBadge>
        </div>
      </div>

      <!-- Main Content Split view -->
      <div class="flex flex-1 min-h-0 overflow-hidden" ref="splitContainer">
        <!-- Left Pane: Content (resizable) -->
        <div class="border-r border-slate-200 dark:border-gray-800 flex flex-col" :style="leftPaneStyle">
          <UScrollArea class="flex-1 p-6 relative">
            <FlexibleEditorContent
              v-if="source?.data.content"
              class="prose dark:prose-invert max-w-none"
              :content="source.data.content"
              :relation-marks="relationMarks"
            />

            <!-- PDF Download Card -->
            <UCard v-if="source?.data.fichiers?.length" class="mt-8">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-file-text" class="w-5 h-5 text-slate-500 dark:text-gray-400" />
                  <h3 class="text-lg font-semibold dark:text-white">Documents associés</h3>
                </div>
              </template>
              
              <ul class="space-y-2">
                <li
                  v-for="(file, index) in source.data.fichiers"
                  :key="file.directus_files_id"
                  class="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span class="text-sm font-medium text-slate-700 dark:text-gray-300">
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
                  />
                </li>
              </ul>
            </UCard>
          </UScrollArea>
        </div>

        <!-- Draggable Separator -->
        <div
          class="w-2 cursor-col-resize bg-slate-200/80 hover:bg-primary-400 dark:bg-gray-700 dark:hover:bg-primary-600 transition-colors"
          @mousedown="startResize"
          role="separator"
          aria-label="Redimensionner les panneaux"
          aria-orientation="vertical"
        />

        <!-- Right Pane: Tabs and Details (resizable) -->
        <div class="flex flex-col bg-slate-50 dark:bg-gray-950 min-h-0 overflow-hidden" :style="rightPaneStyle">
          <div class="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <!-- Source Tabs -->
            <UTabs :items="sourceTabs" v-model:active-index="activeTabIndex" class="flex-1 flex flex-col overflow-hidden min-h-0">
              <template #content="{ item }">
                <div class="flex-1 p-4 min-h-0 overflow-y-auto">
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

            <!-- Selected Comment Detail Overlay -->
            <div 
              v-if="navState.comVisibility" 
              class="absolute inset-x-0 bottom-0 top-0 bg-white dark:bg-gray-900 z-10 border-t border-slate-200 dark:border-gray-800 flex flex-col min-h-0 shadow-2xl transition-all duration-300 transform translate-y-0"
            >
              <div class="flex items-center justify-between p-2 border-b border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-950">
                <div class="truncate font-semibold px-2 text-slate-700 dark:text-gray-200">
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
                  <div class="flex-1 p-4 min-h-0 overflow-y-auto">
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
    </div>
  </div>
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
const activeTabIndex = ref(2); // Default to 'Commentaires' tab
const splitContainer = ref(null);
const leftPaneWidth = ref(60);
const isResizing = ref(false);

const leftPaneStyle = computed(() => ({
  flexBasis: `${leftPaneWidth.value}%`,
  minWidth: '320px',
}));

const rightPaneStyle = computed(() => ({
  flexBasis: `${100 - leftPaneWidth.value}%`,
  minWidth: '320px',
}));

// Tab items for the source (right pane)
const sourceTabs = computed(() => {
  const tabs = [];
  
  // Before tabs
  commentTypesBefore.value.forEach(typeNom => {
    tabs.push({ label: typeNom, slot: 'before-tabs', value: `before-${typeNom}` });
  });

  // Main tabs
  tabs.push({ label: 'Commentaires', slot: 'main-comments', value: 2 });
  tabs.push({ label: 'Mots-clés', slot: 'keywords', value: 3 });
  tabs.push({ label: 'Thèmes', slot: 'themes', value: 4 });

  // After tabs
  commentTypesAfter.value.forEach(typeNom => {
    tabs.push({ label: typeNom, slot: 'after-tabs', value: `after-${typeNom}` });
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

function startResize() {
  isResizing.value = true;
  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', stopResize);
}

function onResize(event) {
  if (!isResizing.value || !splitContainer.value) return;

  const rect = splitContainer.value.getBoundingClientRect();
  const next = ((event.clientX - rect.left) / rect.width) * 100;
  leftPaneWidth.value = Math.min(80, Math.max(30, next));
}

function stopResize() {
  if (!isResizing.value) return;
  isResizing.value = false;
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', stopResize);
}

onBeforeUnmount(() => {
  stopResize();
});
</script>
