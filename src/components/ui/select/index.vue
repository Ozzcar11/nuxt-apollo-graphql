<script lang="ts" setup generic="T, O extends string | number | AnyObject">

/**
 * Based on https://github.com/vueform/multiselect
 */

import { computed, unref } from "vue";
import Multiselect from "@vueform/multiselect";
import { type AnyObject } from "@ozzcar11/utilities/types";
import { type SelectProps } from "./types";
import { EsrIcon } from "@/components/ui/icon";
import { EsrTag } from "@/components/ui/tag";
import { useBEMNamespace } from "@/composables/useBEMNamespace";

const props = withDefaults(defineProps <SelectProps<O>>(), {
  placeholder: "Выберите значение",
  mode: "single",
  label: "",
  valueProp: "value",
  labelProp: "label",
  returnObject: false,
  disabled: false,
  size: "medium",
  variation: "default",
  canDeselect: false,
  openDirection: "bottom",
});

defineEmits<{
  (e: "change", value: O): void;
}>();

const ns = useBEMNamespace("esr-multiselect");

const selectClasses = computed(() => [
  ns.block(),
  ns.modifier(props.size),
  ns.modifier(props.variation),
]);

const haveErrors = computed(() => {
  if (!props.errorMessages || props.disabled) return;

  return props.errorMessages.length > 0 ? "error" : undefined;
});

const model = defineModel<T>();
</script>

<template>
  <div :class="selectClasses">
    <div
      v-if="label !== ''"
      class="esr-input__label"
    >
      {{ label }}
    </div>
    <multiselect
      v-model="model"
      :value="value"
      :options="options"
      :placeholder="placeholder"
      :mode="mode"
      :disabled="disabled"
      :label="labelProp"
      :value-prop="valueProp"
      :object="returnObject"
      :can-deselect="props.canDeselect"
      :open-direction="props.openDirection"
      :track-by="'id'"
      no-options-text="Пусто"
      caret
      @change="$emit('change', $event)"
    >
      <template #caret>
        <esr-icon
          class="multiselect-caret"
          icon="mdi-chevron-down"
        />
      </template>
      <template #tag="{option, handleTagRemove}">
        <esr-tag
          closable
          class="multiselect-tag"
          @close="handleTagRemove(option, $event)"
          @mousedown.stop
        >
          {{ labelProp ? option[labelProp] : option.label }}
        </esr-tag>
      </template>
    </multiselect>
    <div
      v-if="unref(errorMessages)?.length"
      class="esr-textarea__hint"
      :class="{ 'esr-textarea__hint--error': haveErrors }"
    >
      {{ haveErrors ? unref(errorMessages)?.[0] : "" }}
    </div>
  </div>
</template>

<style lang="scss">
.esr-multiselect {
  &--default {
    .multiselect {
      position: relative;
      cursor: pointer;

      @include text-base;

      &-wrapper {
        display: flex;
        padding: 11px 16px;
        border-radius: var(--corner-radius-surface-small, 8px);
        border: 1.5px solid var(--stroke-secondary, #D8DDE5);
        background: var(--surface-light, #FFF);
      }

      &-caret {
        color: var(--icon-secondary);
        flex-grow: 0;
        flex-shrink: 0;
        margin-left: auto;
        pointer-events: none;
        transform: rotate(0deg);
        transition: transform .3s;
        z-index: 10;
      }

      &-dropdown {
        position: absolute;
        width: 100%;
        background-color: var(--surface-light, #FFF);
        border-radius: var(--corner-radius-surface-small, 8px);
        box-shadow: 0 4px 24px 0 rgba(5, 25, 69, 0.08);
        z-index: 100;
        max-height: 400px;
        overflow: scroll;
        scrollbar-width: none;

        &.is-top {
          bottom: 50px;
        }

        &.is-hidden {
          display: none;
        }
      }

      &-tag {
        .esr-icon {
          width: 16px;
          height: 16px
        }
      }

      &-options {
        padding: 8px;
      }

      &-option {
        padding: 8px 16px;
        border-radius: var(--corner-radius-surface-x-small, 4px);
        cursor: pointer;

        &.is-selected {
          color: var(--text-accent-accent, #14509F);
          background: var(--surface-accent-accent-light-s, #F6F8FB);
        }

        &:hover {
          color: var(--text-accent-accent, #14509F);
          background: var(--surface-accent-accent-light-s, #F6F8FB);
        }
      }

      &-placeholder {
        color: var(--text-secondary);
        text-overflow: ellipsis;
        overflow: hidden;
      }

      &.is-open {
        .multiselect-caret {
          pointer-events: auto;
          transform: rotate(180deg)
        }
      }
    }

    &.esr-multiselect--medium {
      .multiselect-wrapper {
        padding: 7px 12px;
      }
    }
  }

  &--filled {
    .multiselect {
      position: relative;
      cursor: pointer;

      &-wrapper {
        padding: 0 16px;
        justify-content: center;
        align-items: center;
        border-radius: var(--corner-radius-surface-small, 8px);
        background: var(--surface-accent-accent-light-m, #ECF1F7);
        display: flex;

        @include screen-mobile{
          padding: 0 12px;
        }
      }

      &-caret {
        flex-grow: 0;
        flex-shrink: 0;
        pointer-events: none;
        transform: rotate(0deg);
        transition: transform .3s;
        z-index: 10;
        width: 42px;
        height: 42px;
        margin-left: 8px;

        svg {
          fill: var(--text-accent-accent, #14509F);
        }

        @include screen-mobile {
          width: 24px;
          height: 24px;
        }
      }

      &-placeholder, &-single-label {
        color: var(--text-accent-accent, #14509F);
        text-align: center;
        font-size: 40px;
        font-style: normal;
        font-weight: 600;
        line-height: 56px;
        text-transform: lowercase;

        @include screen-mobile {
          font-size: 32px;
          font-style: normal;
          font-weight: 600;
          line-height: 40px;
        }
      }

      &-single-label {
        @include screen-tablet {
          text-align: left;
        }
      }

      &-dropdown {
        position: absolute;
        border-radius: var(--corner-radius-surface-small, 8px);
        background: var(--surface-accent-accent-light-m, #ECF1F7);
        z-index: 20;
        left: 0;
        top: calc(100% + 16px);

        @include screen-tablet {
          width: 447px;
        }

        @include screen-mobile {
          left: calc((((100vw - 100%) / 2) - 16px) * -1);
          top: calc(100% + 16px);
          width: calc(100vw - 32px);
        }

        &.is-hidden {
          display: none;
        }
      }

      &-option {
        color: var(--text-accent-accent-light, #B4C7E0);
        font-size: 40px;
        font-style: normal;
        font-weight: 600;
        line-height: 56px; /* 140% */
        padding: 4px 16px 12px;
        white-space: nowrap;
        text-transform: lowercase;
        border-bottom: 1.5px solid var(--stroke-accent-accent-light-s, #D9E3F0);

        &:first-of-type {
          padding-top: 0;
        }

        &:last-of-type {
          border-bottom: none;
        }

        @include screen-tablet {
          white-space: normal;
        }

        @include screen-mobile {
          padding: 4px 12px 12px;
          font-size: 32px;
          font-style: normal;
          font-weight: 600;
          line-height: 40px;
        }

        &:hover {
          background-color: var(--surface-gray-light-m, #D8DDE5);
        }
      }

      &.is-open {
        .multiselect-caret {
          pointer-events: auto;
          transform: rotate(180deg)
        }

      }

    }

  }

  &--minimal {
    .multiselect-single-label {
      width: min-content;
    }

    .multiselect-caret {
      position: absolute;
      right: 10px;
      top: 7px;
    }
  }
}
</style>
