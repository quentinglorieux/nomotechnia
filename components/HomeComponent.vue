<template>
  <div class="p-1 min-h-screen">
    <!-- <h1 class="home-titre" style="text-align: center">
      Projet Juris 
    </h1> -->
    <div class="home-chapeau ">
      <p>
        Courte description u projet : lorem ipsum dolor sit amet, consectetur
        adipiscing elit. Morbi bibendum efficitur neque et congue. Phasellus ut
        velit tortor. Donec sollicitudin ante at auctor aliquet. Praesent eu
        suscipit erat. Vestibulum feugiat justo nec lacus pulvinar aliquam sit
        amet vehicula augue. Nullam elementum orci sit amet volutpat
        condimentum. Nam ac dictum leo. Sed bibendum laoreet fermentum.
        Suspendisse a enim a dui accumsan commodo. Sed convallis, nibh ac
        tristique feugiat, erat nisl suscipit est, id dapibus orci orci id
        metus.
      </p>
    </div>

    <div>
      <DataView :value="items" :layout="layout">
        <!-- <template #header>
          <div class="flex justify-content-end">
            <DataViewLayoutOptions v-model="layout" />
          </div>
        </template> -->

        <!-- <template #list="slotProps">
          <div class="col-12">
            <div
              class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
            >
              <div
                class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
              >
                <div
                  class="flex flex-column align-items-center sm:align-items-start gap-3"
                >
                  <div class="text-2xl font-bold text-900">
                    {{ slotProps.data.label }} 
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </template> -->

        <template #grid="slotProps">
          <div class="col-12 sm:col-6 lg:col-12 xl:col-2 p-2">
            <div class="p-4">
              <NuxtLink :to="slotProps.data.to">
                <div class=" flex flex-column align-items-center gap-3 py-5 hover:text-blue-800">
                  <i :class="slotProps.data.icon" style="font-size: 5rem"></i>
                  <div class="text-2xl">{{ slotProps.data.label }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </template>
      </DataView>
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
