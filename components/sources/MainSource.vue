<template>
  <div class="flex flex-column w-full">
    <div v-if="!source">
      <h1>Sélectionnez une Source</h1>
    </div>
    <div v-else>
      <div>
        <div class="titre-page">
          <h1>{{ source.data.titre }}</h1>
          <p v-if="source.data">[{{ source.data.type_de_source.Nom }}]</p>
        </div>
        <Splitter>
          <SplitterPanel :size="60" class="">
            <ScrollPanel>
              <div class="p-3" v-for="block in editorJScontent">
                <div v-html="block"></div>
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
                  <!-- Onglet principal Commentaires -->
                  <TabPanel header="Commentaires">
                    <div class="section" id="comments"></div>
                    <SourceComments
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
    .filter(
      (id, index, self) =>
        id &&
        self.indexOf(id) === index
    );

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

import edjsHTML from "editorjs-html";
const edjsParser = edjsHTML();
const editorJScontent = computed(() => {
  if (source.value && source.value.data) {
    return edjsParser.parse(source.value.data.texte);
  } else {
    return null;
  }
});

const Cblock = computed((block) => {
  console.log(block);
  return "block";
});

const comTitre = computed(() => {
  if (store.commentaires.titre) {
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

  const comments = document.getElementsByTagName("mark");
  for (const el of comments) {
    el.addEventListener("click", () => {
      for (const el2 of comments) {
        var comId = el2.getAttribute("data-linkedcomment");
        if (el.getAttribute("data-linkedcomment") == comId) {
          navStore.comID = comId;
        }
      }
      retrieveComments(navStore.comID);
    });
  }
});

// DataFetching of the selected Source(id)
const { $directus } = useNuxtApp();
async function retrieveSourceData(id) {
  source.value = await useAsyncData(() => {
    return $directus.items("sources").readOne(id, {
      fields: [
        "id,titre,type_de_source.*,meta,texte,commentaires.id,commentaires.type.id,commentaires.type.Nom,commentaires.titre,commentaires.content,commentaires.keywords_id.keywords_id.titre,commentaires.keywords_id.keywords_id.id,theme_id.titre,theme_id.id",
      ],
    });
  });

  store.sources[store.sources.findIndex((x) => x.id === id)] =
    source.value.data;
}

const kwSelectectComment = computed(() => {
  const dataSource =
    store.sources[
      store.sources.findIndex((x) => x.id === navStore.selectedSourceID)
    ];
  const dataSelectedComment =
    dataSource.commentaires[
      dataSource.commentaires.findIndex((x) => x.id === navStore.comID)
    ];
  return dataSelectedComment.keywords_id;
});

async function retrieveComments(id) {
  const { data } = await useAsyncData(() => {
    return $directus.items("commentaires").readOne(id);
  });
  store.commentaires = data.value;
  navStore.comVisibility = true;
  navStore.navVisibility = false;
}

store.$subscribe(() => {
  const comments = document.getElementsByTagName("mark");
  for (const el of comments) {
    if (el.getAttribute("data-linkedcomment") == store.commentaires.id) {
      el.setAttribute(
        "style",
        "background-color:var(--surface-link-selected);"
      );
    } else {
      el.setAttribute("style", "background-color:var(--surface-link);");
    }
  }
});

const activeTabIndex = ref(0);

watch(activeTabIndex, (newIndex) => {
  const offset = 2;
  const dynamicIndex = newIndex - offset;

  if (dynamicIndex >= 0) {
    const typeNom = commentTypesId.value[dynamicIndex];
    const comments = getCommentsByID(typeNom);
    console.log(comments);
    if (comments.length === 1) {
      // retrieveComments(comments[0]);
      // console.log(comments[0]);
    }
  }
});
</script>

<style>
.p-tabview .p-tabview-panels {
  padding: 0;
}
</style>
