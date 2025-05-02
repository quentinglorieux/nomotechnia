<template>
  <div class="w-full">
    <div class="flex flex-column p-1 w-full">
      <!-- {{ navStore.selectedKeywordID }} -->
      <div class="card2 bg-slate-100" v-if="!kw">
        <h1>Navigation par Mot-clés</h1>
        <div>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis au
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
