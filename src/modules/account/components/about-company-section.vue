<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { url } from "@ozzcar11/utilities/validators";
import { useVuelidate } from "@vuelidate/core";
import { cloneDeep, omit } from "lodash-es";
import { useRegionsList } from "@/modules/regions/composables/useRegionsList";
import { type CompanyProps } from "@/modules/auth/composables/useMeUpdate";
import { formatRevenue, objectIsFull, refWithDefault } from "@/utils";

import { EsrButton, EsrCard, EsrInput, EsrSelect, EsrText, EsrTextarea } from "@/components/ui";

type AboutCompanySectionType = Pick<CompanyProps, "region_presences" | "link" | "trademarks" | "product_information">;

const props = defineProps<{
  company: CompanyProps;
  inputsSize: "medium" | "large";
}>();

const emit = defineEmits<{
  (e: "save-section", value: AboutCompanySectionType): void;
}>();

const { list: regions } = await useRegionsList();

const companyValue = cloneDeep(props.company);

const model = refWithDefault({
  region_presences: companyValue.region_presences,
  link: companyValue.link,
  trademarks: companyValue.trademarks,
  product_information: companyValue.product_information,
});

const rules = computed(() => ({
  link: { url },
}));

const v = useVuelidate(rules, model.ref.value);

const editable = ref<boolean>(true);

const yearRevenue = computed({
  get() {
    return formatRevenue(companyValue.revenue_year ?? 0);
  },
  set(value) {
    companyValue.revenue_year = +value;
  },
});

const companyPresences = computed(() => regions.value.filter(item => model.ref.value.region_presences.some(region => region.id === item.id)).map(item => item.name).join(", "));

async function saveAboutCompany() {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  emit("save-section", model.ref.value);
  editable.value = false;
}

function cancelAboutCompany() {
  editable.value = false;
  model.reset();
}

onMounted(() => {
  editable.value = model.isEmpty();
});
</script>

<template>
  <esr-card class="account__card account-card">
    <h3 class="account-card__title">
      Информация о компании
    </h3>
    <esr-card
      class="account-card__inner"
      background-color="--surface-accent-light-s"
    >
      <template v-if="editable">
        <div class="account-card__content">
          <esr-input
            v-model="companyValue.inn"
            label="ИНН"
            disabled
            :size="inputsSize"
          />
          <esr-input
            v-model="companyValue.company_category.name"
            label="Категория"
            disabled
            :size="inputsSize"
          />
          <esr-input
            v-model="companyValue.region_registration.name"
            label="Регион регистрации"
            disabled
            :size="inputsSize"
          />
          <esr-input
            v-model="companyValue.okved.name"
            label="Вид деятельности"
            disabled
            :size="inputsSize"
          />
          <esr-input
            v-model="companyValue.average_headcount"
            label="Среднесписочная численность сотрудников"
            disabled
            :size="inputsSize"
          />
          <esr-input
            v-model="yearRevenue"
            label="Выручка за последний год"
            disabled
            :size="inputsSize"
          />
          <esr-select
            v-model="model.ref.value.region_presences"
            label="Регионы присутствия"
            :options="regions"
            label-prop="name"
            value-prop="name"
            class="region-select"
            placeholder="Выберите регион присутствия"
            mode="tags"
            :size="inputsSize"
            return-object
          />
          <esr-input
            v-model="model.ref.value.link"
            label="Адрес интернет-сайта"
            placeholder="Введите адрес интернет-сайта"
            :size="inputsSize"
            :error-messages="v.link.$errors.map((e) => e.$message)"
          />
          <esr-input
            v-model="model.ref.value.trademarks"
            label="Товарные знаки компании"
            placeholder="Введите товарные знаки компании"
            :size="inputsSize"
          />
        </div>
        <esr-textarea
          v-model="model.ref.value.product_information"
          label="Краткие сведения о товарах (работах, услугах)"
          placeholder="Введите краткие сведения о товарах"
          :size="inputsSize"
        />
      </template>
      <template v-else>
        <div class="account-card__content">
          <esr-text label="ИНН">
            {{ company.inn ?? '-' }}
          </esr-text>
          <esr-text label="Категория">
            {{ company.company_category.name ?? '-' }}
          </esr-text>
          <esr-text label="Регион регистрации">
            {{ company.region_registration.name ?? '-' }}
          </esr-text>
          <esr-text label="Вид деятельности">
            {{ company.okved.name ?? '-' }}
          </esr-text>
          <esr-text label="Среднесписочная численность сотрудников">
            {{ company.average_headcount ? company.average_headcount + " чел." : '-' }}
          </esr-text>
          <esr-text label="Выручка за последний год">
            {{ formatRevenue(company.revenue_year ?? 0) ?? '-' }}
          </esr-text>
          <esr-text label="Регионы присутствия">
            {{ companyPresences ?? '-' }}
          </esr-text>
          <esr-text label="Адрес интернет-сайта">
            {{ company.link ?? '-' }}
          </esr-text>
          <esr-text label="Товарные знаки компании">
            {{ company.trademarks ?? '-' }}
          </esr-text>
        </div>
        <esr-text label="Краткие сведения о товарах (работах, услугах)">
          {{ company.product_information ?? '-' }}
        </esr-text>
      </template>
    </esr-card>
    <div
      v-if="editable"
      class="account-card__buttons"
    >
      <esr-button
        class="account-card__button"
        :disabled="objectIsFull(omit(model.ref.value, 'link'))"
        @click="saveAboutCompany"
      >
        Сохранить
      </esr-button>
      <esr-button
        color="secondary"
        @click="cancelAboutCompany"
      >
        Отмена
      </esr-button>
    </div>
    <template v-else>
      <esr-button
        class="account-card__edit"
        color="secondary"
        @click="editable = true"
      >
        Редактировать
      </esr-button>
    </template>
  </esr-card>
</template>

<style lang="scss">
.account-card {
  &__buttons {
    display: flex;
    gap: 12px;
  }

  &__title {
    @include screen-tablet {
      @include text-h5;
    }

    @include screen-mobile {
      @include text-base;
    }
  }

  &__content {
    .esr-text__label {
      @include screen-tablet {
        max-width: 288px;
      }

      @include screen-mobile {
        max-width: 272px;
      }
    }
  }

  &__edit {
    margin-top: 24px;
  }

  &__empty {
    color: var(--text-secondary);
  }
}

.region-select {
  max-width: 400px;
}
</style>
