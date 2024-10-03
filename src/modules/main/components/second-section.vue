<script setup lang="ts">
import { computed, ref } from "vue";
import anime from "animejs/lib/anime.es.js";
import { watchDebounced } from "@vueuse/core";
import { EsrIcon, EsrInput, EsrSelect, EsrTable, EsrTag, EsrTooltip } from "~/components/ui";
import { type TableHeader } from "~/components/ui/table/types.ts";
import { useDeviceBySize } from "~/composables/useDevice";
import {
  type CompanyListParams,
  useCompaniesList,
} from "~/modules/companies/composables/useCompaniesList.ts";
import { useRegionsList } from "~/modules/regions/composables/useRegionsList.ts";
import { useOkvedList } from "~/modules/okved/composables/useOkvedList.ts";
import { type CompanyCategory, type Okved, type Region } from "~/models";

defineExpose({
  intro,
});

const companyListParams = ref<CompanyListParams>({
  limit: 10,
  page: 1,
  filters: {
    search: "",
    company_category: {
      id: 1,
      name: "КРУПНОГО БИЗНЕСА",
    },
    okved: undefined,
    region_registration: undefined,
  },
});

const { list: companies, loading: companiesLoading, refresh, meta: tableMeta } = await useCompaniesList(companyListParams);
const { list: regions } = await useRegionsList();
const { list: okveds } = await useOkvedList();

const okvedItems = computed<Okved[]>(() => {
  if (okveds.value.length) {
    return [
      {
        name: "Все секторы",
        id: 0,
      },
      ...okveds.value,
    ];
  }

  return [
    {
      name: "Все секторы",
      id: 0,
    },
  ];
});
const regionItems = computed<Region[]>(() => {
  if (regions.value.length) {
    return [
      {
        name: "Все регионы",
        id: 0,
      },
      ...regions.value,
    ];
  }

  return [
    {
      name: "Все регионы",
      id: 0,
    },
  ];
});

const { isMobile, isDesktop, isTablet } = useDeviceBySize();

const table = ref(null);

function intro() {
  // Не показываем на мобильных устройствах
  if (!isDesktop.value) {
    return false;
  }

  const targets = document.querySelectorAll(".second-section__wrapper");
  anime({
    targets,
    easing: "linear",
    delay: 600,
    duration: 600,
    keyframes: [
      { opacity: ["0", "1"] },
    ],
  });
}

const headers = ref<TableHeader[]>([
  { value: "application", title: "", combine: true },
  { value: "name", title: "Участник рейтинга", combine: true },
  { value: "level_1", title: "Уровень", combine: false },
  { value: "result", title: "Рейтинг", combine: false },
  { value: "ecology", title: "Экология", combine: false },
  { value: "staff", title: "Кадры", combine: false },
  { value: "government", title: "Государство", combine: false },
]);

const controlLabels = computed(() => {
  if (isMobile.value) {
    return {
      sector: undefined,
      region: undefined,
      search: undefined,
    };
  }

  return {
    sector: "Сектор",
    region: "Регион",
    search: "Поиск",
  };
});

watchDebounced(companyListParams.value.filters, async () => {
  companyListParams.value.page = 1;

  if (table.value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    table.value.resetPage();
  }

  await refresh();
}, { debounce: 300, maxWait: 1000 });

const categoryItems = ref<CompanyCategory[]>([
  {
    id: 1,
    name: "крупного бизнеса",
  },
  {
    id: 5,
    name: "среднего бизнеса",
  },
  {
    id: 4,
    name: "малого бизнеса",
  },
  {
    id: 3,
    name: "микробизнеса",
  },
  {
    id: 2,
    name: "индивидуальных предпринимателей",
  },
]);

const changeLimit = async (limit: number) => {
  companyListParams.value.limit = limit;
  companyListParams.value.page = 1;
  await refresh();
};

const changePage = async (page: number) => {
  companyListParams.value.page = page;
  await refresh();
};

const okvedModel = ref<Okved>({
  name: "Все секторы",
  id: 0,
});
const regionModel = ref<Region>({
  name: "Все регионы",
  id: 0,
});
const searchModel = ref<string>("");
const categoryModel = ref<Region>({
  id: 1,
  name: "КРУПНОГО БИЗНЕСА",
});

const setRegion = () => {
  if (companyListParams.value && regionModel.value && regionModel.value.id !== 0) {
    companyListParams.value.filters.region_registration = { id: regionModel.value.id };
  } else {
    companyListParams.value.filters.region_registration = undefined;
  }
};

const setOkved = () => {
  if (companyListParams.value && okvedModel.value && okvedModel.value.id !== 0) {
    companyListParams.value.filters.okved = { id: okvedModel.value.id };
  } else {
    companyListParams.value.filters.okved = undefined;
  }
};

const setCategory = () => {
  if (searchModel.value.length > 0) {
    companyListParams.value.filters.company_category = undefined;
  } else {
    companyListParams.value.filters.company_category = {
      id: categoryModel.value.id,
      name: categoryModel.value.name,
    };
  }
};

const setSearch = () => {
  companyListParams.value.filters.search = searchModel.value;

  if (searchModel.value.length > 0) {
    companyListParams.value.filters.company_category = undefined;
  } else {
    companyListParams.value.filters.company_category = {
      id: categoryModel.value.id,
      name: categoryModel.value.name,
    };
  }
};

// Нужно что бы надпись ип складывался валидно
const containedCategory = computed(() => {
  if (isTablet.value) {
    if (companyListParams.value.filters.company_category && companyListParams.value.filters.company_category.id === 2) {
      return true;
    }
  } else if (isMobile.value) {
    if (companyListParams.value.filters.company_category && [5, 4, 2].includes(companyListParams.value.filters.company_category.id)) {
      return true;
    }
  }

  return false;
});

</script>

<template>
  <section class="second-section">
    <div class="second-section__wrapper">
      <div class="second-section__title">
        <div class="second-section__select">
          <h2>Рейтинг</h2>
          <div class="second-section__category-select">
            <esr-select
              v-model="categoryModel"
              return-object
              variation="filled"
              label-prop="name"
              value-prop="id"
              :options="categoryItems"
              :class="{ 'esr-multiselect--minimal': containedCategory }"
              @update:model-value="setCategory"
            />
          </div>
        </div>

        <p class="p1-regular">
          Национальный стандарт «Индекс деловой репутации субъектов предпринимательской деятельности (ЭКГ-рейтинг). ГОСТ Р 71198-2023
        </p>
      </div>

      <div class="second-section__controls">
        <div>
          <esr-input
            v-model="searchModel"
            prefix-icon="mdi-magnify"
            :label="controlLabels.search"
            placeholder="Наименование или ИНН"
            :clearable="true"
            @update:model-value="setSearch"
          />
        </div>
        <div>
          <esr-select
            v-model="okvedModel"
            :label="controlLabels.sector"
            return-object
            label-prop="name"
            value-prop="id"
            :can-deselect="true"
            :options="okvedItems"
            placeholder="Все секторы"
            @update:model-value="setOkved"
          />
        </div>
        <div>
          <esr-select
            v-model="regionModel"
            :label="controlLabels.region"
            return-object
            label-prop="name"
            value-prop="id"
            :can-deselect="true"
            :options="regionItems"
            placeholder="Все регионы"
            @update:model-value="setRegion"
          />
        </div>
      </div>
      <div class="second-section__table">
        <esr-table
          ref="table"
          :headers="headers"
          :loading="companiesLoading"
          :list="companies"
          :meta="tableMeta"
          grid-template-columns="minmax(43px, 43px) minmax(350px, 550px)  repeat(auto-fit, minmax(100px, 1fr))"
          @change-limit="changeLimit"
          @change-page="changePage"
        >
          <template #not-found>
            <img src="/images/pages/main/no-found.svg">
            <p class="p1-regular">
              К сожалению, здесь ничего нет: некорректный запрос или нет данных
            </p>
          </template>
          <template #item_application="{ item }">
            <div
              v-if="item.status === 'processed'"
              class="table-icon"
            >
              <esr-tooltip text="Анкетирование пройдено">
                <esr-icon
                  class="icon-marked-circle"
                  icon="mdi-checkbox-marked-circle"
                />
              </esr-tooltip>
            </div>
            <div
              v-else
              class="table-icon"
            >
              <esr-tooltip text="Анкетирование не пройдено">
                <esr-icon
                  class="icon-close-circle"
                  icon="mdi-close-circle"
                />
              </esr-tooltip>
            </div>
          </template>
          <template
            #item_name="{ item }"
          >
            <p class="p2-regular">
              <router-link :to="{ name: 'companies.show', params: { inn: item.inn } }">
                {{ item.name }}
              </router-link>
            </p>
          </template>
          <template #item_level_1="{ item }">
            <esr-tag color="blue-light">
              {{ item.level_1 }}
            </esr-tag>
          </template>
          <template #item_result="{ item }">
            <esr-tag color="blue-light">
              {{ item.result_points || 0 }}
            </esr-tag>
          </template>
          <template #item_ecology="{ item }">
            {{ item.ecology_points || 0 }}
          </template>
          <template #item_staff="{ item }">
            {{ item.staff_points || 0 }}
          </template>
          <template #item_government="{ item }">
            {{ item.government_points || 0 }}
          </template>
        </esr-table>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.second-section {
  padding: 120px 56px 20px;
  background: #fff;
  display: flex;
  align-items: center;

  @include screen-tablet {
    padding: 80px 40px 40px;
  }

  @include screen-mobile {
    padding: 40px 16px 20px;
  }

  &__select {
    display: flex;
    justify-content: center;
    gap: 16px;

    @include screen-mobile {
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
  }

  &__wrapper {
    width: 100%;
    height: 100%;
  }

  &__title {
    width: 100%;

    h2 {
      color: var(--text-primary, #051342);
    }

    p {
      text-align: center;
      padding-top: 24px;

      @include screen-tablet {
        padding-top: 16px;
        max-width: 640px;
        margin: 0 auto;
      }

      @include screen-mobile {
        padding-top: 16px;
        font-size: 14px;
      }
    }
  }

  &__controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    padding-top: 40px;

    @include screen-tablet {
      grid-template-columns: 1fr 1fr;
      padding-top: 32px;
    }

    @include screen-mobile {
      grid-template-columns: 1fr;
      padding-top: 24px;
    }

    div:first-child {
      @include screen-tablet {
        grid-column: 1 / -1;
      }
    }

  }

  &__table {
    padding-top: 40px;

    @include screen-tablet {
      padding-top: 8px;
    }

    @include screen-mobile {
      padding-top: 8px;
    }

    .table-icon {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .icon-marked-circle {
      width: 20px;
      height: 20px;

      svg {
        fill: var(--icon-accent-accent, #14509F);
      }
    }

    .icon-close-circle {
      width: 20px;
      height: 20px;

      svg {
        fill: var(--icon-accent-accent-light, #B4C7E0);
      }
    }

    .esr-table__body {
      height: calc(100vh - 600px);
      overflow-y: scroll;

      &::-webkit-scrollbar {
        width: 2px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
      }

      @include screen-small-height {
        height: auto;
      }

      @include screen-tablet {
        height: auto;
        overflow: hidden;
      }

    }
  }
}
</style>
