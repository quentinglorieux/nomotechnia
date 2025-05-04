<template>
  <div>
    <router-link to="/" class="layout-topbar-logo"><h1 class="home-titre" style="text-align: center">NOMOTECHNIA - Grands arrêts britanniques</h1>
    </router-link>
    <div class="layout-topbar">
      <!-- <router-link to="/" class="layout-topbar-logo"> -->
        <!-- <img src="@/assets/logo.png" alt="logo" /> -->


      <Menubar
        class="layout-topbar-menu"
        :class="topbarMenuClasses"
        :model="items"
      />

      <div class="layout-topbar-menu" :class="topbarMenuClasses">
        <button
          @click="onTopBarMenuButton()"
          class="p-link layout-topbar-button"
        >
          <i class="pi pi-search"></i>
          <span>Search</span>
        </button>
        <NuxtLink to="https://admin.nomotechnia.rubidiumweb.fr/" target="_blank"> <button @click="onSettingsClick()" class="p-link layout-topbar-button">
          <i class="pi pi-cog"></i>
          <span>Settings</span>
        </button>
      </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNavStore } from "~/stores/navigation";
import { useGlobalStore } from "~/stores/global";
const navStore = useNavStore();
const store = useGlobalStore();

const { $directus } = useNuxtApp();

const { layoutConfig, onMenuToggle, contextPath } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);

onMounted(() => {
  bindOutsideClickListener();
  onMenuToggle();
});

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});

const items = ref([
  { label: "ACCUEIL", icon: "pi pi-fw pi-home", to: "/" },
  { label: "SOURCES", icon: "pi pi-fw pi-th-large", to: "/sources"  },
  { label: "MOTS-CLÉS", icon: "pi pi-fw pi-tags", to: "/keywords" },
  //   { label: "Thèmes", icon: "pi pi-fw pi-list", to: "/themes" },
  { label: "THÈMES", icon: "pi pi-fw pi-list", items: [] },
  { label: "AUTEURS", icon: "pi pi-fw pi-users", items: [] }, // change the item.value[5] if remove Alt
  { label: "MAP", icon: "pi pi-fw pi-share-alt", to: "/map" },
]);

async function retrieveAuthors() {
  const { data: publicData } = await useAsyncData(() => {
    return $directus.items("directus_users").readByQuery({
      fields: ["*"],
      filter: {
        role: {
          _starts_with: "aeeefb57-7b36",
        },
      },
    });
  });

  store.authors = publicData.value.data;

  items.value[4].items.push({
    label: " - Tous les auteurs - ",
    to: "/auteurs",
  });
  for (let author of store.authors) {
    // items.value[1].items[3].items.push({
    items.value[4].items.push({
      label: author.first_name + " " + author.last_name,
      to: "/auteur-" + author.last_name,
    });
  }
}

async function retrieveThemes() {
  const { data: publicData } = await useAsyncData(() => {
    return $directus.items("themes").readByQuery({
      fields: ["id,titre"],
    });
  });

  store.themes = publicData.value.data;

  for (let theme of store.themes) {
    // items.value[1].items[3].items.push({
    items.value[3].items.push({
      label: theme.titre,
      icon: "pi pi-fw pi-book",
      to: "/themes",
      command: () => {
        navStore.selectedThemeID = theme.id;
        // console.log(navStore.selectedThemeID);
      },
    });
  }
}

// add authors
onMounted(() => {
  if (!store.authors[0]) {
    retrieveAuthors();
  }
  if (!store.themes[0]) {
    retrieveThemes();
  }
});

// const logoUrl = computed(() => {
//     return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
// });

// const logoUrl = "@/assets/logo.png"

const onTopBarMenuButton = () => {
  topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
  topbarMenuActive.value = false;
};
const topbarMenuClasses = computed(() => {
  return {
    "layout-topbar-menu-mobile-active": topbarMenuActive.value,
  };
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener.value) {
    outsideClickListener.value = (event) => {
      if (isOutsideClicked(event)) {
        topbarMenuActive.value = false;
      }
    };
    document.addEventListener("click", outsideClickListener.value);
  }
};
const unbindOutsideClickListener = () => {
  if (outsideClickListener.value) {
    document.removeEventListener("click", outsideClickListener);
    outsideClickListener.value = null;
  }
};
const isOutsideClicked = (event) => {
  if (!topbarMenuActive.value) return;

  const sidebarEl = document.querySelector(".layout-topbar-menu");
  const topbarEl = document.querySelector(".layout-topbar-menu-button");

  return !(
    sidebarEl.isSameNode(event.target) ||
    sidebarEl.contains(event.target) ||
    topbarEl.isSameNode(event.target) ||
    topbarEl.contains(event.target)
  );
};
</script>
