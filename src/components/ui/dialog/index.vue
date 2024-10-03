<script lang="ts" setup>
import { computed, useSlots, watch } from "vue";

import { EsrButton, EsrCard } from "..";
import { type DialogEmits, type DialogProps } from "./types";

import { useBEMNamespace } from "@/composables/useBEMNamespace";

withDefaults(defineProps<DialogProps>(), {
  maxWidth: "500px",
});

const emit = defineEmits<DialogEmits>();

const model = defineModel<boolean>("modelValue", { default: false });

const slots = useSlots();
const ns = useBEMNamespace("esr-dialog");

const dialogClasses = computed(() => [
  ns.block(),
]);

function submitDialog() {
  emit("submit-dialog");
}

function cancelDialog() {
  emit("cancel-dialog");
}

watch(model, (value) => {
  if (value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
});

</script>

<template>
  <Teleport to="body">
    <div
      v-if="model"
      :class="dialogClasses"
    >
      <div
        class="esr-dialog__overlay"
        @click="cancelDialog"
      >
        <esr-card
          class="esr-dialog__content"
          @click.stop
        >
          <div
            v-if="slots.title"
            class="esr-dialog__title"
          >
            <slot name="title" />
          </div>
          <div
            v-if="slots.title"
            class="esr-dialog__description"
          >
            <slot name="description" />
          </div>
          <div
            v-if="slots.title"
            class="esr-dialog__footer"
          >
            <slot name="footer">
              <div class="esr-dialog__buttons">
                <esr-button
                  color="primary"
                  @click="submitDialog"
                >
                  Подтвердить
                </esr-button>
                <esr-button
                  color="secondary"
                  @click="cancelDialog"
                >
                  Отмена
                </esr-button>
              </div>
            </slot>
          </div>
        </esr-card>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.esr-dialog {
  position: fixed;
  inset: 0;
  z-index: 9999;

  &__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  &__content {
    max-width: v-bind(maxWidth);
    background-color: var(--surface-light);
    padding: 24px;
    margin: 0 12px;
  }

  &__title {
    color: var(--text-primary);

    @include text-h6
  }

  &__description {
    color: var(--text-secondary);
    margin-top: 12px;
  }

  &__footer {
    margin-top: 24px;
  }

  &__buttons {
    display: flex;
    gap: 12px;
  }
}
</style>
