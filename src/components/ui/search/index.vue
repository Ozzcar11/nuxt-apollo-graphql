<script setup lang="ts">
import { computed, defineModel } from "vue";
import { debounce } from "@ozzcar11/utilities";
import { EsrInput } from "../input";

import { type ModelType, type SearchProps } from "./types";

withDefaults(defineProps<SearchProps>(), {
  placeholder: "Поиск",
  clearable: true,
  label: undefined,
});

const modelValue = defineModel<ModelType>();

const debounced = debounce((value: ModelType) => {
  modelValue.value = value;
}, 500);

const model = computed({
  get() {
    return modelValue.value;
  },
  set(value) {
    debounced(value);
  },
});
</script>

<template>
  <esr-input
    v-model="model"
    prefix-icon="mdi-magnify"
    :label="label"
    :placeholder="placeholder"
  />
</template>
