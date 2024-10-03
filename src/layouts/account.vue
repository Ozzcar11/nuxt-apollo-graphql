<script setup lang="ts">
import AppHeader from "~/components/app/header/app-header.vue";
import AppNav from "~/components/app/account-nav/app-nav.vue";
</script>

<template>
  <div class="main main__account">
    <app-header />
    <app-nav />
    <slot />
  </div>
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
