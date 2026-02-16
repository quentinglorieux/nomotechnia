<template>
  <mark
    class="cursor-pointer text-green-700 underline dark:text-green-400 group relative inline-block"
    @click="navState.comID = id; navState.comVisibility = true"
  >
    <slot>{{ id || 'Commentaire lié' }}</slot>
    <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      Voir le commentaire
    </span>
  </mark>
</template>

<script setup>
const navState = useNavState();

defineProps({
  id: {},
  junction: {},
  collection: {},
  data: {}
});
</script>