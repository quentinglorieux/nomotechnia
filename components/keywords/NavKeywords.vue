<template>
  <div>
    <div v-if="visible" class="nav-component">
      <div class="nav-title">
        <div><i class="pi pi-fw pi-tags"></i> MOTS CLÉS</div>
        <div>
          <button class="layout-topbar-button" @click="toggleNav()">
            <i class="pi pi pi-angle-double-left"></i>
          </button>
        </div>
      </div>

      <DataTable
        :value="listItems"
        v-model:filters="filter1"
        filterDisplay="menu"
        :globalFilterFields="['titre']"
        selectionMode="single"
        dataKey="id"
        responsiveLayout="scroll"
        class="p-datatable-sm"
        :scrollable="true"
        scrollHeight="flex"
        :resizableColumns="true"
        columnResizeMode="expand"
        @rowSelect="onRowSelect"
      >
        <template #header>
          <div class="flex justify-content-between">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filter1['global'].value"
                placeholder="Recherche de mots-clés"
              />
            </span>
          </div>
        </template>
        <Column field="titre" header="Mots-clés" :sortable="true">
          <template #body="slotProps">
            <div class=""> {{ slotProps.data.titre }} </div>
          </template>
        </Column>


        <Column
          style="text-align: right"
          field="commentaires.length"
          header="Nombre"
          :sortable="true"
        >
          <template #body="slotProps">
            <div
              class="border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm bg-slate-300 text-slate-700 hover:bg-slate-400"
            >
              {{ slotProps.data.commentaires.length }}
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-if="!visible" class="">
      <button class="layout-topbar-button" @click="toggleNav()">
        <i class="pi pi pi-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { FilterMatchMode, FilterOperator } from "primevue/api";
const props = defineProps(["visible"]);
import { useGlobalStore } from "~/stores/global";
const store = useGlobalStore();
import { useNavStore } from "@/stores/navigation";
const navStore = useNavStore();
const listItems = computed(() => store.keywords);
function toggleNav() {
  navStore.toggleNav();
}
const filter1 = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  titre: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
});
const clearFilter1 = () => {
  initFilters1();
};
const initFilters1 = () => {
  filter1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    titre: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  };
};
const onRowSelect = (node) => {
  navStore.selectedKeywordID = node.data.id;
};
</script>
