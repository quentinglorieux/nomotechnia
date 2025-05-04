<template>
  <div v-if="!author">Chargement en cours</div>
  <div v-else class="p-3 mx-auto mt-1">
    <div class="titre-page mx-2">
      <h1>{{ author.first_name + " " + author.last_name }}</h1>
    </div>
    <Panel
      class="px-2 mt-2"
      header="Biographie"
      toggleable
      :collapsed="isCollapsed"
      @click="isCollapsed = !isCollapsed"
    >
      <div>{{ author.short_cv }}</div>
    </Panel>

    <div class="py-2 px-2" style="text-align: left">
      <DataTable
        showGridlines
        scrollable
        :value="listItems"
        tableStyle="min-width: 50rem"
        :class="`p-datatable-sm`"
      >
        <Column sortable field="titre" header="Commentaires">
          <template #body="slotCom">
            <span class="hover:bg-sky-200">
              <NuxtLink
                to="/sources"
                @click="
                  setNavSource(slotCom.data.source_id.id);
                  setSelectedComment(slotCom.data.id);
                "
              >
                {{ slotCom.data.titre }}
              </NuxtLink>
            </span>
          </template>
        </Column>

        <Column sortable field="source_id.titre" header="Sources">
          <template #body="slotSource">
            <span class="hover:bg-sky-200">
              <NuxtLink
                to="/sources"
                @click="setNavSource(slotSource.data.source_id.id)"
                >{{ slotSource.data.source_id.titre }}
              </NuxtLink>
            </span>
          </template>
        </Column>

        <Column field="id" header="">
          <template #body="SlotCom">
            <div class="flex justify-center">
              <Button
                class="mt-1 mx-1"
                @click="onCommentButtonClick(SlotCom.data.id)"
              >
                Lire
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>
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
const navStore = useNavStore();
const route = useRoute();

const listItems = ref([]);
const author = ref();
const visible = ref(false);
const selectedCom = ref("");
const isCollapsed = ref(true);

// DataFetching of Commentaires
const { $directus } = useNuxtApp();
async function retrieveComments() {
  const { data: publicData } = await useAsyncData(() => {
    return $directus.items("commentaires").readByQuery({
      fields: ["id,titre,source_id.titre,source_id.id"],
      filter: {
        auteur_id: {
          last_name: {
            _eq: route.params.id,
          },
        },
        status: {
          _eq: "published",
        },
      },
    });
  });
  var L = publicData.value.data;
  listItems.value = L;
}

async function retrieveAuthor() {
  const { data: publicData } = await useAsyncData(() => {
    return $directus.items("directus_users").readByQuery({
      fields: ["id,first_name,last_name,first_name,short_cv"],
      filter: {
        last_name: {
          _eq: route.params.id,
        },
      },
    });
  });
  // console.log(publicData);
  var L = publicData.value.data;
  author.value = L[0];
}

const onCommentButtonClick = (com) => {
  visible.value = !visible.value;
  selectedCom.value = com;
};

function setNavSource(id) {
  // console.log(id);
  navStore.selectedSourceID = id;
  navStore.comVisibility = false;
}

function setSelectedComment(id) {
  // console.log(id);
  navStore.comID = id;
  navStore.comVisibility = true;
  navStore.navVisibility = false;
}

onMounted(() => {
  retrieveComments();
  retrieveAuthor();
  // retrieveAuthors();
});

watch(route, (newX) => {
  // retrieveComments();
});
</script>
