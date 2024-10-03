<script setup lang="ts" generic="T extends TableItem">
import { computed, ref } from "vue";
import { type TableItem, type TableProps } from "./types.ts";
import { useBEMNamespace } from "@/composables/useBEMNamespace";
import { EsrSelect, EsrSkeleton, EsrTablePaginator } from "~/components/ui";
import { useDeviceBySize } from "~/composables/useDevice";

const { isDesktop } = useDeviceBySize();

const emit = defineEmits<{
  changeLimit: [limit: number];
  changePage: [limit: number];
}>();

const ns = useBEMNamespace("esr-table");

const props = withDefaults(defineProps<TableProps<T>>(), {
  headers: () => [],
  loading: true,
});

const componentClasses = computed(() => [
  ns.block(),
]);

const gridTemplateColumns = computed(() => {
  const defaultValue = "grid-template-columns: repeat(auto-fit, minmax(100px, 1fr))";

  if (isDesktop.value) {
    return props.gridTemplateColumns ? `grid-template-columns: ${props.gridTemplateColumns}` : defaultValue;
  }

  return "auto";
});

const currentPage = ref<number>(1);
const currentLimit = ref<number>(10);

const changeLimit = () => {
  emit("changeLimit", currentLimit.value);
};

const changePage = () => {
  emit("changePage", currentPage.value);
};

const resetPage = () => {
  currentPage.value = 1;
};

defineExpose({
  resetPage,
});
</script>

<template>
  <div :class="componentClasses">
    <div
      v-if="isDesktop"
      class="esr-table__headers"
    >
      <div
        class="esr-table__row"
        :style="gridTemplateColumns"
      >
        <div
          v-for="header of props.headers"
          :key="header.value"
          class="esr-table__column"
        >
          <p class="p2-medium">
            {{ header.title }}
          </p>
        </div>
      </div>
    </div>

    <div class="esr-table__body">
      <div
        v-if="list && list.length === 0"
        class="esr-table__empty"
      >
        <slot name="not-found" />
      </div>

      <div
        v-for="item of list"
        v-else
        :key="item.id"
        class="esr-table__row"
        :style="gridTemplateColumns"
      >
        <template v-if="!isDesktop">
          <div
            class="esr-table__column esr-table__column--combine"
          >
            <template
              v-for="header of props.headers"
              :key="header.value"
            >
              <template v-if="loading">
                <esr-skeleton />
              </template>
              <template v-else>
                <slot
                  v-if="header.combine"
                  :name="`item_${header.value}`"
                  :item="item"
                />
              </template>
            </template>
          </div>
        </template>

        <template v-if="isDesktop">
          <template
            v-for="header of props.headers"
            :key="header.value"
          >
            <div
              class="esr-table__column"
            >
              <template v-if="loading">
                <esr-skeleton />
              </template>
              <template v-else>
                <slot
                  :name="`item_${header.value}`"
                  :item="item"
                />
              </template>
            </div>
          </template>
        </template>

        <template v-else>
          <div class="column-wrapper">
            <div class="esr-table__column esr-table__column--scrolled">
              <template
                v-for="header of props.headers"
                :key="header.value"
              >
                <div
                  v-if="!header.combine"
                  class="esr-table__column"
                >
                  <p
                    class="p2-regular mob-header"
                  >
                    {{ header.title }}
                  </p>
                  <template v-if="loading">
                    <esr-skeleton />
                  </template>
                  <template v-else>
                    <slot
                      :name="`item_${header.value}`"
                      :item="item"
                    />
                  </template>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="esr-table__support">
      <div class="esr-table__pagination">
        <esr-table-paginator
          v-model="currentPage"
          :meta="props.meta"
          @update:model-value="changePage"
        />
      </div>
      <div class="esr-table__limit">
        <esr-select
          v-model="currentLimit"
          size="large"
          label="Строк на странице"
          open-direction="top"
          :options="[
            { value: 10, label: 10},
            { value: 50, label: 50},
            { value: 100, label: 100},
          ]"
          @update:model-value="changeLimit"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.esr-table {
  &__row {
    border-bottom: 1px solid var(--stroke-secondary, #D8DDE5);
    display: grid;

    @include screen-tablet {
      padding: 24px 0 16px;
    }

    @include screen-tablet {
      padding: 16px 0 8px;
    }

    .column-wrapper {
      overflow: scroll;
    }
  }

  &__column {
    padding: 16px;

    &--combine {
      grid-column: 1 / -1;

      @include screen-tablet {
        display: flex;
        gap: 8px;
        font-weight: 500;
      }
    }

    &--scrolled {
      display: flex;
      gap: 24px;

      @include screen-mobile {
        gap: 20px;
      }

    }

    @include screen-tablet {
      padding: 0 0 8px;
    }

  }

  &__body {
    .esr-table__column {
      p {
        color: var(--text-primary, #051945);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .mob-header {
        color: var(--text-secondary, #7C879F);

        @include screen-tablet {
          padding: 0 0 8px;
        }
      }
    }
  }

  &__support {
    display: grid;
    grid-template-columns: 1fr 200px;
    padding-top: 32px;

    @include screen-tablet {
      padding-top: 16px;
      grid-template-columns: 1fr 200px;
    }

    @include screen-mobile {
      padding-top: 40px;
      grid-template-columns: 1fr;
      gap: 24px;
    }

  }

  &__pagination {
    display: flex;
    align-items: end;
  }

  &__empty {
    display: flex;
    height: 100%;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    gap: 24px;

    @include screen-small-height {
      padding: 40px 0;
    }

    @include screen-mobile {
      gap: 16px

    }

    img {
      @include screen-mobile {
        width: 67px;
        height: 67px;
      }
    }

    p {
      text-align: center;

      @include screen-mobile {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px
      }
    }
  }

}
</style>
