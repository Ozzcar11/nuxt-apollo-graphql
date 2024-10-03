<script setup lang="ts">
import { computed, useSlots } from "vue";
import { useRouter } from "vue-router";
import { type ButtonEmits, type ButtonProps } from "./types";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

import { EsrIcon } from "@/components/ui/icon";

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  color: "primary",
  size: "medium",
  maxWidth: "100%",
  prefixIcon: "",
  postfixIcon: "",
  to: "",
});

const emit = defineEmits<ButtonEmits>();

const ns = useBEMNamespace("esr-button");
const slots = useSlots();
const router = useRouter();

const buttonClasses = computed(() => [
  ns.block(),
  ns.modifier(props.color),
  ns.modifier(props.size),
  !hasSlot.value ? ns.modifier("empty") : ns.modifier("not-empty"),
]);

const hasSlot = computed(() => {
  return !!slots.default;
});

function buttonClickHandler(event: Event) {
  emit("click", event);

  if (props.to !== "") void router.push(props.to);
}

</script>

<template>
  <button
    type="button"
    :class="buttonClasses"
    :disabled="disabled"
    @click="buttonClickHandler"
  >
    <esr-icon
      v-if="prefixIcon !== ''"
      :icon="prefixIcon"
      :class="{'esr-button__prefix-icon' : !hasSlot}"
    />
    <slot />
    <esr-icon
      v-if="postfixIcon !== ''"
      :icon="postfixIcon"
      :class="{'esr-button__postfix-icon' : !hasSlot}"
    />
  </button>
</template>

<style lang="scss">

.esr-button {
  width: auto;
  max-width: 100%;
  border-radius: var(--corner-radius-surface-small);
  font-weight: 500;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &__postfix-icon {
    width: 24px;
    height: 24px;
  }

  &__prefix-icon {
    width: 24px;
    height: 24px;
  }

  &--primary {
    color: var(--text-primary-inverted);
    background-color: var(--surface-accent);

    &:hover {
      background-color: var(--surface-accent-dark-s);
    }

    &:active {
      background-color: var(--surface-accent-dark-m);
    }
  }

  &--secondary {
    color: var(--surface-accent);
    background-color: var(--surface-gray-light-s);

    &:hover {
      background-color: var(--surface-accent-light-m);
    }

    &:active {
      background-color: var(--surface-accent-light-xl);
    }
  }

  &--light {
    color: var(--text-primary);
    background-color: var(--surface-light);
    box-shadow:  0 4px 16px 0 rgba(5, 25, 69, 0.04);

    &:hover {
      background-color: var(--surface-gray-light-m);
    }

    &:active {
      background-color: var(--surface-gray);
    }
  }

  &--error {
    color: var(--service-error, #E3000F);
    background: var(--service-error-light, #F6E9ED);

    &:hover {
      background: var(--service-error-error-light-m, #FDDAE5);
    }

    &:active {
      background: var(--service-error-error-light-l, #FCC4D6);
    }
  }

  &--large {
    padding: 12px 20px;
    height: 48px;

    &.esr-button--empty {
      padding: 12px;
    }

    @include screen-mobile {
      padding: 8px 16px;
      height: 40px;

      @include text-sm;
    }
  }

  &--medium {
    padding: 8px 20px;

    &.esr-button--empty {
      padding: 8px;
    }

    @include screen-tablet {
      padding: 8px 16px;

      @include text-sm;
    }
  }

  &--blue {
    color: var(--text-accent);
    box-shadow: none;
  }

  &:focus {
    border-color: none;
  }

  &:disabled,
  &[disabled] {
    color: var(--text-secondary);
    background-color: var(--surface-gray-light-m);
  }

}
</style>
