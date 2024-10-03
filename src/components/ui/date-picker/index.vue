<script lang="ts" setup>
import { type MaybeRef, computed, defineModel, unref } from "vue";
import { dayjs } from "@ozzcar11/utilities/plugins";
import VueDatePicker from "@vuepic/vue-datepicker";
import { EsrButton, EsrIcon, EsrSelect } from "..";

const props = defineProps<{
  placeholder?: string;
  label?: string;
  disabled?: string;
  errorMessages: MaybeRef<string>[];
  format?: string;
  modelType?: string;
}>();

const modelValue = defineModel<string>();

const haveErrors = computed(() => {
  if (!props.errorMessages || props.disabled) return;

  return props.errorMessages.length > 0 ? "error" : undefined;
});

type UpdateMonthYear = (month: number, year: number, fromNav: boolean) => void;

const updateMonth = (event: number, updateMonthYear: UpdateMonthYear | undefined, year: number) => {
  if (!updateMonthYear) return;
  updateMonthYear(event, year, false);
};

const updateYear = (event: number, updateMonthYear: UpdateMonthYear | undefined, month: number | undefined) => {
  if (!updateMonthYear || !month) return;
  updateMonthYear(month, event, false);
};
</script>

<template>
  <div class="esr-date-picker">
    <div
      v-if="label !== ''"
      class="esr-date-picker__label"
    >
      {{ label }}
    </div>
    <vue-date-picker
      v-model="modelValue"
      locale="ru"
      select-text="Выбрать"
      cancel-text="Отмена"
      :model-type="modelType"
      :placeholder="placeholder"
      :enable-time-picker="false"
      :format="format"
      :required="!!errorMessages.length"
      auto-apply
    >
      <template #month-year="{ month, year , months, years, updateMonthYear, handleMonthYearChange}">
        <div class="esr-date-header">
          <div class="esr-date-title">
            {{ modelValue ? dayjs(modelValue).format('D MMMM, dddd') : 'Выберите дату' }}
          </div>
          <div
            v-if="handleMonthYearChange"
            class="esr-date-mouth-container"
          >
            <esr-button
              prefix-icon="mdi-chevron-left"
              class="esr-date-mouth-btn"
              color="secondary"
              @click="handleMonthYearChange(false)"
            />
            <esr-button
              prefix-icon="mdi-chevron-right"
              class="esr-date-mouth-btn"
              color="secondary"
              @click="handleMonthYearChange(true)"
            />
          </div>
        </div>
        <div class="esr-date-select">
          <esr-select
            :value="month"
            :options="months"
            label="Месяц"
            label-prop="text"
            value-prop="value"
            @change="updateMonth($event, updateMonthYear, year)"
          />
          <esr-select
            :value="year"
            :options="years"
            label="Год"
            label-prop="text"
            value-prop="value"
            @change="updateYear($event, updateMonthYear, month)"
          />
        </div>
      </template>
      <template #input-icon>
        <esr-icon icon="mdi-calendar" />
      </template>
    </vue-date-picker>
    <div
      v-if="haveErrors"
      class="esr-date-picker__error"
    >
      {{ unref(errorMessages)?.[0] }}
    </div>
  </div>
</template>

<style lang="scss">
 .esr-date-picker {
  /* stylelint-disable */
  .dp__theme_light {
    --dp-input-padding: 7px 12px;
    --dp-primary-color: var(--surface-accent, #14509F);
    --dp-border-radius: var(--corner-radius-surface-small);
    --dp-border-color-hover: var(--stroke-primary);

    .dp__calendar_header_item {
      color: var(--text-secondary);
      text-transform: uppercase;

      @include text-sm;
      font-weight: 400;
    }

    .dp__calendar_header_separator {
      display: none;
    }

    .dp__menu_inner {
      padding: 16px;
      width: 368px;
    }

    .dp__month_year_wrap {
      display: block;
    }

    .dp__input_icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;

      .esr-icon {
        width: 20px;
        height: 20px;
      }
    }

    .esr-date {
      &-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 48px;
      }

      &-title {
        color: var(--text-primary);
        font-weight: 500;

        @include text-h6
      }

      &-select {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        .esr-multiselect--default {
          width: 100%;
        }
      }
    }

    .esr-date-mouth {
      &-container {
        display: flex;
        gap: 12px;

        .esr-button {
          padding: 12px;
          height: 48px;
        }
      }

      &-btn {
        padding: 8px;
      }
    }
  }
  /* stylelint-enable */

   width: 100%;

   &__label {
     margin-bottom: 8px;
     color: var(--text-secondary);

     @include text-sm;
   }

   &__error {
    color: var(--service-error);
    font-size: 0.875rem;
    margin-top: 8px;

    @include text-sm;
   }
}
</style>
