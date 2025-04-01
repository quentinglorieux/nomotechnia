<template>
  <div class="flex p-3 pt-4">
    <NuxtLink
      v-if="theme"
      to="/themes"
      @click="navStore.selectedThemeID = theme.id"
    >
      <Tag
        class="mr-2 text-lg hover:bg-slate-700"
        :value="theme.titre"
      />
    </NuxtLink>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useNavStore } from "~/stores/navigation";

const navStore = useNavStore();
const props = defineProps(["source"]);

// Safe access to theme
const theme = computed(() => props.source?.data?.theme_id ?? null);
</script>