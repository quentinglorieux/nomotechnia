<template>
    <FlexibleEditorContent
      :content="content"
      :component-serializers="componentSerializers"
      :relation-blocks="relationBlocks"
      :relation-inline-blocks="relationInlineBlocks"
      :relation-marks="relationMarks"
      class="flexible-renderer"
    />
  </template>
  
  <script setup lang="ts">
  import FlexibleEditorContent, {
    VueComponentSerializers,
    VueRelationNodeSerializers,
    JSONContent
  } from 'directus-extension-flexible-editor/content/vue'
  
  import type { RelationNodeProps } from 'directus-extension-flexible-editor/content'
  import RelatedComment from './sources/RelatedComment.vue'
  
  // Props
  defineProps<{
    content: JSONContent
  }>()
  
  // Define your serializers (adjust to your Directus setup)
  const componentSerializers: VueComponentSerializers = []
  
  const relationBlocks: VueRelationNodeSerializers = []
  const relationInlineBlocks: VueRelationNodeSerializers = []
  const relationMarks: VueRelationNodeSerializers = [
    { collection: 'commentaires', component: RelatedComment }
  ]
  </script>