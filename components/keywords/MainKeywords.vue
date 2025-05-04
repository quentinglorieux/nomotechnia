<template>
  <div class="w-full">
    <div class="flex flex-column p-1 w-full">
      <!-- {{ navStore.selectedKeywordID }} -->
      <div class="card2 bg-slate-100 w-1/2 ml-6 mt-3" v-if="!kw">
        <h3>Navigation par Mot-clés</h3>
<div class="text-justify leading-relaxed text-gray-700">
  Cette section vous permet d’explorer les grands arrêts britanniques à travers une sélection de <strong>mots-clés juridiques</strong>. 
  Chaque mot-clé regroupe des commentaires associés à des décisions majeures, offrant une lecture transversale des enjeux doctrinaux et jurisprudentiels.

  <br /><br />
  Utilisez cette navigation pour parcourir les concepts fondamentaux du <em>Common Law</em> — <strong>judicial review</strong>, <strong>rule of law</strong>, <strong>proportionality</strong>, <strong>due process</strong> — et découvrir comment ils sont mobilisés et débattus dans les commentaires liés aux sources.

  <br /><br />
  Cliquez sur un mot-clé pour consulter sa fiche explicative, la liste des commentaires associés, les décisions concernées, et les auteurs ayant contribué à son analyse.
</div>
      </div>
      <div v-else>
        <div class="titre-page">
          <h1>{{ kw.titre }}</h1>
        </div>
        <div v-if="kw.introduction"> 
        <Panel class="pr-2 pt-2" header="Introduction" toggleable>
          <div v-html="kw.introduction"></div>
        </Panel>
      </div>
        <!-- <h4>Commentaires associés</h4> -->
        <div class="py-2 pr-2" style="text-align: left">
          <DataTable
            showGridlines
            scrollable
            :filters="filters"
            :value="kw.commentaires"
            tableStyle="min-width: 50rem"
            :class="`p-datatable-sm`"
            :globalFilterFields="[
              'commentaires_id.titre',
              'commentaires_id.source_id.titre',
              'commentaires_id.auteur_id.last_name',
              'commentaires_id.auteur_id.first_name',
            ]"
          >
            <template #header>
              <div class="flex justify-content-between">
                <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText
                    v-model="filters['global'].value"
                    placeholder="Recherche (titre, source, auteur)"
                    :class="`p-inputtext w-96`"
                  />
                </span>
              </div>
            </template>


            
            <Column
              sortable
              field="commentaires_id.titre"
              header="Commentaires"
            >
            <template #body="slotSource">
                <span class=" hover:bg-sky-200">
                  <NuxtLink
                    to="/sources"
                    @click="
                      setNavSource(
                        slotSource.data.commentaires_id.source_id.id);
                      setSelectedComment(
                        slotSource.data.commentaires_id.id);
                    "
                    >{{ slotSource.data.commentaires_id.titre }}
                  </NuxtLink>
                </span>
              </template>
            </Column>


            <Column
              sortable
              field="commentaires_id.source_id.titre"
              header="Sources"
            >
              <template #body="slotSource">
                <span class=" hover:bg-sky-200">
                  <NuxtLink
                    to="/sources"
                    @click="
                      setNavSource(
                        slotSource.data.commentaires_id.source_id.id);
                    "
                    >{{ slotSource.data.commentaires_id.source_id.titre }}
                  </NuxtLink>
                </span>
              </template>
            </Column>


            <Column field="commentaires_id.auteur_id" header="Auteur">
              <template #body="slotAuteur">
                <!-- {{ slotAuteur.data.commentaires_id.auteur_id}} -->
                <span class="font-semibold hover:bg-sky-200">
                  <NuxtLink
                    :to="`/auteur-${slotAuteur.data.commentaires_id.auteur_id.last_name}`"
                    >{{ slotAuteur.data.commentaires_id.auteur_id.first_name }}
                    {{ slotAuteur.data.commentaires_id.auteur_id.last_name }}
                  </NuxtLink>
                </span>
              </template>
            </Column>

            
            <Column field="commentaires_id" header="">
              <template #body="SlotCom">
                <div class="flex justify-center">
                  <Button
                    class="mt-1 mx-1"
                    @click="
                      onCommentButtonClick(SlotCom.data.commentaires_id.id)
                    "
                  >
                    Lire
                  </Button>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <Sidebar
      v-model:visible="visible"
      position="right"
      :transitionOptions="'.3s cubic-bezier(0, 0, 0.2, 1)'"
      class="layout-comment-sidebar bg-gray-50 w-fit"
    >
      <CommentaireSide :com="selectedCom"> </CommentaireSide>
    </Sidebar>
  </div>
</template>

<script setup>
import { useNavStore } from "@/stores/navigation";
import { useGlobalStore } from "~/stores/global";
const navStore = useNavStore();
const store = useGlobalStore();
const props = defineProps(["sourceID"]);
const selectedCom = ref("");
const visible = ref(false);
const filters = ref();
// const commentaire_fetched=ref();

const initFilters = () => {
  filters.value = {
    global: { value: null },
  };
};
initFilters();

const onCommentButtonClick = (com) => {
  visible.value = !visible.value;
  selectedCom.value = com;
};

function setNavSource(id) {
  // console.log(id);
  navStore.selectedSourceID = id;
  navStore.comVisibility = false;
  // navStore.navVisibility = false;
}

function setSelectedComment(id) {
  // console.log(id);
  navStore.comID = id
  navStore.comVisibility = true;
  navStore.navVisibility = false;
}




const kw = ref(false);

onUpdated(() => {
  kw.value = store.keywords.find(
    (element) => element.id == navStore.selectedKeywordID
  );
});

onMounted(() => {
  try {
    kw.value = store.keywords.find(
      (element) => element.id == navStore.selectedKeywordID
    );
  } catch (error) {
    console.log(error);
  }
});
</script>
