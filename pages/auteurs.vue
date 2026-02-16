<template>
  <UContainer class="py-8">
    <UCard class="max-w-4xl mx-auto shadow-sm border border-gray-100 dark:border-gray-800">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <UIcon name="i-lucide-users" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white mt-0">Les auteurs</h1>
        </div>
      </template>

      <UTable
        :data="globalState.authors"
        :columns="columns"
        :ui="{
          thead: 'hidden',
          tr: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
          td: 'py-4 px-6'
        }"
      >
        <template #name-cell="{ row }">
          <div class="flex items-center gap-4">
            <UAvatar
              v-if="row.original.avatar"
              :src="'https://admin.nomotechnia.rubidiumweb.fr/assets/' + row.original.avatar + '?fit=cover&width=100&height=100&quality=80'"
              :alt="row.original.first_name + ' ' + row.original.last_name"
              size="lg"
            />
            <div class="flex flex-col">
              <span class="text-lg font-bold text-gray-900 dark:text-white">
                {{ row.original.first_name }} {{ row.original.last_name }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                Auteur contributeur
              </span>
            </div>
          </div>
        </template>

        <template #action-cell="{ row }">
          <div class="flex justify-end">
            <UButton
              :to="'/auteur-' + row.original.last_name"
              color="primary"
              variant="soft"
              icon="i-lucide-arrow-right"
              label="Voir les commentaires"
              size="sm"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </UContainer>
</template>

<script setup>
const globalState = useGlobalState();

const columns = [
  { accessorKey: 'name', header: 'Auteur' },
  { accessorKey: 'action', header: '', class: 'w-48' }
];
</script>
