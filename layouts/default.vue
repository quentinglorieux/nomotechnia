<template>
  <div class="h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased selection:bg-primary-500/30">
    <!-- Main Topbar -->
    <AppTopbar />

    <!-- Main Content Area -->
    <main class="relative flex-1 min-h-0 flex flex-col overflow-hidden">
      <slot />
    </main>

    <!-- Global Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
// Modern Nuxt 4 layout with Nuxt UI 4
</script>

<style>
/* Smooth page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Base scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
