<script setup lang="ts">
import { computed } from "vue";
import { type LinkProps } from "./types";
import { NuxtLink } from "#components";
import { EsrIcon } from "@/components/ui/icon";

const props = defineProps<LinkProps>();

const isExternal = computed<boolean>(() => {
  if (typeof props.to === "string") return /https?:\/\//.test(props.to);

  return false;
});
const isFile = computed<boolean>(() => {
  if (typeof props.to === "string") return /\.pdf$|\.word$|\.xlsx$|\.xls$/.test(props.to);

  return false;
});

const component = computed(() => {
  if (isExternal.value || isFile.value) return "a";

  return NuxtLink;
});

const componentProps = computed(() => {
  if (isExternal.value || isFile.value) {
    return { href: props.to };
  }

  return { to: props.to };
});

</script>

<template>
  <component
    :is="component"
    v-bind="componentProps"
    :target="target"
    class="esr-link"
  >
    <esr-icon
      v-if="prependIcon"
      :icon="prependIcon"
    />
    <span>
      <slot />
    </span>
  </component>
</template>

<style lang="scss">
.esr-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--surface-accent);
  font-weight: 500;
  cursor: pointer;
}
</style>
