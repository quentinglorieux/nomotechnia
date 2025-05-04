<template>
  <div class="flex flex-column w-full">
    <div class="card2 bg-slate-100" v-if="!source">
      <h2>Sélectionnez une Source</h2>
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
            <p class="pl-4">{{ source.data.meta }}</p>
          </div>

          <p v-if="source.data">[{{ source.data.type_de_source.Nom }}]</p>
        </div>

        <Splitter>
          <SplitterPanel :size="60" class="">
            <ScrollPanel>
              <FlexibleEditorContent
                class="p-3"
                v-if="source?.data.content"
                :content="source.data.content"
                :relation-marks="relationMarks"
              />

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
                  <!-- Onglet principal Commentaires -->
                  <TabPanel header="Commentaires">
                    <div class="section" id="comments"></div>
                    <SourceComments
                      v-if="store.commentaires"
                      :source="source"
                      :comSelected="store.commentaires"
                    />
                  </TabPanel>

                  <!-- Onglet Mots-clés -->
                  <TabPanel header="Mots-clés">
                    <div class="section" id="keywords"></div>
                    <SourceKeywords :source="source" />
                  </TabPanel>

                  <!-- Onglet Thèmes -->
                  <TabPanel header="Thèmes">
                    <div class="section" id="themes"></div>
                    <SourceThemes :source="source" />
                  </TabPanel>

                  <!-- Onglets dynamiques pour chaque type de commentaire -->
                  <TabPanel
                    v-for="typeNom in commentTypes"
                    :key="typeNom"
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
        "id,titre,type_de_source.*,meta,texte,content,editor_nodes.id,editor_nodes.item,editor_nodes.collection,commentaires.id,commentaires.type.id,commentaires.type.Nom,commentaires.titre,commentaires.content,commentaires.keywords_id.keywords_id.titre,commentaires.keywords_id.keywords_id.id,theme_id.titre,theme_id.id",
      ],
    });
  });

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

async function retrieveComments(id) {
  const { data } = await useAsyncData(() => {
    return $directus.items("commentaires").readOne(id);
  });
  store.commentaires = data.value;
  navStore.comVisibility = true;
  navStore.navVisibility = false;
}

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

// 2. Inject node data into the editor content
</script>

<style>
.p-tabview .p-tabview-panels {
  padding: 0;
}
</style>
