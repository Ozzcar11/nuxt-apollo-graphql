<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, requiredIf } from "@ozzcar11/utilities/validators";
import { type ApplicationQuestion, type ApplicationQuestionAnswer } from "@/models/application";
import { APPLICATION_STATUS, type ApplicationStatusType } from "@/modules/application/constants";

import { EsrButton, EsrDialog, EsrFileInput, EsrInput, EsrLink, EsrSelect, EsrText, EsrTextarea } from "@/components/ui";
import { moneyMask } from "@/utils/maska";

const props = defineProps<{
  question: ApplicationQuestion;
  idx: number;
  editable: boolean;
  inputNumbers?: boolean;
  questionEditValue?: boolean;
  status?: ApplicationStatusType;
  isEdited?: boolean;
}>();

const emit = defineEmits<{
  (e: "question-edit"): void;
}>();

const questionValue = computed(() => props.question.user_application_questionnaires[0]);

const selfEditable = ref<boolean>(false);
const editDialog = ref<boolean>(false);

const answerModel = computed({
  get() {
    return questionValue.value?.answer?.id;
  },
  set(value) {
    if (!questionValue.value.answer) questionValue.value.answer = {};
    questionValue.value.answer = { id: value };
  },
});

const documentsModel = computed({
  get() {
    return questionValue.value?.documents.map(item => ({
      ...item.file,
    }));
  },
  set(value) {
    questionValue.value.documents = value.map(item => ({
      title: item.name,
      file: item,
    }));
  },
});

const rules = computed(() => ({
  answer: { required: requiredIf(() => !props.inputNumbers) },
  value: { required: requiredIf(() => props.inputNumbers) },
  company_comment: { maxLength: maxLength(256) },
}));

const v = useVuelidate(rules, questionValue.value as Required<ApplicationQuestionAnswer>);

function questionEdit() {
  selfEditable.value = true;
  editDialog.value = false;

  emit("question-edit");
}

watch(() => props.questionEditValue, () => {
  selfEditable.value = false;
});
</script>

<template>
  <div
    class="question-fields"
  >
    <esr-text
      :label="`Вопроc ${idx + 1}`"
      class="question-fields__text question-fields__text-title"
    >
      {{ question.text }}
    </esr-text>
    <template v-if="editable || selfEditable">
      <esr-select
        v-if="!inputNumbers"
        v-model="answerModel"
        :options="props.question.question_canned_answers"
        class="question-fields__select"
        label-prop="text"
        value-prop="id"
        :error-messages="v.answer.$errors.map((e) => e.$message)"
        label="Ваш ответ"
      />
      <esr-input
        v-else
        v-model="questionValue.value"
        class="question-fields__select"
        :mask-options="moneyMask"
        :error-messages="v.value.$errors.map((e) => e.$message)"
        label="Ваш ответ"
      />
      <esr-textarea
        v-model="questionValue.company_comment"
        label="Комментарии"
        placeholder="Введите комментарий"
        :error-messages="v.company_comment.$errors.map((e) => e.$message)"
        class="question-fields__textarea"
      />
      <esr-file-input
        v-if="!inputNumbers"
        v-model="documentsModel"
        class="question-fields__file-input"
        label="Прикреплённые документы"
        accept=".pdf,.doc,.docx"
        :max-file-size="150 * 1024 * 1024"
        multiple
        :file-limit="10"
      />
    </template>
    <template v-else>
      <esr-text
        label="Ответ представителя"
        class="question-fields__text"
      >
        {{ inputNumbers ? questionValue.value : questionValue.answer?.text ?? '' }}
      </esr-text>
      <esr-text
        label="Комментарий представителя"
        class="question-fields__text"
      >
        {{ questionValue.company_comment ?? "-" }}
      </esr-text>
      <esr-text
        v-if="!inputNumbers"
        label="Прикрепленные материалы:"
        class="question-fields__text"
      />
      <div
        v-if="questionValue.documents?.length"
        class="question-fields__links"
      >
        <esr-link
          v-for="(document, documentIdx) in questionValue.documents"
          :key="documentIdx"
          :to="document.file.url"
          prepend-icon="mdi-file-document-outline"
          target="_blank"
          download
        >
          {{ document.title }}
        </esr-link>
      </div>
      <div v-else-if="!inputNumbers">
        -
      </div>
      <template v-if="status === APPLICATION_STATUS.PROCESSED && questionValue.user_question_scoring">
        <div
          v-if="questionValue?.user_question_scoring?.points !== null || questionValue?.user_question_scoring?.expert_comment !== null"
          class="question-fields__expert"
        >
          <esr-text
            v-if="questionValue?.user_question_scoring?.points !== null"
            label="Количество баллов:"
            color="light"
            class="question-fields__text"
          >
            {{ questionValue?.user_question_scoring?.points }} из {{ questionValue?.user_question_scoring?.max_points }}
          </esr-text>
          <esr-text
            v-if="questionValue?.user_question_scoring?.expert_comment !== null"
            label="Комментарий эксперта"
            color="light"
            class="question-fields__text"
          >
            {{ questionValue?.user_question_scoring?.expert_comment }}
          </esr-text>
        </div>
        <esr-button
          v-if="!isEdited"
          class="question-fields__edit"
          color="blue"
          @click="editDialog = true"
        >
          Редактировать
        </esr-button>
      </template>
    </template>
    <esr-dialog
      v-model="editDialog"
      max-width="650px"
      @submit-dialog="questionEdit"
      @cancel-dialog="editDialog = false"
    >
      <template #title>
        Редактировать проверенную анкету можно 1 раз в год. Вы хотите отредактировать анкету?
      </template>
      <template #description>
        При редактировании вопроса анкета будет переведена в статус “Формирование анкеты”. После окончания редактирования вопросов анкету снова можно отправить на проверку.
      </template>
    </esr-dialog>
  </div>
</template>

<style lang="scss">
.question-fields {
  position: relative;

  &__text {
    display: block;

    &-title {
      max-width: 1000px;
      margin-bottom: 24px;

      @include screen-tablet {
        max-width: 400px;
      }
    }

    & + & {
      margin-top: 24px;
    }
  }

  &__select {
    margin-bottom: 24px;
  }

  &__textarea {
    margin-bottom: 16px;
  }

  &__links {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    @include screen-mobile {
      span {
        max-width: 200px;
        overflow: hidden;
      }
    }

    margin-bottom: 16px;
  }

  &__expert {
    margin-top: 24px;
    padding: 24px;
    border-radius: var(--corner-radius-surface-small, 8px);
    background: var(--surface-dark-accent, #051945);
  }

  &__file-input {
    .esr-tag__text {
      @include screen-mobile {
        max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      }
    }
  }

  &__edit {
    position: absolute;
    top: -10px;
    right: -20px;
  }
}
</style>
