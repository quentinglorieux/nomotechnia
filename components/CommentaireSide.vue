<template>
  <div class="flex">
    <div
      v-if="fetched_data"
      class="card2 bg-slate-100 p-0 pb-1"
      ref="pdfSection"
    >
     <h1 class="flex  justify-between">
        <div class="px-2">
          <h1 class="">{{ fetched_data.data.titre }}</h1>
        </div>
        <div class="mt-1">
          <Button
            @click="
              exportToPDF(
                'commentaire.pdf',
                pdfSection,
                documentOptions,
                options
              )
            "
            label=""
            icon="pi pi-file-pdf"
          />
        </div>
      </h1>

      <div v-if="fetched_data.data.abstract" class="bg-slate-200 p-2 rounded m-2">
        <h3 class="px-2">Résumé:</h3>
        <div class="p-2" v-html="fetched_data.data.abstract"></div>
      </div>
      
      <div class="pt-3 px-2 m-2 " v-html="parsedMarkdown"></div>

      <div v-if="store.commentaires.references" class="bg-slate-200 p-2 mt-10 m-2 rounded ">
        <h3 class="px-2">Références :</h3>
        <div> <ul  class="px-2 pb-3" > <li v-for="ref in store.commentaires.references"> <a :id="'ref'+ ref.id"> [{{ ref.id }}] {{ ref.titre }} </a> <a :href="'#s' + ref.id"> - Retour </a></li> </ul> </div>
      </div>

      <div v-if="fetched_data.data.citation" class="bg-slate-300 p-2 mt-10 m-2 rounded ">
        <h3 class="px-2">Citation :</h3>
        <div class="px-2 pb-3" v-html="fetched_data.data.citation"></div>
      </div>

    </div>
  </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import { exportToPDF } from "#imports";
const pdfSection = (ref < HTMLElement) | (null > null);

import { useGlobalStore } from "~/stores/global";
const store = useGlobalStore();
// import { useNavStore } from "@/stores/navigation";
// const navStore = useNavStore();

const prop = defineProps(["com"]);

const documentOptions = {
  orientation: "p",
  unit: "mm",
  format: "a4",
  putOnlyUsedFonts: true,
};

const options = {
  autoPaging: "text",
  width: 206,
  windowWidth: 950,
  margin: [4, 2, 4, 2],
};

const fetched_data = ref();
const md = new MarkdownIt({html:true});
const parsedMarkdown = ref();

// DataFetching of the selected Commentaires(id)
const { $directus } = useNuxtApp();
async function retrieveCommentData(id) {
  fetched_data.value = await useAsyncData(() => {
    return $directus.items("commentaires").readOne(id, {
      fields: ["id,titre,citation,abstract,content,auteur_type,auteur_name,references"],
    });
  });
  parsedMarkdown.value = md.render(fetched_data.value.data.content) 
  // + '<div v-tooltip="' + "'Tooltip'" +'" type="text">Bonjour </div>';
  store.commentaires.titre = fetched_data.value.data.titre
  store.commentaires.references = fetched_data.value.data.references
}

onMounted(() => {
  // console.log(prop.com);
  retrieveCommentData(prop.com);
});

watch(prop, () => {
  retrieveCommentData(prop.com);
});
</script>

<style scoped>
li{
  list-style-type: none;
}
#ref1{scroll-behavior: smooth;}
</style>
