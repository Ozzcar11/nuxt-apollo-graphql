<script setup lang="ts">
import { computed, defineModel, ref } from "vue";
import { type InputProps } from "./types";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

import { EsrIcon } from "@/components/ui/icon";

const props = withDefaults(defineProps<InputProps>(), {
  color: "primary",
  size: "medium",
  type: "text",
  placeholder: "",
  invalid: false,
  disabled: false,
  clearable: false,
  width: "",
  maxWidth: "",
  prefixIcon: "",
  postfixIcon: "",
  errorMessages: null,
  label: "",
  hint: "",
  mask: null,
  maskTokens: null,
});

const modelValue = defineModel<string | number | null>("modelValue", { default: "" });

const ns = useBEMNamespace("esr-input");

const input = ref<HTMLInputElement>();
const typeValue = ref<string>(props.type);

const inputClasses = computed(() => [
  ns.block(),
  ns.modifier(props.color),
  ns.modifier(props.size),
  ns.modifier(props.clearable ? "clearable" : ""),
  ns.modifier(props.type === "password" ? "password" : ""),
  ns.modifier(props.disabled ? "disabled" : ""),
  ns.modifier(haveErrors.value),
]);

const inputStyles = computed(() => ({
  "--width": props.width,
  "--max-width": props.maxWidth,
}));

const showButtons = computed(() => {
  if (!props.clearable && props.type !== "password") return false;

  return modelValue.value && modelValue.value?.toString().length > 0;
});

const haveErrors = computed(() => {
  if (props.invalid) return "error";

  if (props.disabled || !props.errorMessages) return;

  return props.errorMessages.length > 0 ? "error" : undefined;
});

function focusInput() {
  if (props.disabled) return;

  input.value?.focus();
}

function clear() {
  if (props.disabled) return;

  modelValue.value = "";
}

function showPassword() {
  typeValue.value = typeValue.value === "password" ? "text" : "password";
}

</script>

<template>
  <div
    :class="inputClasses"
    :style="inputStyles"
  >
    <div
      v-if="label !== ''"
      class="esr-input__label"
    >
      {{ label }}
    </div>
    <div
      tabindex="-1"
      class="esr-input__wrapper"
      @click="focusInput"
    >
      <div
        v-if="prefixIcon !== ''"
        class="esr-input__prefix-icon"
      >
        <esr-icon
          :icon="prefixIcon"
        />
      </div>

      <input
        ref="input"
        v-model="modelValue"
        v-maska:[maskOptions]
        class="esr-input__input"
        :data-maska="mask"
        :disabled="disabled"
        :type="typeValue"
        :placeholder="placeholder"
      >
      <Transition name="slide-fade">
        <div
          v-if="showButtons"
          class="esr-input__btn"
        >
          <EsrIcon
            v-if="type === 'password'"
            :icon="typeValue === 'password' ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
            class="pointer"
            @click="showPassword"
          />
          <EsrIcon
            v-if="clearable"
            icon="mdi-close"
            class="esr-input__btn-close"
            @click="clear"
          />
        </div>
      </Transition>
    </div>
    <div
      v-if="hint !== '' || haveErrors"
      class="esr-input__hint"
      :class="{ 'esr-input__hint--error': haveErrors }"
    >
      {{ haveErrors ? errorMessages?.[0] : hint }}
    </div>
  </div>
</template>

<style lang="scss">

.esr-input {
  --width: auto;
  --max-width: none;
  --border-primary: var(--surface-accent);

  width: var(--width);
  max-width: var(--max-width);

  &__wrapper {
    position: relative;
    display: flex;
    width: 100%;
    color: var(--text-primary);
    line-height: 24px;
    background-color: var(--surface-light);
    border: 1.5px solid var(--stroke-secondary);
    border-radius: var(--corner-radius-surface-small);
    outline: none;
    overflow: hidden;

    &:hover {
      color: var(--text-primary);
      border: 1.5px solid var(--stroke-primary);
    }

    &:focus-within {
      border: 1.5px solid var(--border-primary);
    }

    .esr-input--medium & {
      padding: 7px 12px;
    }

    .esr-input--large & {
      padding: 11px 16px;
    }

    .esr-input--password & {
      padding-right: 36px;
    }

    .esr-input--clearable & {
      padding-right: 36px;
    }

    .esr-input--error & {
      border: 1.5px solid var(--service-error);
    }

    .esr-input--clearable.esr-input--password {
      padding-right: 68px;
    }

    .esr-input--disabled & {
      color: var(--text-secondary, #7C879F);
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

  &__prefix-icon {
    margin-right: 10px;
    width: 22px;
    height: 22px;

    svg {
      fill: var(--icon-secondary, #7C879F);
    }
  }

  &__btn {
    color: var(--text-secondary);
    position: absolute;
    right: 10px;
    display: inline-flex;

    &-close {
      margin-left: 6px;
      cursor: pointer;
    }
  }

  input {
    outline: none;
    width: 100%;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
    }
  }
}
</style>
