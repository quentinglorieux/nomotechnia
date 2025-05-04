<template>
  <div class="flex flex-column w-full">
    <div class="card2 bg-slate-100 w-1/2 ml-6 mt-3" v-if="!source">
      <h3>Sélectionnez une Source</h3>
      <div class="text-gray-700 leading-relaxed text-justify max-w-3xl">
        Cette section répertorie les principales
        <strong>décisions de justice britanniques</strong> analysées sur
        Nomotechnia.

        <br /><br />
        Vous y trouverez des arrêts sélectionnés pour leur portée doctrinale,
        leur intérêt pédagogique ou leur valeur fondatrice.

        <br /><br />
        Cliquez sur une source pour accéder à sa fiche complète. Celle-ci inclut
        le texte de l’arrêt, des commentaires associés, les notions juridiques
        mobilisées, ainsi que des liens vers les auteurs ou d'autres arrêts
        connexes.

        <br /><br />
        Vous pouvez aussi explorer les sources via les mots-clés ou les grands
        thèmes accessibles depuis la page d’accueil.
      </div>
    </div>
    <div v-else>
      <div>
        <div class="titre-page">
          <div>
            <h1>{{ source.data.titre }}</h1>
            <p class="text-sm pl-4">{{ source.data.meta }}</p>
          </div>

          <p v-if="source.data">[{{ source.data.type_de_source.Nom }}]</p>
        </div>

        <Splitter>
          <SplitterPanel :size="60" class="">
            <ScrollPanel class="mt-4">
              <FlexibleEditorContent
                class="p-3"
                v-if="source?.data.content"
                :content="source.data.content"
                :relation-marks="relationMarks"
              />

              <!-- ✅ PDF Download Card (multiple files) -->
              <div
                v-if="source?.data.fichiers?.length"
                class="m-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm"
              >
                <div class="mb-3">
                  <h3 class="text-lg font-semibold text-gray-800">
                    📄 Documents associés
                  </h3>
                  <p class="text-sm text-gray-600">
                    Cette source contient
                    {{ source.data.fichiers.length }} document{{
                      source.data.fichiers.length > 1 ? "s" : ""
                    }}
                    joint{{ source.data.fichiers.length > 1 ? "s" : "" }}.
                  </p>
                </div>
                <ul class="space-y-2">
                  <li
                    v-for="(file, index) in source.data.fichiers"
                    :key="file.directus_files_id"
                    class="flex items-center justify-between bg-slate-50 p-3 rounded hover:bg-slate-100 transition"
                  >
                    <div class="text-sm text-gray-800">
                      {{
                        file.directus_files_id.filename_download ||
                        `Document ${index + 1}`
                      }}
                    </div>
                    <a
                      :href="`${baseUrl}/assets/${file.directus_files_id.id}`"
                      target="_blank"
                      download
                      class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition"
                    >
                      <i class="pi pi-download mr-2"></i>
                      Télécharger
                    </a>
                  </li>
                </ul>
              </div>

              <ScrollTop
                target="parent"
                :threshold="100"
                class="custom-scrolltop"
                icon="pi pi-arrow-up"
              />
            </ScrollPanel>
          </SplitterPanel>

          <SplitterPanel :size="40">
            <div class="split-menu">
              <div>
                <TabView v-model:activeIndex="activeTabIndex">
                  <!-- BEFORE "Commentaires": types with position < Commentaire -->
                  <TabPanel
                    v-for="typeNom in commentTypesBefore"
                    :key="'before-' + typeNom"
                    :header="typeNom"
                  >
                    <div
                      class="section"
                      :id="typeNom.replace(/\s+/g, '-').toLowerCase()"
                    >
                      <SourceGenericComments
                        :comments="getCommentsByType(typeNom)"
                      />
                    </div>
                  </TabPanel>

                  <!-- FIXED Commentaires -->
                  <TabPanel header="Commentaires">
                    <div class="section" id="comments"></div>
                    <SourceComments
                      v-if="store.commentaires"
                      :source="source"
                      :comSelected="store.commentaires"
                    />
                  </TabPanel>

                  <!-- FIXED Mots-clés -->
                  <TabPanel header="Mots-clés">
                    <div class="section" id="keywords"></div>
                    <SourceKeywords :source="source" />
                  </TabPanel>

                  <!-- FIXED Thèmes -->
                  <TabPanel header="Thèmes">
                    <div class="section" id="themes"></div>
                    <SourceThemes :source="source" />
                  </TabPanel>

                  <!-- AFTER "Thèmes": types with position > Commentaire -->
                  <TabPanel
                    v-for="typeNom in commentTypesAfter"
                    :key="'after-' + typeNom"
                    :header="typeNom"
                  >
                    <div
                      class="section"
                      :id="typeNom.replace(/\s+/g, '-').toLowerCase()"
                    >
                      <SourceGenericComments
                        :comments="getCommentsByType(typeNom)"
                      />
                    </div>
                  </TabPanel>
                </TabView>
              </div>
              <div class="source-commentaire" v-if="navStore.comVisibility">
                <div class="close-button bg-slate-200 rounded pl-1 py-0 m-2">
                  <Button
                    icon="pi pi-times"
                    text
                    rounded
                    @click="
                      () => {
                        navStore.comVisibility = false;
                        // store.commentaires = {};
                      }
                    "
                  >
                  </Button>
                </div>
                <TabView>
                  <TabPanel>
                    <template #header>
                      {{ comTitre }}
                    </template>
                    <ScrollPanel
                      ref="scrollPanelRef"
                      style="
                        margin: 0.1rem;
                        height: 100%;
                        background-color: white;
                      "
                    >
                      <div class="p-3">
                        <CommentaireSide
                          :com="navStore.comID"
                        ></CommentaireSide>
                      </div>
                      <ScrollTop
                        target="parent"
                        :threshold="100"
                        style="
                          .p-scrolltop {
                            position: sticky;
                            bottom: 60px;
                          }
                        "
                        icon="pi pi-arrow-up"
                      />
                    </ScrollPanel>
                  </TabPanel>
                  <TabPanel>
                    <template #header>
                      <span>Mots-clés associés</span>
                    </template>
                    <ScrollPanel class="pr-20">
                      <CommentsKeywords
                        :kwList="kwSelectectComment"
                      ></CommentsKeywords>
                    </ScrollPanel>
                  </TabPanel>
                </TabView>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNavStore } from "@/stores/navigation";
import { useGlobalStore } from "~/stores/global";
import { injectDataIntoContent } from "directus-extension-flexible-editor/content";
import FlexibleEditorContent from "directus-extension-flexible-editor/content/vue";
import RelatedComment from "./RelatedComment.vue";
const navStore = useNavStore();
const store = useGlobalStore();

const config = useRuntimeConfig();
const baseUrl = config.public.API_BASE_URL;

const props = defineProps(["sourceID"]);
const source = ref();

// Liste des types uniques de commentaires pour la source sélectionnée
const commentTypes = computed(() => {
  if (!source.value || !source.value.data || !source.value.data.commentaires) {
    return [];
  }

  const rawCommentaires = toRaw(source.value.data.commentaires);

  const types = rawCommentaires
    .map((c) => c.type?.Nom)
    .filter(
      (nom, index, self) =>
        nom &&
        nom.toLowerCase() !== "commentaire" && // Exclude fixed tab
        self.indexOf(nom) === index
    );

  return types;
});

const commentTypesId = computed(() => {
  if (!source.value || !source.value.data || !source.value.data.commentaires) {
    return [];
  }

  const rawCommentaires = toRaw(source.value.data.commentaires);

  const types = rawCommentaires
    .map((c) => c.type?.id)
    .filter((id, index, self) => id && self.indexOf(id) === index);

  return types;
});

// Retourne tous les commentaires correspondant à un type donné
function getCommentsByType(typeNom) {
  if (!source.value || !source.value.data || !source.value.data.commentaires) {
    return [];
  }
  const rawCommentaires = toRaw(source.value.data.commentaires);
  return rawCommentaires.filter((c) => c.type?.Nom === typeNom);
}

function getCommentsByID(typeNom) {
  if (!source.value || !source.value.data || !source.value.data.commentaires) {
    return [];
  }
  const rawCommentaires = toRaw(source.value.data.commentaires);
  return rawCommentaires.filter((c) => c.type?.id === typeNom);
}

const oldID = ref();

const comTitre = computed(() => {
  if (store.commentaires?.titre) {
    const a = store.commentaires.titre.substring(0, 35);
    const b = store.commentaires.titre.length > 35 ? "[ ...]" : "";
    const c = a + b;
    return c;
  }
  return "";
});

onMounted(() => {
  if (navStore.selectedSourceID) {
    retrieveSourceData(navStore.selectedSourceID);
  }
});

onUpdated(() => {
  if (navStore.selectedSourceID != oldID.value) {
    retrieveSourceData(navStore.selectedSourceID);
  }
  oldID.value = navStore.selectedSourceID;
});

// DataFetching of the selected Source(id)
const { $directus } = useNuxtApp();

async function retrieveSourceData(id) {
  source.value = await useAsyncData(() => {
    return $directus.items("sources").readOne(id, {
      fields: [
        "id,titre,type_de_source.*,meta,fichiers.directus_files_id.id,fichiers.directus_files_id.filename_download,texte,content,editor_nodes.id,editor_nodes.item,editor_nodes.collection,commentaires.id,commentaires.status,commentaires.type.id,commentaires.type.sort,commentaires.type.Nom,commentaires.titre,commentaires.content,commentaires.keywords_id.keywords_id.titre,commentaires.keywords_id.keywords_id.id,theme_id.titre,theme_id.id",
      ],
    });
  });

  // ✅ Filter only published commentaires
  if (source.value?.data?.commentaires) {
    source.value.data.commentaires = source.value.data.commentaires.filter(
      (c) => c.status === "published"
    );
  }

  injectDataIntoContent(
    source.value.data.editor_nodes,
    source.value.data.content
  );
  //  Define renderers for relations

  store.sources[store.sources.findIndex((x) => x.id === id)] =
    source.value.data;
}

const relationBlocks = [];
const relationInlineBlocks = [];
const relationMarks = [
  { collection: "related_comments", component: RelatedComment },
];

//  Define renderers for custom blocks or marks
// const componentSerializers = [];

const kwSelectectComment = computed(() => {
  const dataSource =
    store.sources[
      store.sources.findIndex((x) => x.id === navStore.selectedSourceID)
    ];
  const dataSelectedComment =
    dataSource.commentaires[
      dataSource.commentaires.findIndex((x) => x.id === navStore.comID)
    ];
  return dataSelectedComment ? dataSelectedComment.keywords_id : [];
});

// async function retrieveComments(id) {
//   const { data } = await useAsyncData(() => {
//     return $directus.items("commentaires").readOne(id);
//   });
//   store.commentaires = data.value;
//   navStore.comVisibility = true;
//   navStore.navVisibility = false;
// }

const activeTabIndex = ref(0);

watch(activeTabIndex, (newIndex) => {
  const offset = 2;
  const dynamicIndex = newIndex - offset;

  if (dynamicIndex >= 0) {
    const typeNom = commentTypesId.value[dynamicIndex];
    const comments = getCommentsByID(typeNom);
    // console.log(comments);
    if (comments.length === 1) {
      // retrieveComments(comments[0]);
      // console.log(comments[0]);
    }
  }
});

const commentairePosition = computed(() => {
  const commentaire = source.value?.data?.commentaires.find(
    (c) => c.type?.Nom === "Commentaire"
  );
  return commentaire?.type?.sort ?? 0;
});

const commentTypesBefore = computed(() => {
  const raw = toRaw(source.value?.data?.commentaires || []);

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
  const raw = toRaw(source.value?.data?.commentaires || []);

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
</script>

<style>
.p-tabview .p-tabview-panels {
  padding: 0;
}
</style>
