<script lang="ts" setup>
import { computed } from "vue";
import { type ComponentColors } from "@/types";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

const props = withDefaults(defineProps<{
  label: string;
  color?: ComponentColors;
}>(), {
  color: "primary",
});

const ns = useBEMNamespace("esr-text");

const textClasses = computed(() => [
  ns.block(),
  ns.modifier(props.color),
]);

</script>

<template>
  <span :class="textClasses">
    <div class="esr-text__label">{{ label }}</div>
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.esr-text {
  font-weight: 400;

  &__label {
    margin-bottom: 4px;
    font-weight: 400;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    @include text-sm;
  }

  &--primary {
    color: var(--text-primary);

    & .esr-text__label {
      color: var(--text-secondary);
    }
  }

  &--light {
    color: var(--text-primary-inverted);

    & .esr-text__label {
      color: var(--text-secondary-inverted);
    }
  }
}
</style>
