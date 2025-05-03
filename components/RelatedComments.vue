<template>
  Data {{ id }}
  <mark
    class="cursor-pointer text-green-700 underline"
    @click="navStore.comID = id; navStore.comVisibility = true"
  >
    <slot>{{ id || 'Commentaire lié' }}</slot>
  </mark>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { RelationNodeProps } from 'directus-extension-flexible-editor/content'
import { useNavStore } from '@/stores/navigation'

const navStore = useNavStore()


defineProps<{
        id: RelationNodeProps['id']
        junction: RelationNodeProps['junction']
        collection: RelationNodeProps['collection']
        data?: RelationNodeProps['data']
    }>()
</script>