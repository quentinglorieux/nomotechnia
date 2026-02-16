<template>
  <div class="flex flex-wrap gap-2 p-3">
    <div v-if="!kwList.length" class="text-sm text-gray-500 italic p-4 text-center w-full">
      Aucun mot-clé pour cette source.
    </div>
    <NuxtLink
      v-for="kw in kwList"
      :key="kw.id"
      to="/keywords"
      class="group inline-flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-primary-900/30 rounded-full border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200"
      @click="navState.selectedKeywordID = kw.id"
    >
      <UAvatar
        :alt="kw.titre?.[0]"
        size="xs"
        class="bg-primary/20 text-primary-700 font-bold"
      />
      <span class="text-xs font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-400">
        {{ kw.titre }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup>
const navState = useNavState();
const globalState = useGlobalState();
const props = defineProps(["source"]);
const { $directus } = useNuxtApp();

const kwList = ref([]);

async function retrieveKeywords() {
  try {
    const data = await $directus.request({
      method: 'GET',
      path: '/items/keywords',
      params: {
        fields: [
          "titre",
          "id",
          "introduction",
          "commentaires.commentaires_id.titre",
          "commentaires.commentaires_id.id",
          "commentaires.commentaires_id.auteur_id.first_name",
          "commentaires.commentaires_id.auteur_id.last_name",
          "commentaires.commentaires_id.source_id.id",
          "commentaires.commentaires_id.source_id.titre",
        ],
        filter: {
          commentaires: {
            _nnull: true,
          },
        },
      }
    });

    if (data) {
      globalState.value.keywords = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
    }
  } catch (error) {
    console.error('Error fetching keywords:', error);
  }
}

function listDuplicate() {
  const l1 = [];
  const sourceCommentaires = props.source?.data?.commentaires || [];

  for (let com of sourceCommentaires) {
    if (Array.isArray(com.keywords_id)) {
      for (let kwEntry of com.keywords_id) {
        if (kwEntry?.keywords_id) {
          l1.push({
            titre: kwEntry.keywords_id.titre,
            id: kwEntry.keywords_id.id,
          });
        }
      }
    }
  }

  // Remove duplicates
  const uniqueMap = new Map();
  return l1.filter((obj) => {
    const key = obj.id;
    return !uniqueMap.has(key) && uniqueMap.set(key, obj);
  });
}

watch(() => props.source, () => {
  kwList.value = listDuplicate();
}, { deep: true });

onMounted(() => {
  kwList.value = listDuplicate();
  if (!globalState.value.keywords?.length) {
    retrieveKeywords();
  }
});
</script>
