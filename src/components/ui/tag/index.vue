<script lang="ts" setup>
import { computed } from "vue";
import { type TagProps } from "./types";
import { EsrIcon } from "@/components/ui/icon";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

const props = withDefaults(defineProps<TagProps>(), {
  closable: false,
  color: "gray",
  disabled: false,
});

defineEmits<{
  (e: "close", event: Event): void;
}>();

const ns = useBEMNamespace("esr-tag");

const tagClasses = computed(() => [
  ns.block(),
  ns.modifier(props.color),
  ns.modifier(props.disabled ? "disabled" : ""),
]);

</script>

<template>
  <span
    :class="tagClasses"
  >
    <span class="esr-tag__text">
      <slot />
    </span>
    <esr-icon
      v-if="closable"
      icon="mdi-close"
      size="16"
      @click="$emit('close', $event)"
    />
  </span>
</template>

<style lang="scss" scoped>
.esr-tag {
  @include text-sm;

  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  border-radius: var(--corner-radius-surface-x-small, 4px);
  gap: 4px;
  line-height: 24px;

  .esr-icon {
    width: 16px;
    height: 16px;
    color: var(--icon-secondary);
    cursor: pointer;
  }

  &--gray {
    color: var(--text-primary);
    background: var(--surface-gray-light-m, #F4F6F7);

    &:hover {
      background: var(--surface-gray, #D8DDE5);
    }
  }

  &--blue {
    color: var(--text-primary-inverted, #FFF);
    background: var(--surface-accent, #14509F);

    .esr-icon {
      color: var(--icon-secondary-inverted);
    }

    &:hover {
      background: var(--surface-accent-dark-m, #153275);
    }
  }

  &--light {
    color: var(--text-primary);
    background: var(--surface-light, #FFF);
    box-shadow: 0 4px 24px 0 rgba(5, 25, 69, 0.08);

    &:hover {
      background: var(--surface-gray-light-s, #F8FAFC);
    }
  }

  &--blue-light {
    color: var(--text-accent, #14509F);
    background: var(--surface-accent-light-l, #E6ECF5);

    .esr-icon {
      color: var(--icon-accent);
    }
  }

  &--disabled {
    color: var(--text-secondary);
    background: var(--surface-gray-light-m, #F4F6F7);
  }

  & + & {
    margin-left: 4px;
  }
}
</style>
