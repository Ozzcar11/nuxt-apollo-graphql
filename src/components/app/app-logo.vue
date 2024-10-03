<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

interface Props {
  variation: "white" | "default";
}

const props = withDefaults(defineProps<Props>(), {
  variation: "default",
});

const logoSrc = computed<string>(() => {
  if (props.variation === "white") {
    return "/images/logo-white.svg";
  }

  return "/images/logo.svg";
},
);

</script>

<template>
  <div class="logo">
    <router-link
      :to="{name: 'main'}"
    >
      <img :src="logoSrc">
    </router-link>
  </div>
</template>
