<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(defineProps<{
  maxValue?: number | null;
  value?: number | null;
}>(), {
  maxValue: 100,
  value: 0.00001,
});

const progress = computed(() => {
  let maxValue = props.maxValue;
  if (!maxValue) maxValue = 100;

  const percent = props.value * 100 / maxValue;

  return 200 - 50 / 100 * percent;
});
</script>

<template>
  <svg
    class="circle"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    width="24px"
    height="24px"
  >
    <circle
      class="circle__self circle__bg"
      cx="-12"
      cy="12"
      r="8"
    />
    <circle
      class="circle__self circle__progress"
      cx="-12"
      cy="12"
      r="8"
    />
  </svg>
</template>

<style lang="scss" scoped>
.circle {
  transform: scale(-1, 1);

  &__progress {
    stroke-dasharray: 200;
    stroke-dashoffset: v-bind(progress);
    stroke: var(--stroke-accent);
  }

  &__bg {
    stroke: var(--stroke-accent-light-s);
  }

  &__self {
    fill: none;
    stroke-width: 4px;
    transform: rotate(-90deg);
    background-color: transparent;
  }
}
</style>
