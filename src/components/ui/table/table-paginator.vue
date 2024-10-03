<script setup lang="ts">
import { computed } from "vue";

import { type TableMeta } from "@ozzcar11/utilities/types";
import { useBEMNamespace } from "@/composables/useBEMNamespace";
import { EsrButton } from "~/components/ui";
import { useDeviceBySize } from "~/composables/useDevice";

const { isMobile, isTablet } = useDeviceBySize();

const ns = useBEMNamespace("esr-table-paginator");

const props = defineProps<{
  meta?: TableMeta;
}>();

const componentClasses = computed(() => [
  ns.block(),
]);

const model = defineModel<number>();

const l = computed(() => {
  if (isMobile.value) {
    return 2;
  }

  if (isTablet.value) {
    return 2;
  }

  return 4;
});

const pages = computed<number[]>(() => {
  const pages: number[] = [];

  if (!model.value || !props.meta) {
    return pages;
  }

  if (props.meta.last_page < l.value) {
    for (let i = 1; i <= props.meta.last_page; i++) {
      pages.push(i);
    }
  } else if (props.meta.last_page > model.value + l.value) {
    if (model.value - Math.ceil(l.value / 2) < 1) {
      for (let i = 1; i <= l.value; i++) {
        pages.push(i);
      }
    } else {
      for (let i = model.value - Math.ceil(l.value / 2); i < model.value + Math.ceil(l.value / 2) + 1; i++) {
        pages.push(i);
      }

      if (!isMobile.value) {
        if (model.value - l.value === 1 && l.value === 2) {
          pages.unshift(1);
        } else if (model.value - l.value === 0 && l.value === 4) {
          pages.unshift(1);
        } else if (model.value === 2 && l.value === 0) {
          pages.unshift(1);
        } else if (model.value > Math.ceil(l.value / 2) + 2) {
          pages.unshift(-1);
          pages.unshift(1);
        }
      }
    }

    if (!isMobile.value) {
      if (model.value + l.value < props.meta.last_page) {
        pages.push(-1);
      }

      pages.push(props.meta.last_page);
    }

    return pages;
  } else if (props.meta.last_page <= model.value + l.value) {
    if (model.value + l.value > props.meta.last_page) {
      for (let i = props.meta.last_page - l.value; i <= props.meta.last_page; i++) {
        pages.push(i);
      }
    } else {
      for (let i = model.value - Math.ceil(l.value / 2); i < model.value + Math.ceil(l.value / 2) + 1; i++) {
        pages.push(i);
      }

      if (!isMobile.value) {
        if (props.meta.last_page - l.value > model.value) {
          pages.push(-1);
        }
      }

      if (props.meta.last_page !== model.value) {
        pages.push(props.meta.last_page);
      }
    }

    if (!isMobile.value) {
      if (model.value > 1) {
        if (model.value > 2) {
          pages.unshift(-1);
        }
        pages.unshift(1);
      }
    }

    return pages;
  }

  return pages;
});

const setPage = (page: number) => {
  model.value = page;
};

const setPrevPage = () => {
  if (model.value) {
    model.value--;
  }
};

const setNextPage = () => {
  if (model.value) {
    model.value++;
  }
};

</script>

<template>
  <div
    v-if="props.meta"
    :class="componentClasses"
  >
    <esr-button
      color="secondary"
      prefix-icon="mdi-chevron-left"
      :disabled="model === 1"
      size="large"
      @click="setPrevPage()"
    />
    <esr-button
      v-for="page of pages"
      :key="page"
      :color="page === model ? 'primary' : 'secondary'"
      size="large"
      :disabled="page < 1"
      @click="setPage(page)"
    >
      {{ page > 0 ? page : '...' }}
    </esr-button>
    <esr-button
      color="secondary"
      size="large"
      prefix-icon="mdi-chevron-right"
      :disabled="model === props.meta.last_page"
      @click="setNextPage()"
    />
  </div>
</template>

<style scoped lang="scss">
.esr-table-paginator {
  display: flex;
  gap: 12px;
}
</style>
