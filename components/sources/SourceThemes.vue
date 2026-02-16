<template>
  <div class="flex p-3 pt-4">
    <NuxtLink
      v-if="theme"
      to="/themes"
      class="inline-block"
      @click="navState.selectedThemeID = theme.id"
    >
      <UBadge
        :label="theme.titre"
        size="lg"
        variant="solid"
        class="cursor-pointer hover:bg-primary-600 transition-colors shadow-sm"
      />
    </NuxtLink>
  </div>
</template>

<script setup>
const navState = useNavState();
const props = defineProps(["source"]);

const theme = computed(() => props.source?.data?.theme_id ?? null);
</script>