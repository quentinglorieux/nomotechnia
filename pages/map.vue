<template>
  <UContainer class="py-12">
    <UCard class="flex flex-col items-center justify-center p-12 text-center bg-gray-50/10 dark:bg-gray-900/10 border-dashed border-2 border-gray-200 dark:border-gray-800">
      <div class="p-4 bg-primary-100 dark:bg-primary-900/40 rounded-full mb-6">
        <UIcon name="i-lucide-map" class="w-12 h-12 text-primary-600 dark:text-primary-400" />
      </div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Carte Interactive</h1>
      <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg font-medium">
        La visualisation cartographique est actuellement en cours de développement. Elle permettra bientôt d'explorer les sources et les commentaires par zone géographique.
      </p>
      <UButton to="/" size="lg" icon="i-lucide-arrow-left" color="neutral">
        Retour à l'accueil
      </UButton>
    </UCard>
  </UContainer>
</template>

<script setup>
definePageMeta({
  title: 'Carte'
})
</script>