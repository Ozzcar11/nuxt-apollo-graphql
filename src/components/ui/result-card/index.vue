<script lang="ts" setup>
import { computed, ref } from "vue";
import { type ResultCardProps } from "./types";
import { EsrCard } from "@/components/ui";

const circlMaxValue = ref(580);
const props = defineProps<ResultCardProps>();

const progress = computed(() => {
  const percent = props.points * 100 / props.maxPoints;

  return circlMaxValue.value - circlMaxValue.value / 100 * percent;
});
</script>

<template>
  <esr-card class="result">
    <div class="result__container">
      <div class="result__inner">
        <div class="result__points">
          <div class="result__points-title">
            {{ points }}
          </div>
          <div class="result__points-description">
            из {{ maxPoints }} баллов
          </div>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="200px"
        height="200px"
      >
        <circle
          class="result-self result-self-bg"
          cx="-100"
          cy="100"
          r="92"
          stroke-linecap="round"
        />
        <circle
          class="result-self result-self-progress"
          cx="-100"
          cy="100"
          r="92"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <div
      v-if="title"
      class="result-title"
    >
      {{ title }}
    </div>
    <div
      v-if="lable"
      class="result-description"
    >
      <span class="result-description__label">{{ lable }}:</span>
      <span class="result-description__value">{{ description }}</span>
    </div>
  </esr-card>
</template>

<style lang="scss" scoped>
.result {
  position: relative;
  padding: 48px 24px 24px;
  background-color: var(--surface-light);

  &-title {
    color: var(--text-primary);
    margin-bottom: 8px;
    line-height: 32px;

    @include text-h6;
  }

  &-description {
    display: flex;
    gap: 8px;

    &__label {
      color: var(--text-secondary);
    }

    &__value {
      color: var(--text-primary);
    }
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &__container {
    position: relative;
    width: 232px;
    height: 232px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 40px;
    border-radius: 50%;
    background-color: var(--surface-accent-light-s);

  }

  &__points {
    &-title {
      color: (--text-primary);

      @include text-h4;
    }

    &-description {
      color: var(--text-secondary);

      @include text-sm;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 168px;
    width: 168px;
    border-radius: 50%;
    background-color: var(--surface-light);
  }

  &-self {
    fill: none;
    stroke-width: 16px;
    transform: rotate(-90deg);
    background-color: transparent;

    &-progress {
      stroke-dasharray: 580;
      stroke-dashoffset: v-bind(progress);
      stroke: v-bind(color);
    }

    &-bg {
      stroke: var(--surface-accent-light-xl);
    }
  }
}
</style>
