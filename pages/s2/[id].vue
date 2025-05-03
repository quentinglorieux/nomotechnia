<template>
    <div class="p-6">
      <NuxtLink to="/s2" class="text-sm text-gray-600">← Retour</NuxtLink>
      <h1 class="text-2xl font-bold mb-2">{{ source?.titre }}</h1>
      <FlexibleEditorContent
        v-if="source?.content"
        :content="source.content"
        :relation-marks="relationMarks"
        :relation-blocks="relationBlocks"
        :relation-inline-blocks="relationInlineBlocks"
      />
    </div>
    <p>
            Rendered result:
            <button @click="showRelationNodes = !showRelationNodes">Toggle Relation Nodes</button>
            <button @click="showComponentSerializers = !showComponentSerializers">Toggle component serializers</button>
        </p>

        <h1> Test </h1>

        <FlexibleEditorContent
            :content="source?.content"
            :component-serializers="showComponentSerializers ? componentSerializers : []"
            :relation-blocks="showRelationNodes ? relationBlocks : []"
            :relation-inline-blocks="showRelationNodes ? relationInlineBlocks : []"
            :relation-marks="showRelationNodes ? relationMarks : []"
            class="result"
        />

        <h2> Raw</h2>
    {{ source.content }}<br> 
    {{ relationMarks }}
  </template>
  
  <script setup>
  import { injectDataIntoContent } from 'directus-extension-flexible-editor/content'
  import RelatedComment from '~/components/RelatedComments.vue'
  import Textfield from '~/components/Textfield.vue'
  import { useRoute } from 'vue-router'
  import FlexibleEditorContent from "directus-extension-flexible-editor/content/vue";
  
  const route = useRoute()
  const config = useRuntimeConfig()

  const showComponentSerializers = ref(false);
  const showRelationNodes = ref(true);
  
  const { data: response } = await useFetch(`/items/sources/${route.params.id}`, {
  baseURL: config.public.API_BASE_URL,
  params: {
    fields: 'id,titre,content,editor_nodes.*',
  },
  credentials: 'include',
})

const source = ref(response.value.data)

injectDataIntoContent(source.value.editor_nodes, source.value.content)


const componentSerializers = [
        // marks with `type: 'mark'`
        {
            name: "relation-mark",
            type: "mark",
            render: (attrs) => [
                Textfield,
                { ...attrs, style: "background:lightblue" },
            ],
        },
    ];
  
  const relationMarks = [
    { collection: 'related_comments', component: RelatedComment },
  ]
  </script>