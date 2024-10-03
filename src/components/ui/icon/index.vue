<script lang="ts" setup>
import { computed } from "vue";
import * as mdiIcons from "@mdi/js";
import { camelCase } from "lodash-es";
import { type IconProps } from "./types";

const props = withDefaults(defineProps<IconProps>(), {
  icon: "",
  width: undefined,
  height: undefined,
});

const isMdi = computed(() => props.icon.includes("mdi-"));
const projectIcon = computed(() => {
  if (!isMdi.value) return;

  const iconName = camelCase(props.icon);

  // eslint-disable-next-line import/namespace
  return mdiIcons[iconName as keyof typeof mdiIcons];
});

</script>

<template>
  <div class="esr-icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <g>
        <path :d="projectIcon" />
      </g>
    </svg>
  </div>
</template>

<style lang="scss">
.esr-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
}
</style>
