<script setup lang="ts">
import { computed, defineModel, ref, unref } from "vue";
import { type TextareaProps } from "./types";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

const props = withDefaults(defineProps<TextareaProps>(), {
  disabled: false,
  size: "medium",
  placeholder: "",
  width: "",
  maxWidth: "",
  errorMessages: null,
  label: "",
  hint: "",
});

const modelValue = defineModel<string | null>({ default: "" });

const ns = useBEMNamespace("esr-textarea");

const textarea = ref<HTMLTextAreaElement>();

const textareaClasses = computed(() => [
  ns.block(),
  ns.modifier(props.size),
  ns.modifier(props.disabled ? "disabled" : ""),
  ns.modifier(haveErrors.value),
]);

const textareaStyles = computed(() => ({
  "--width": props.width,
  "--max-width": props.maxWidth,
}));

const haveErrors = computed(() => {
  if (!props.errorMessages || props.disabled) return;

  return props.errorMessages.length > 0 ? "error" : undefined;
});

function focusInput() {
  if (props.disabled) return;

  textarea.value?.focus();
}
</script>

<template>
  <div
    :class="textareaClasses"
    :style="textareaStyles"
  >
    <div
      v-if="label !== ''"
      class="esr-textarea__label"
    >
      {{ label }}
    </div>
    <div
      tabindex="-1"
      class="esr-textarea__wrapper"
      @click="focusInput"
    >
      <textarea
        ref="textarea"
        v-model="modelValue"
        class="esr-textarea__input"
        :disabled="disabled"
        :placeholder="placeholder"
      />
    </div>
    <div
      v-if="hint !== '' || unref(errorMessages)?.length"
      class="esr-textarea__hint"
      :class="{ 'esr-textarea__hint--error': haveErrors }"
    >
      {{ haveErrors ? unref(errorMessages)?.[0] : hint }}
    </div>
  </div>
</template>

<style lang="scss">

.esr-textarea {
  --width: auto;
  --max-width: none;
  --border-primary: var(--surface-accent);

  &__wrapper {
    position: relative;
    width: var(--width);
    max-width: var(--max-width);
    color: var(--text-primary);
    border: 1.5px solid var(--stroke-secondary);
    border-radius: var(--corner-radius-surface-small);
    background-color: var(--surface-light);
    line-height: 24px;
    outline: none;
    overflow: hidden;

    &::placeholder {
      color: var(--text-secondary);
    }

    &:hover {
      color: var(--text-primary);
      border: 1.5px solid var(--stroke-primary);
    }

    &:focus-within {
      border: 1.5px solid var(--border-primary);
    }

    .esr-textarea--medium & {
      padding: 7px 12px;
    }

    .esr-textarea--large & {
      padding: 11px 16px;
    }

    .esr-textarea--error & {
      border: 1.5px solid var(--service-error);
    }

    .esr-textarea--disabled & {
      background-color: var(--surface-accent-light-m);

      &:focus-within {
        border: 1.5px solid var(--surface-accent-light-xl);
      }

      &:hover {
        border: 1.5px solid var(--surface-accent-light-xl);
      }

      input {
        background-color: var(--surface-accent-light-m);
      }
    }
  }

  &__input {
    &::placeholder {
      color: var(--text-secondary);
    }
  }

  &__label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 8px;

    @include text-sm;
  }

  &__hint {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-top: 8px;

    @include text-sm;

    &--error {
      color: var(--service-error);
    }
  }

  textarea {
    outline: none;
    width: 100%;
    height: 100%;

    &::-webkit-resizer {
      display: none;
    }
  }
}
</style>
