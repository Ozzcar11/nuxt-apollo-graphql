<script setup lang="ts">
import { computed } from "vue";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

const ns = useBEMNamespace("esr-skeleton");

const componentClasses = computed(() => [
  ns.block(),
]);
</script>

<template>
  <div :class="componentClasses" />
</template>

<style lang="scss">
.esr-skeleton {
  border-radius: var(--corner-radius-surface-x-small, 4px);
  background: var(--surface-neutral-neutral, #D8DDE5);
  width: 100%;
  height: 100%;
  min-height: 24px;
  animation: skeleton-loading 1s linear infinite alternate;

  @keyframes skeleton-loading {
    0% {
      background-color: hsl(200deg, 20%, 80%);
    }

    100% {
      background-color: hsl(200deg, 20%, 95%);
    }
  }
}
</style>
