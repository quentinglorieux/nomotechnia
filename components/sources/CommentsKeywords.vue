<template>
  <div class="flex flex-wrap gap-2 p-3">
    <NuxtLink
      v-for="kw in kwList"
      :key="kw.keywords_id.id"
      to="/keywords"
      class="group inline-flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-primary-50 dark:bg-gray-800 dark:hover:bg-primary-900/30 rounded-full border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200"
      @click="navState.selectedKeywordID = kw.keywords_id.id"
    >
      <UAvatar
        :alt="kw.keywords_id.titre?.[0]"
        size="xs"
        :ui="{ background: 'bg-primary-100 dark:bg-primary-900', fallback: 'text-primary-700 dark:text-primary-400 font-bold' }"
      />
      <span class="text-xs font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary-700 dark:group-hover:text-primary-400">
        {{ kw.keywords_id.titre }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup>
const navState = useNavState();
const props = defineProps(["kwList"]);
</script>
