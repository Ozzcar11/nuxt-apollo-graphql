<script setup lang="ts">
import AppHeader from "~/components/app/header/app-header.vue";
</script>

<template>
  <main
    id="main"
    class="main"
  >
    <app-header />
    <slot />
  </main>
</template>

<style lang="scss">
.main {
  width: 100%;
  min-height: 100vh;

  &__account {
      background: var(--surface-gray-light-s);
  }

}
</style>
