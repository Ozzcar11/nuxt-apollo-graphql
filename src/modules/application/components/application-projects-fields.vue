<script lang="ts" setup>
import { computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf } from "@ozzcar11/utilities/validators";
import { dayjs } from "@ozzcar11/utilities/plugins";
import { type ApplicationProject } from "@/models/application";
import { moneyMask } from "@/utils/maska";

import { useProjectDirectionsList } from "@/modules/project/composables/useProjectDirections";

import { EsrDatePicker, EsrFileInput, EsrInput, EsrLink, EsrSelect, EsrText, EsrTextarea } from "@/components/ui";
import { READABLE_DATE, READBLE_DAYJS_DATE, RETURN_DATE } from "@/constants/dates";
import { dateLessThen } from "@/utils/validators";

const props = defineProps<{
  project: ApplicationProject;
  editable?: boolean;
  isGoverment?: boolean;
}>();

const projectValue = computed(() => props.project);

const rules = computed(() => ({
  name: { required },
  date_start: { required, dateLessThen: dateLessThen(projectValue) },
  date_end: { required },
  description: { required },
  place: { required },
  investment_volume: { required },
  materials: { required },
  project_direction: { required: requiredIf(() => props.isGoverment) },
}));

const v = useVuelidate(rules, projectValue.value);

const { projectDirections } = useProjectDirectionsList();

const documentsModel = computed({
  get() {
    return projectValue.value?.documents?.map(item => ({
      ...item.file,
    }));
  },
  set(value) {
    projectValue.value.documents = value.map(item => ({
      title: item.name,
      file: item,
    }));
  },
});

</script>

<template>
  <div class="project-fields">
    <template v-if="editable">
      <esr-input
        v-model="projectValue.name"
        label="Название проекта"
        placeholder="Введите название проекта"
        :error-messages="v.name.$errors.map((e) => e.$message)"
      />
      <esr-select
        v-if="isGoverment"
        v-model="projectValue.project_direction"
        :options="projectDirections"
        label="Направление"
        placeholder="Выберите направление"
        label-prop="name"
        class="project-fields__select"
        :error-messages="v.project_direction.$errors.map((e) => e.$message)"
        value-prop="id"
        return-object
      />
      <div class="project-fields__dates">
        <esr-date-picker
          v-model="projectValue.date_start"
          label="Начало проекта"
          placeholder="Выберите начало"
          :format="READABLE_DATE"
          :model-type="RETURN_DATE"
          :error-messages="v.date_start.$errors.map((e) => e.$message)"
        />
        <esr-date-picker
          v-model="projectValue.date_end"
          label="Конец проекта"
          placeholder="Выберите конец"
          :format="READABLE_DATE"
          :model-type="RETURN_DATE"
          :error-messages="v.date_end.$errors.map((e) => e.$message)"
        />
      </div>
      <esr-textarea
        v-model="projectValue.description"
        placeholder="Введите описание проекта"
        label="Описание проекта"
        :error-messages="v.description.$errors.map((e) => e.$message)"
      />
      <esr-textarea
        v-model="projectValue.place"
        label="Место реализации проекта"
        placeholder="Введите место реализации проекта"
        class="m-6"
        :error-messages="v.place.$errors.map((e) => e.$message)"
      />
      <esr-input
        v-model="projectValue.investment_volume"
        placeholder="Введите объем инвестиций"
        label="Объем инвестиций, ₽"
        :mask-options="moneyMask"
        :error-messages="v.investment_volume.$errors.map((e) => e.$message)"
      />
      <esr-textarea
        v-model="projectValue.materials"
        placeholder="Введите подтверждающие материалы или иную информацию"
        label="Подтверждающие материалы или иная информация"
        class="m-6"
        :error-messages="v.materials.$errors.map((e) => e.$message)"
      />
      <esr-file-input
        v-model="documentsModel"
        placeholder="Выберите документы"
        label="Прикрепленные документы:"
        accept=".pdf,.doc,.docx"
        :max-file-size="150 * 1024 * 1024"
        multiple
        :file-limit="10"
      />
    </template>
    <template v-else>
      <esr-text
        label="Название проекта"
        class="project-fields__text"
      >
        {{ projectValue.name }}
      </esr-text>
      <esr-text
        v-if="projectValue.project_direction?.name"
        label="Направление"
        class="project-fields__text"
      >
        {{ projectValue.project_direction?.name }}
      </esr-text>
      <div class="project-fields__dates">
        <esr-text
          label="Начало проекта"
          class="project-fields__text"
        >
          {{ dayjs(projectValue.date_start).format(READBLE_DAYJS_DATE) }}
        </esr-text>
        <esr-text
          label="Конец проекта"
          class="project-fields__text"
        >
          {{ dayjs(projectValue.date_end).format(READBLE_DAYJS_DATE) }}
        </esr-text>
      </div>
      <esr-text
        label="Описание проекта"
        class="project-fields__text"
      >
        {{ projectValue.description }}
      </esr-text>
      <esr-text
        label="Место реализации проекта"
        class="project-fields__text"
      >
        {{ projectValue.place }}
      </esr-text>
      <esr-text
        label="Объем инвестиций, ₽"
        class="project-fields__text"
      >
        {{ projectValue.investment_volume }}
      </esr-text>
      <esr-text
        label="Подтверждающие материалы или иная информация"
        class="project-fields__text"
      >
        {{ projectValue.materials }}
      </esr-text>
      <esr-text
        label="Прикрепленные документы:"
        class="project-fields__text"
      />
      <div
        v-if="projectValue.documents?.length"
        class="project-fields__links"
      >
        <esr-link
          v-for="(document, documentIdx) in projectValue.documents"
          :key="documentIdx"
          :to="document.file.url"
          prepend-icon="mdi-file-document-outline"
          target="_blank"
          download
        >
          {{ document.title }}
        </esr-link>
      </div>
      <div v-else>
        -
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.project-fields {
  &__select {
    margin-top: 16px;
  }

  &__dates {
    display: flex;
    gap: 16px;
    margin: 16px 0;

    @include screen-mobile {
      flex-direction: column;
    }
  }

  &__text {
    display: block;
    margin-bottom: 24px;
  }

  &__links {
    display: flex;
  }
}
</style>
