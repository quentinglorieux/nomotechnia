<template>
  <div class="flex">
    <div
      v-if="fetched_data"
      class="card2 bg-slate-100 p-0 pb-1"
      ref="pdfSection"
    >
      <h1 class="flex justify-between">
        <div class="px-2">
          <h1 class="">{{ fetched_data.titre }}</h1>
          <p class="text-sm pl-3">{{ fetched_data.meta }}</p>
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

      <div v-if="fetched_data.abstract" class="bg-slate-200 p-2 rounded m-2">
        <h3 class="px-2">Résumé:</h3>
        <div class="p-2" v-html="fetched_data.abstract"></div>
      </div>

      <div class="pt-3 px-2 m-2 disp-commentaire" v-html="fetched_data.content"></div>

      <div
        v-if="store.commentaires.references"
        class="bg-slate-200 p-2 mt-10 m-2 rounded"
      >
        <h3 id="references" class="px-2">Références :</h3>
        <div>
          <ul class="px-2 pb-3">
            <li v-for="ref in store.commentaires.references">
              <a :id="'ref' + ref.id"> [{{ ref.id }}] {{ ref.titre }} </a>
              <a :href="'#s' + ref.id"> - Retour </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="fetched_data.citation"
        class="bg-slate-300 p-2 mt-10 m-2 rounded"
      >
        <h3 class="px-2">Citation :</h3>
        <div class="px-2 pb-3" v-html="fetched_data.citation"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import MarkdownIt from "markdown-it";
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
// const md = new MarkdownIt({ html: true });
// const parsedMarkdown = ref();
const parsedHTML = ref();

// DataFetching of the selected Commentaires(id)
const { $directus } = useNuxtApp();
async function retrieveCommentData(id) {
  const { data } = await useAsyncData(() =>
    $directus.items("commentaires").readOne(id, {
      fields: [
        "id",
        "titre",
        "citation",
        "abstract",
        "content",
        "auteur_type",
        "auteur_name",
        "references",
        "meta",
      ],
    })
  );

  if (data.value) {
    fetched_data.value = data.value;
    parsedHTML.value = data.value.content
    // for markdown
    // parsedMarkdown.value = md.render(data.value.content || "");
    // console.log("fetched_data", fetched_data.value);
    store.commentaires.titre = data.value.titre;
    store.commentaires.references = data.value.references;
  }
}

onMounted(() => {
  // console.log(prop.com);
  retrieveCommentData(prop.com);

  const hash = window.location.hash
  if (hash) {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' }) // or instant
    }
  }
  const target = document.querySelector('#references')
if (target) {
  const scrollParent = document.querySelector('.p-scrollpanel-content')
  if (scrollParent) {
    const offset = target.offsetTop
    scrollParent.scrollTo({ top: offset, behavior: 'smooth' })
  }
}
});



watch(prop, () => {
  retrieveCommentData(prop.com);
});
</script>

<style>

.disp-commentaire ul,
.disp-commentaire ol {
  margin-left: 1.25rem;
  padding-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.disp-commentaire ul {
  list-style-type: disc;
}

.disp-commentaire ol {
  list-style-type: decimal;
}

.disp-commentaire li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: #374151; /* Tailwind gray-700 */
  font-size: 0.95rem;
}


#ref1 {
  scroll-behavior: smooth;
}
</style>
