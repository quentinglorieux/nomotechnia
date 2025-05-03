<template>
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">Liste des sources</h2>
      <ul>
        <li
          v-for="src in sources.data"
          :key="src.id"
          class="mb-2 text-blue-600 underline cursor-pointer"
        >
          <NuxtLink :to="`/s2/${src.id}`">{{ src.titre }}</NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const config = useRuntimeConfig()
  const { data: sources } = await useFetch('/items/sources', {
    baseURL: config.public.API_BASE_URL,
    params: {
      fields: 'id,titre',
      sort: 'titre',
    },
    credentials: 'include'
  })
  </script>