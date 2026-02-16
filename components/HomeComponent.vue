<template>
  <UContainer class="py-8 min-h-screen">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left COLUMN: Navigation Menu -->
      <nav class="lg:col-span-3 space-y-3">
        <NuxtLink 
          v-for="item in items" 
          :key="item.to" 
          :to="item.to"
          class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-200 dark:hover:border-primary-800 transition-all group shadow-sm"
        >
          <UIcon 
            :name="item.icon" 
            class="text-2xl text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" 
          />
          <div class="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight">
            {{ item.label }}
          </div>
        </NuxtLink>
      </nav>

      <!-- Right COLUMN: Intro Content -->
      <main class="lg:col-span-9 bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm prose dark:prose-invert max-w-none">
        <div class="space-y-6">
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-4 mt-0">
             Qu’est-ce que Nomotechnia ?
          </h1>
          
          <div class="flex items-center gap-2 text-xl italic text-primary-600 dark:text-primary-400">
            <span></span>
            <em>Lire, comprendre, commenter les grands arrêts britanniques</em>
          </div>

          <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            <strong class="text-gray-900 dark:text-white">Nomotechnia</strong> est une plateforme collaborative dédiée
            à l’étude, à l’annotation et à la compréhension des grands arrêts de
            la jurisprudence britannique.
          </p>

          <p class="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Notre objectif : offrir un outil structurant pour naviguer dans la
            complexité du droit à travers
            <strong class="text-gray-900 dark:text-white">les décisions de justice majeures</strong>, enrichies par
            des <strong class="text-gray-900 dark:text-white">commentaires analytiques</strong>, des
            <strong class="text-gray-900 dark:text-white">mots-clés</strong> pertinents, et une
            <strong class="text-gray-900 dark:text-white">organisation thématique rigoureuse</strong>.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-800">
            <section>
              <h2 class="text-2xl font-bold flex items-center gap-2 mb-4 mt-0 text-gray-900 dark:text-white">
                <UIcon name="i-lucide-search" class="text-primary-500" />
                Ce que vous trouverez
              </h2>
              <ul class="space-y-3 list-none pl-0 mt-0">
                <li v-for="(point, i) in findings" :key="i" class="flex gap-3 text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-check-circle-2" class="shrink-0 w-5 h-5 text-green-500 mt-1" />
                  <span>{{ point }}</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 class="text-2xl font-bold flex items-center gap-2 mb-4 mt-0 text-gray-900 dark:text-white">
                <UIcon name="i-lucide-compass" class="text-primary-500" />
                Pour commencer
              </h2>
              <ul class="space-y-3 list-none pl-0 mt-0">
                <li v-for="(step, i) in steps" :key="i" class="flex gap-3 text-gray-700 dark:text-gray-300">
                  <UIcon name="i-lucide-arrow-right-circle" class="shrink-0 w-5 h-5 text-primary-500 mt-1" />
                  <span>{{ step }}</span>
                </li>
              </ul>
            </section>
          </div>

          <div class="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-xl border border-primary-100 dark:border-primary-800 mt-8">
            <h2 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4 mt-0">Contribuer</h2>
            <p class="mb-0 text-primary-800 dark:text-primary-200">
              Juriste, enseignant, étudiant ? Vous pouvez
              <strong class="text-primary-900 dark:text-white">proposer un commentaire</strong>,
              <strong class="text-primary-900 dark:text-white">suggérer un arrêt</strong> ou
              <strong class="text-primary-900 dark:text-white">corriger une fiche existante</strong>.
            </p>
          </div>

          <div class="pt-8 opacity-90 border-t border-gray-100 dark:border-gray-800">
            <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Pourquoi ce projet ?</h3>
            <p class="text-gray-700 dark:text-gray-300">
              Parce que le <strong class="text-gray-900 dark:text-white">droit est vivant</strong>, et que sa
              compréhension passe par un dialogue critique avec la jurisprudence.
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              Parce que les arrêts sont des récits, des constructions doctrinales,
              des vecteurs de normes. Et parce que le droit britannique, par sa
              tradition de <em>common law</em>, se prête particulièrement bien à
              une lecture en réseau.
            </p>
          </div>
        </div>
      </main>
    </div>
  </UContainer>
</template>

<script setup>
const items = [
  { label: "Sources", icon: "i-lucide-library", to: "/sources" },
  { label: "Mots-clés", icon: "i-lucide-tags", to: "/keywords" },
  { label: "Thèmes", icon: "i-lucide-list", to: "/themes" },
  { label: "Auteurs", icon: "i-lucide-users", to: "/auteurs" },
];

const findings = [
  "Des décisions de justice fondatrices (House of Lords, Supreme Court, Court of Appeal...)",
  "Des commentaires argumentés par des enseignants, chercheurs ou praticiens",
  "Un classement par mots-clés pour explorer les notions juridiques majeures",
  "Une navigation par grands thèmes (droit constitutionnel, libertés publiques...)"
];

const steps = [
  "Explorer les grands arrêts par date, juridiction ou importance",
  "Lire les commentaires associés",
  "Rechercher par mot-clé ou thème"
];
</script>
