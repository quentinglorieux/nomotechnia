<template>
  <div class="flex flex-wrap p-2 pt-3">
    <NuxtLink
      class="link"
      v-for="kw in kwList"
      to="/keywords"
      @click="navStore.selectedKeywordID = kw.id"
    >
      <!-- {{ kw.titre }} -->

      <div class="bg-slate-300 rounded-full flex flex-wrap gap-2">
        <Chip class="pl-0 pr-3 flex">
          <span
            class="bg-primary border-circle w-2rem h-2rem flex align-items-center justify-content-center"
          >
            {{ kw.titre[0] }}</span
          >
          <span class="ml-2 font-medium">{{ kw.titre }}</span>
        </Chip>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
import { useNavStore } from "@/stores/navigation";
const navStore = useNavStore();

import { useGlobalStore } from "~/stores/global";
const store = useGlobalStore();

const kwList = ref([]);
const props = defineProps(["source"]);




const { $directus } = useNuxtApp();
async function retrieveKeywords() {
  const { data: publicData } = await useAsyncData(() => {
    return $directus.items("keywords").readByQuery({
      fields: [
        "titre,id,meta,introduction,commentaires.commentaires_id.titre,commentaires.commentaires_id.id,commentaires.commentaires_id.auteur_id.first_name,commentaires.commentaires_id.auteur_id.last_name,commentaires.commentaires_id.source_id.titre,commentaires.commentaires_id.source_id.id",
      ],
    });
  });
  store.keywords = publicData.value.data; //Storage of Keywords data
}


function listDuplicate() {
  const l1 = [];

  for (let com of props.source?.data?.commentaires ?? []) {
    if (Array.isArray(com.keywords_id)) {
      for (let kw of com.keywords_id) {
        if (kw?.keywords_id) {
          l1.push({
            titre: kw.keywords_id.titre,
            id: kw.keywords_id.id,
          });
        }
      }
    }
  }

  // Supprimer les doublons (même titre + id)
  const uniqueMap = new Map();
  const uniqueArray = l1.filter((obj) => {
    const key = `${obj.titre}_${obj.id}`;
    return !uniqueMap.has(key) && uniqueMap.set(key, obj);
  });

  return uniqueArray;
}

watch(props, () => {
  kwList.value = listDuplicate();
});

onMounted(() => {
  kwList.value = listDuplicate();
 if (!store.keyword)  {retrieveKeywords()} 
  
});

</script>

<style scoped>
.link {
  color: #18272f;
  position: relative;
  text-decoration: none;
  padding: 10px;
}

.link::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 1px;
  border-radius: 1px;
  background-color: #18272f;
  bottom: 0;
  left: 0;
  transform-origin: right;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.link:hover::before {
  transform-origin: left;
  transform: scaleX(1);
}
</style>
