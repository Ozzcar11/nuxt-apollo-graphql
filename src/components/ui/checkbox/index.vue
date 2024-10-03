<script lang="ts" setup>
import { computed } from "vue";
import { type CheckboxEmits, type CheckboxProps } from "./types";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

const props = withDefaults(defineProps<CheckboxProps>(), {
  disabled: false,
});

defineEmits<CheckboxEmits>();

const model = defineModel<boolean>("modelValue", { default: false });

const ns = useBEMNamespace("esr-checkbox");

const checkboxClasses = computed(() => [
  ns.block(),
  ns.modifier(props.disabled ? "disabled" : ""),
]);

</script>

<template>
  <label :class="checkboxClasses">
    <input
      v-model="model"
      class="esr-checkbox__input"
      type="checkbox"
      :disabled="disabled"
    >
    <span class="esr-checkbox__label">
      <slot name="label">
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<style lang="scss">
.esr-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;

  &__input {
    display: inline-block;
    min-width: 20px;
    min-height: 20px;
    margin: 0 11px 0 4px;
    border: 1.5px solid var(--stroke-secondary);
    border-radius: var(--corner-radius-surface-x-small);
    background-color: var(--surface-light);
    appearance: none;
    cursor: pointer;

    &:checked {
      min-width: 25px;
      min-height: 25px;
      border: none;
      margin: 0 12px 0 0;
      background-image: url("/icons/check.svg");
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  &__label {
    text-align: left;
  }

}
</style>
