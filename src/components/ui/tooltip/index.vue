<script setup lang="ts">
import { computed, ref } from "vue";
import { useBEMNamespace } from "@/composables/useBEMNamespace";
import { type TooltipProps } from "~/components/ui/tooltip/types.ts";

const ns = useBEMNamespace("esr-tooltip");

const $el = ref<HTMLElement | null>(null);

const props = withDefaults(defineProps <TooltipProps>(), {
  text: "",
});

const show = ref<boolean>();

const componentClasses = computed(() => [
  ns.block(),
]);

// Teleport в боди что бы ни чем не перекрывало
// Например таблица которая overflow:hidden закрывает тултип
const tooltipPosition = computed(() => {
  if ($el.value) {
    const rect = $el.value.getBoundingClientRect();

    // TODO не - 50 а 50 высоту тултипа
    return {
      top: rect.top + window.scrollY - 50 + "px",
      left: rect.left + window.scrollX - 14 + "px",
    };
  }

  return {
    top: 0,
    left: 0,
  };
});

</script>

<template>
  <div
    ref="$el"
    :class="componentClasses"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <slot />
    <Transition name="esr-tooltip">
      <teleport to="body">
        <div
          v-if="show"
          class="esr-tooltip__text"
          :style="tooltipPosition"
        >
          <p class="esr-tooltip__paragraph">
            {{ props.text }}
          </p>
        </div>
      </teleport>
    </Transition>
  </div>
</template>

<style lang="scss">

.esr-tooltip-enter-active,
.esr-tooltip-leave-active {
  transition: opacity 0.5s ease;
}

.esr-tooltip-enter-from,
.esr-tooltip-leave-to {
  opacity: 0;
}

.esr-tooltip {
  position: relative;
  transition: all 0.3s ease-in-out;

  &:hover {
    .esr-tooltip__text {
      display: block;
    }
  }

  &__text {
    padding: 8px 12px;
    border-radius: var(--corner-radius-surface-small, 8px);
    background: var(--surface-dark-dark-basic, #010712);
    word-wrap: unset;
    position: absolute;
    width: max-content;
    z-index: 1;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      border: 8px solid transparent;
      border-top-color: var(--surface-dark-dark-basic, #010712);
      left: 16px;
    }
  }

  &__paragraph {
      color: var(--text-primary-inverted, #FFF) !important;
      font-size: 14px !important;
      font-style: normal !important;
      font-weight: 500 !important;
      line-height: 24px !important;
  }
}
</style>
