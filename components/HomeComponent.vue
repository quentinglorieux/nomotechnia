<template>
  <div class="p-1 min-h-screen">
    <!-- <h1 class="home-titre" style="text-align: center">
      Projet Juris 
    </h1> -->
    <div class="homepage-container">

            <!-- Left COLUMN -->
            <div class="home-sidebar">
        <DataView :value="items" :layout="layout">
          <template #grid="slotProps">
            <div class="col-12 p-1">
              <NuxtLink :to="slotProps.data.to" class="block">
                <div
                  class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded transition-all"
                >
                  <i
                    :class="slotProps.data.icon"
                    class="text-xl text-blue-700"
                  ></i>
                  <div class="text-lg small-caps font-medium text-gray-800">
                    {{ slotProps.data.label }}
                  </div>
                </div>
              </NuxtLink>
            </div>
          </template>
        </DataView>
      </div>

      <div class="home-chapeau">
        <div>
          <h1>📘 Qu’est-ce que Nomotechnia ?</h1>
          <p>
            🏛️
            <em>Lire, comprendre, commenter les grands arrêts britanniques</em>
          </p>
          <p>
            <strong>Nomotechnia</strong> est une plateforme collaborative dédiée
            à l’étude, à l’annotation et à la compréhension des grands arrêts de
            la jurisprudence britannique.
          </p>
          <p>
            Notre objectif : offrir un outil structurant pour naviguer dans la
            complexité du droit à travers
            <strong>les décisions de justice majeures</strong>, enrichies par
            des <strong>commentaires analytiques</strong>, des
            <strong>mots-clés</strong> pertinents, et une
            <strong>organisation thématique rigoureuse</strong>.
          </p>

          <h2>🔍 Ce que vous trouverez</h2>
          <ul>
            <li>
              Des décisions de justice fondatrices (House of Lords, Supreme
              Court, Court of Appeal…)
            </li>
            <li>
              Des commentaires argumentés par des enseignants, chercheurs ou
              praticiens
            </li>
            <li>
              Un classement par mots-clés pour explorer les notions juridiques
              majeures
            </li>
            <li>
              Une navigation par grands thèmes (droit constitutionnel, libertés
              publiques…)
            </li>
          </ul>

          <h2>🧭 Pour commencer</h2>
          <ul>
            <li>
              <strong>Explorer les grands arrêts</strong> par date, juridiction
              ou importance
            </li>
            <li><strong>Lire les commentaires</strong> associés</li>
            <li><strong>Rechercher par mot-clé ou thème</strong></li>
          </ul>

          <h2>🤝 Contribuer</h2>
          <p>
            Juriste, enseignant, étudiant ? Vous pouvez
            <strong>proposer un commentaire</strong>,
            <strong>suggérer un arrêt</strong> ou
            <strong>corriger une fiche existante</strong>.
          </p>

          <h3 style="margin-top: 2em">📚 Pourquoi ce projet ?</h3>
          <p>
            Parce que le <strong>droit est vivant</strong>, et que sa
            compréhension passe par un dialogue critique avec la jurisprudence.
          </p>
          <p>
            Parce que les arrêts sont des récits, des constructions doctrinales,
            des vecteurs de normes. Et parce que le droit britannique, par sa
            tradition de <em>common law</em>, se prête particulièrement bien à
            une lecture en réseau.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
const layout = ref("grid");

const items = ref([
  {
    label: "Sources",
    icon: "pi pi-fw pi-th-large",
    to: "/sources",
  },
  {
    label: "Mots-clés",
    icon: "pi pi-fw pi-tags",
    to: "/keywords",
  },
  {
    label: "Thèmes",
    icon: "pi pi-fw pi-list",
    to: "/themes",
  },
  {
    label: "Auteurs",
    icon: "pi pi-fw pi-users",
    to: "/auteurs",
  },
]);

// async function retrieveAuthors() {
//   const { data: publicData } = await useAsyncData(() => {
//     return $directus.items("directus_users").readByQuery({
//       fields: ["first_name,last_name,role"],
//       filter: {
//         role: {
//           _starts_with: "aeeefb57-7b36",
//         },
//       },
//     });
//   });

//   store.authors = publicData.value.data;

//   for (let author of store.authors) {
//     // items.value[1].items[3].items.push({
//     items.value[4].items.push({
//       label: author.last_name,
//       icon: "pi pi-fw pi-user",
//       to: "/auteur-" + author.last_name,
//     });
//   }
// }
</script>
