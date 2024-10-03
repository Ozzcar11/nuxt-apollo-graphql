<script lang="ts" setup>
import { computed } from "vue";
import { type CardProps } from "./types";

const props = withDefaults(defineProps<CardProps>(), {
  maxWidth: "none",
});

const cssProps = computed(() => ({
  "--max-width": props.maxWidth,
}));

</script>

<template>
  <div
    class="esr-card"
    :style="cssProps"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.esr-card {
  --max-width: none;

  max-width: var(--max-width);
  box-shadow: 0 4px 16px rgba(5, 25, 69, 0.04);
  border-radius: var(--corner-radius-surface-medium);
}
</style>
