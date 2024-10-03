<script lang="ts" setup>
import { computed } from "vue";
import { EsrDivider } from "@/components/ui/divider";

const props = defineProps<{
  modelValue: number;
  items: string[];
}>();

const selectedItem = computed(() => props.items[props.modelValue]);

</script>

<template>
  <div class="esr-stepper">
    <div
      v-for="(item, index) in props.items"
      :key="index"
      class="esr-stepper__item esr-stepper-item"
    >
      <span
        class="esr-stepper-item__index"
        :class="{'esr-stepper-item__index--selected': item === selectedItem}"
      >
        {{ index + 1 }}
      </span>
      <span class="esr-stepper-item__label">{{ item }}</span>
      <esr-divider
        v-if="index < props.items.length - 1"
        class="esr-stepper-item__divider"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.esr-stepper {
  display: flex;
  overflow-x: auto;

  @include horizontal-scroll;
  @include text-sm;

  &-item {
    display: flex;
    align-items: center;
    white-space: nowrap;

    &__index {
      color: var(--surface-accent);
      background-color: var(--surface-accent-light-l);
      margin-right: 8px;

      &--selected {
        color: var(--surface-light);
        background-color: var(--surface-accent);
      }
    }

    &__label {
      color: var(--text-primary);
      background-color: var(--surface-light);
      box-shadow: 0 4px 16px rgba(5, 25, 69, 0.04);
    }

    &__divider {
      min-width: 55px;
    }

    span {
      padding: 4px 12px;
      border-radius: var(--corner-radius-surface-x-small);
    }
  }
}
</style>
