<script lang="ts" setup>
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { cloneDeep } from "lodash-es";
import { EsrCard, EsrDivider } from "@/components/ui";

import CompanyApplicationExpansion from "~/modules/companies/components/company-application-expansion.vue";

import AppFooter from "~/components/app/footer/app-footer.vue";

import { useCompanyByInn } from "@/modules/companies/composables/useCompanyByInn";
import { useAreaTree } from "@/modules/companies/composables/useAreaTree";
import { formatRevenue } from "@/utils";
import { type Area } from "~/models";

const route = useRoute();

const inn = route.params.inn as string;

const { company, error } = await useCompanyByInn(inn);

const areaTree = ref<Area[]>([]);

const getTotalPoints = computed(() => {
  const { ecology_points: ecologyPoints = 0, government_points: governmentPoints = 0, staff_points: staffPoints = 0 } = company.value || {};

  return ecologyPoints + governmentPoints + staffPoints;
});

function columnHeight(maxValue: number, value?: number) {
  if (!value) return "0%";

  const result = 100 / (maxValue / value);

  return result + "%";
}

const ecologyColumnHeight = computed(() => columnHeight(25, company.value?.ecology_points));
const governmentColumnHeight = computed(() => columnHeight(65, company.value?.government_points));
const staffColumnHeight = computed(() => columnHeight(70, company.value?.staff_points));

const columnsBlocks = computed(() => [{
  title: "Экология",
  value: company.value?.ecology_points,
  maxValue: 25,
  height: ecologyColumnHeight.value,
  color: "#051945",
},
{
  title: "Кадры",
  value: company.value?.staff_points,
  maxValue: 65,
  height: staffColumnHeight.value,
  color: "#14509F",
},
{
  title: "Государство",
  value: company.value?.government_points,
  maxValue: 70,
  height: governmentColumnHeight.value,
  color: "#E3000F",
},
]);

watch(company, async () => {
  if (!company.value) return;

  const { areaTree: areaTreeValue } = await useAreaTree({ company_id: company.value?.id });

  const sections = areaTreeValue.value[1].children[1].children;
  const questions: Partial<Area>[] = [];

  for (const item of sections) {
    item.application_area_questions.forEach((question) => {
      questions.push({
        public_name: question.public_text,
        area_result: {
          max_points: question.user_application_questionnaires[0]?.user_question_scoring?.max_points ?? 0,
          result_points: question.user_application_questionnaires[0]?.user_question_scoring?.points ?? 0,
        },
      });
    });
  }

  const value = cloneDeep(areaTreeValue.value);
  value[1].children[1].children = questions as Area[];

  areaTree.value = cloneDeep(value);
}, { immediate: true });
</script>

<template>
  <div>
    <div class="company container">
      <template v-if="!error">
        <h2 class="company__title">
          {{ company?.name }}
        </h2>
        <p class="company__description">
          Ниже представлена основная информация об участнике рейтинга, его уровень и детализация результатов
        </p>
        <div class="company__content">
          <esr-card class="company-card company-card--first">
            <h6 class="company-card__title">
              Информация об участнике рейтинга
            </h6>
            <div class="company-card__wrapper">
              <div class="company-card__lable">
                ИНН:
              </div>
              <div class="company-card__value">
                {{ company?.inn }}
              </div>
            </div>
            <esr-divider class="company-card__divider" />
            <div class="company-card__wrapper">
              <div class="company-card__lable">
                Вид деятельности:
              </div>
              <div class="company-card__value">
                {{ company?.okved.name }}
              </div>
            </div>
            <esr-divider class="company-card__divider" />
            <div class="company-card__wrapper">
              <div class="company-card__lable">
                Категория:
              </div>
              <div class="company-card__value">
                {{ company?.company_category.name }}
              </div>
            </div>
            <esr-divider class="company-card__divider" />
            <div class="company-card__wrapper">
              <div class="company-card__lable">
                Регион регистрации:
              </div>
              <div class="company-card__value">
                {{ company?.region_registration.name }}
              </div>
            </div>
            <esr-divider class="company-card__divider" />
            <div class="company-card__wrapper">
              <div class="company-card__lable">
                Выручка:
              </div>
              <div class="company-card__value">
                {{ company?.revenue_year ? formatRevenue(company.revenue_year) : '-' }}
              </div>
            </div>
            <esr-divider class="company-card__divider" />
            <div class="company-card__wrapper">
              <div class="company-card__lable">
                Численность:
              </div>
              <div class="company-card__value">
                {{ company?.average_headcount ? new Intl.NumberFormat().format(company.average_headcount) + ' человек' : '-' }}
              </div>
            </div>
          </esr-card>

          <esr-card class="company-card company-card--second">
            <div class="company-card__points">
              <div class="company-card__short">
                {{ company?.level_1 }}
              </div>
              <div class="company-card__full">
                {{ company?.level_2 }}
              </div>
            </div>
            <div class="company-card__all">
              Всего баллов:  {{ getTotalPoints }} из 160
            </div>
            <div class="company-card__columns company-progress">
              <div
                v-for="column of columnsBlocks"
                :key="column.title"
                class="company-progress__column"
              >
                <div
                  class="company-progress__self"
                  :style="{ height: column.height}"
                >
                  <div
                    class="company-progress__color"
                    :style="{ 'background-color': column.color }"
                  />
                  <div
                    class="company-progress__value"
                    :style="{ color: column.color}"
                  >
                    {{ column.value }}
                  </div>
                  <div class="company-progress__description">
                    из {{ column.maxValue }} баллов
                  </div>
                  <esr-divider class="company-progress__divider" />
                  <div class="company-progress__name">
                    {{ column.title }}
                  </div>
                </div>
              </div>
            </div>
          </esr-card>
        </div>
        <esr-card class="company-card company-application">
          <h6 class="company-application__title">
            Детализация результатов
          </h6>
          <p class="company-application__description">
            Ниже приведена подробная информация по каждому показателю
          </p>
          <company-application-expansion :area-tree="areaTree" />
        </esr-card>
      </template>
      <template v-else>
        <h2 class="company__error">
          Компания с таким ИНН не найдена
        </h2>
      </template>
    </div>
    <app-footer v-if="!error" />
  </div>
</template>

<style lang="scss" scoped>
.company {
  padding-top: 113px;
  margin-bottom: 80px;

  &__title {
    color: var(--text-primary);
    line-height: 56px;
    margin: 40px 0 24px;

    @include screen-tablet {
      @include text-h4;

      margin-top: 16px;
      line-height: 32px;
    }

    @include screen-mobile {
      @include text-h5;

      line-height: 32px;
    }
  }

  &__description {
    color: var(--text-secondary);
    line-height: 24px;
    margin-bottom: 54px;

    @include screen-tablet {
      margin-bottom: 32px;
    }

    @include screen-mobile {
      @include text-sm;

      margin-bottom: 16px;
    }
  }

  &-application {
    margin-top: 32px;

    &__title {
      color: var(--text-primary);
      line-height: 32px;
      margin-bottom: 8px;
      font-weight: 500;

      @include text-h6;

    }

    &__description {
      color: var(--text-secondary);
      line-height: 24px;
      margin-bottom: 32px;
    }
  }

  &__content {
    display: flex;
    gap: 16px;

    @include screen-tablet {
      flex-direction: column;
    }
  }

  &-card {
    background: var(--surface-accent-accent-light-s, #F6F8FB);
    padding: 32px;

    @include screen-tablet {
      padding: 24px;
    }

    @include screen-mobile {
      padding: 16px;
    }

    &--first {
      width: 100%;
    }

    &--second {
      min-width: 470px;

      @include screen-tablet {
        min-width: 100%;
      }
    }

    &__columns {
    display: flex;
    gap: 16px;

    @include screen-mobile {
      gap: 8px;
    }
  }

    &__title {
      color: var(--text-primary);
      margin-bottom: 32px;
      line-height: 32px;

      @include text-h6;

      @include screen-tablet {
        margin-bottom: 24px;
      }

      @include screen-mobile {
        @include text-base;

        margin-bottom: 16px;
      }
    }

    &__wrapper {
      display: flex;
      flex-wrap: nowrap;
    }

    &__lable {
      color: var(--text-secondary);
      line-height: 24px;
      width: 170px;
      margin-right: 32px;

      @include screen-mobile {
        width: 128px;
        margin-right: 8px;

        @include text-sm;
      }
    }

    &__divider {
      margin: 24px 0;
    }

    &__value {
      color: var(--text-primary);
      line-height: 24px;
      width: 168px;

      @include screen-mobile {
        @include text-sm;
      }
    }

    &__points {
      display: flex;
      margin-bottom: 24px;
    }

    &__short {
      display: inline-block;
      color: var(--text-primary);
      line-height: 32px;
      padding: 16px 20px;
      box-shadow: 0 4px 16px 0 rgba(5, 25, 69, 0.04);
      border-radius: var(--corner-radius-surface-small, 8px);
      background: var(--surface-light, #FFF);
      width: auto;
      margin-right: 16px;

      @include text-h6;
    }

    &__full {
      display: inline-block;
      width: 100%;
      color: var(--text-primary);
      font-weight: 500;
      line-height: 32px;
      padding: 16px 20px;
      background: var(--surface-light, #FFF);
      box-shadow: 0 4px 16px 0 rgba(5, 25, 69, 0.04);
      border-radius: var(--corner-radius-surface-small, 8px);

      @include text-h6;
    }

    &__all {
      color: var(--text-primary);
      line-height: 24px;
      margin-bottom: 24px;
      font-weight: 500;
    }
  }

  &__error {
    color: var(--text-third);
    text-align: center;
    margin-top: 30px;
    font-weight: 500;

    @include text-h4;

    @include screen-tablet {
      @include text-h5;
    }

    @include screen-mobile {
      @include text-base;
    }
  }

  &-progress {
    &__column {
      display: flex;
      align-items: end;
      width: 124px;
      height: 312px;
      overflow: hidden;
      border-radius: var(--corner-radius-surface-small, 8px);
      background: var(--surface-accent-accent-light-l, #E6ECF5);

      @include screen-tablet {
        width: 197px;
      }

      @include screen-mobile {
        width: 96px;
      }
    }

    &__self {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: end;
      width: 100%;

      // padding: 16px;
      background-color: var(--surface-light);
    }

    &__value {
      @include text-h5;

      margin-bottom: 4px;
      line-height: 32px;

      @include screen-mobile {
        @include text-h6;
      }
    }

    &__description {
      color: var(--text-secondary);
      line-height: 24px;
      white-space: nowrap;

      @include text-sm;

      @include screen-mobile {
        @include text-xs;
      }
    }

    &__name {
      color: var(--text-primary);
      line-height: 24px;
      font-weight: 500;
      margin-bottom: 16px;

      @include text-sm;

      @include screen-mobile {
        @include text-xs;
      }
    }

    &__divider {
      width: 100%;
    }

    &__color {
      position: absolute;
      top: 0;
      width: 100%;
      height: 8px;
      background: var(--surface-dark-dark-accent, #051945);
      border-radius: var(--corner-radius-surface-small, 8px) var(--corner-radius-surface-small, 8px) 0 0 ;
    }
  }
}
</style>
