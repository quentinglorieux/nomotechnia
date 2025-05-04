<template>
    
    <div class="p-3 mx-auto  mt-1 max-w-5xl"> 
      <div class="titre-page">
      <h1>Les auteurs </h1>
    </div>
        <!-- <h2 class="mb-0">  </h2> -->
  <DataTable :value="store.authors" tableStyle="">
    <Column field="name" header="">
      <template #body="slotProps" >
        <div class="flex font-bold items-center"> 
        <Avatar v-if="slotProps.data.avatar" :image="'https://admin.nomotechnia.rubidiumweb.fr/assets/' + slotProps.data.avatar + '?fit=cover&width=200&height=200&quality=10'" class="mr-2" size="large" shape="circle" />
 <div> {{ slotProps.data.first_name + " " + slotProps.data.last_name }}</div>
</div>
      </template>
    </Column>

 
    <Column field="comments" header="">
      <template #body="SlotCom">
        <div  class="flex justify-end">
          <NuxtLink :to="'auteur-' + SlotCom.data.last_name"> <Button
            class="mt-1 mx-1"
            label="Voir les commentaires" 
          /></NuxtLink>
        </div>
      </template>
    </Column>
  </DataTable>
</div>
</template>

<script setup>
import { useGlobalStore } from "~/stores/global";
const store = useGlobalStore();

const onCommentButtonClick = (com) => {
  visible.value = !visible.value;
  selectedCom.value = com;
};
</script>
