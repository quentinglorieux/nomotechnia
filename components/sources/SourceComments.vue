<template>
  <div class="p-3 pt-4">
    <li v-for="com in commentairesSimples">
      <div class="flex p-1">
        <Button
          rounded
          class="shrink-0 min-w-fit bg-gray-200 hover:bg-blue-100"
          icon="pi pi-eye"
          text
          @click="retrieveComments(com)"
        />
        <div class="grow-0 mr-3 text-lg">
          {{ com.titre }}
        </div>
      </div>
    </li>
  </div>
</template>

<script setup>
const props = defineProps(["source", "comSelected"]);
const emit = defineEmits(["ComSelected"]);
import { useNavStore } from "@/stores/navigation";
import { useGlobalStore } from "~/stores/global";
const navStore = useNavStore();
const store = useGlobalStore();

const { $directus } = useNuxtApp();
async function retrieveComments(com) {
  const id = com.id;
  const { data } = await useAsyncData(() => {
    return $directus.items("commentaires").readOne(id);
  });
  store.commentaires = data.value;
  navStore.comVisibility = true;
  navStore.navVisibility = false;
  navStore.comID = com.id;
}

const commentairesSimples = computed(() => {
  if (!props.source || !props.source.data || !props.source.data.commentaires) {
    return [];
  }

  return props.source.data.commentaires.filter(
    (c) => c.type?.Nom?.toLowerCase() === "commentaire" // or "commentaires" ?
  );
});
</script>
