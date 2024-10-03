<script lang="ts" setup>
import { ref } from "vue";
import { EsrButton, EsrResultCard } from "~/components/ui";

import { useApplicationResultGet } from "@/modules/results/composables/useResultsGet";
import { useResultLinkGet } from "@/modules/results/composables/useResultLinkGet";
import { useMe } from "@/modules/auth/composables/useMe";

const { user } = await useMe();
const { getLink, loading } = useResultLinkGet();
const { applicationResult, onResult } = useApplicationResultGet();

type ResultType = {
  title: string;
  lable: string;
  description: string;
  color: string;
  points: number;
  maxPoints: number;
};

const data = ref<ResultType[]>([]);

onResult(() => {
  if (!applicationResult.value) return;

  data.value = [
    {
      title: "Скоринг",
      lable: "Дата оценки",
      description: applicationResult.value.scoring_date,
      color: "#14509F",
      points: applicationResult.value.scoring_result,
      maxPoints: applicationResult.value.scoring_result_max,
    },
    {
      title: "Анкетирование",
      lable: "Дата оценки",
      description: applicationResult.value.application_date ?? "—",
      color: "#E3000F",
      points: applicationResult.value.application_result,
      maxPoints: applicationResult.value.application_result_max,
    },
    {
      title: "Итоговый результат",
      lable: "Уровень",
      description: `${applicationResult.value.level_1}, ${applicationResult.value.level_2}`,
      color: "#051945",
      points: applicationResult.value.total,
      maxPoints: applicationResult.value.total_max,
    },
  ];
});

async function downloadResults() {
  if (!user.value?.id) return;

  const res = await getLink({
    company: {
      id: +user.value?.id,
    },
  });

  const link = document.createElement("a");

  link.href = res?.data?.makeCertificate ?? "/";
  link.target = "_blank";
  link.click();

  link.remove();
}

</script>

<template>
  <div class="results">
    <div class="container">
      <div class="results__title">
        <span>Результаты проверки</span>
      </div>
      <div class="results__description">
        Здесь вы можете посмотреть выставленные баллы за каждый этап участия
      </div>
      <div
        v-if="data.length"
        class="results__content"
      >
        <esr-result-card
          v-for="(item, idx) in data"
          :key="idx"
          v-bind="item"
        />
      </div>
      <esr-button
        class="results__download"
        prefix-icon="mdi-download-outline"
        :disabled="loading"
        color="light"
        @click="downloadResults"
      >
        Cертификат участника рейтинга
      </esr-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.results {
  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    line-height: 32px;

    @include text-h1;

    span {
      margin-right: 24px;
    }
  }

  &__description {
    color: var(--text-secondary);
    margin-bottom: 40px;
    font-weight: 400;

    @include screen-tablet {
      margin-bottom: 24px;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 24px;

    @include screen-tablet {
      grid-template-columns: 1fr;
    }
  }

  &__download {
    margin: 56px auto 0;
  }
}
</style>
