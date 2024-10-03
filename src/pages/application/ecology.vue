<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { cloneDeep } from "lodash-es";
import { useVuelidate } from "@vuelidate/core";
import { EsrButton, EsrStepper, EsrTag } from "@/components/ui";

import ApplicationQuestions from "@/modules/application/components/application-questions.vue";

import { useApplicationUpdate } from "@/modules/application/composables/useApplicationUpdate";
import { useApplicationTreeGet } from "@/modules/application/composables/useApplicationTreeGet";
import { useApplicationGet } from "@/modules/application/composables/useApplicationGet";
import { useApplicationSync } from "@/modules/application/composables/useApplicationSync";
import { APPLICATION_STATUS, APPLICATION_STATUS_TITLE, APPLICATION_STEPS } from "@/modules/application/constants";
import { refWithDefault } from "@/utils/ref";
import { applicationPersonal } from "@/router/application";

import { type Area } from "@/models/application";

const router = useRouter();
const stepperItems = Object.values(APPLICATION_STEPS);
const stepperModel = ref<number>(0);
const instance = getCurrentInstance();

const { applicationTree, onResult, loading } = useApplicationTreeGet();
const { updateApplication } = useApplicationUpdate();
const { application, refetch } = useApplicationGet();
const { syncApplication } = useApplicationSync();

const questionEditModel = ref<boolean>(false);
const questionEditValue = ref<boolean>(false);

const applicationData = refWithDefault<Area[]>([]);

const editable = computed(() => application?.value?.account_status === APPLICATION_STATUS.FORMING_THE_QUESTIONNAIRE);

const v = useVuelidate();

onResult(() => {
  if (!applicationTree.value) return;

  const applicationDataValue = cloneDeep(applicationTree.value?.find(item => item.name === APPLICATION_STEPS.ECOLOGY)?.children) ?? [];

  for (const item of applicationDataValue) {
    for (const question of item.application_area_questions) {
      if (!question.user_application_questionnaires.length) {
        question.user_application_questionnaires.push({
          value: "",
          question: {
            id: question.id,
            text: question.text,
          },
          answer: {},
          company_comment: "",
          documents: [],
        });
      }
    }
  }

  applicationData.ref.value = applicationDataValue;

  applicationData.saveAsDefault();
});

async function syncQuestions(toNextPage: boolean = false, questionEdit: boolean = false) {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  const questions = applicationData.ref.value.map(area => area.application_area_questions).flat().map(question => question.user_application_questionnaires);

  const userApplicationQuestionnaires = questions.flat().map(question => {
    return {
      question: {
        id: question.question.id,
      },
      answer: {
        id: question.answer.id,
      },
      company_comment: question.company_comment,
      documents: question.documents,
    };
  });

  await syncApplication({
    userApplicationSync: {
      userApplicationQuestionnaires,
      projects: [],
    },
  });

  applicationData.saveAsDefault();

  questionEditValue.value = !questionEditValue.value;

  if (questionEdit) {
    await updateApplication({
      userApplication: {
        account_status: APPLICATION_STATUS.SEND_FOR_PROCESSING,
        is_edited: questionEdit,
      },
    });

    questionEditModel.value = false;
    instance?.proxy?.$forceUpdate();
    await refetch();
  }

  if (toNextPage) {
    void router.push(applicationPersonal);
  }
}
</script>

<template>
  <div class="application">
    <div class="container">
      <div class="application__title">
        <span class="application__title-text">Участие в анкетировании</span>
        <esr-tag color="blue-light">
          {{ application ? APPLICATION_STATUS_TITLE[application?.account_status] : "Не определено" }}
        </esr-tag>
      </div>
      <div class="application__description">
        Участвовать во втором этапе оценки для формирования итогового индекса деловой репутации (ЭКГ-рейтинга)
      </div>
      <esr-stepper
        v-model="stepperModel"
        :items="stepperItems"
        class="application__stepper"
      />
      <application-questions
        :areas="applicationData.ref.value"
        :editable="editable"
        :is-edited="application?.is_edited"
        :status="application?.account_status"
        :question-edit-value="questionEditValue"
        @question-edit="questionEditModel = true"
      />
    </div>
    <div
      v-if="!loading"
      class="application__footer"
      :class="{ 'application__footer--bottom': !questionEditModel }"
    >
      <div
        class="application__container container"
      >
        <esr-button
          class="application__prev-btn"
          color="secondary"
          disabled
        >
          Назад
        </esr-button>
        <esr-button
          v-if="application?.account_status === APPLICATION_STATUS.FORMING_THE_QUESTIONNAIRE"
          class="application__save-btn"
          color="secondary"
          @click="syncQuestions()"
        >
          Сохранить как черновик
        </esr-button>
        <esr-button
          class="application__next-btn"
          :color="questionEditModel ? 'secondary' : 'primary'"
          @click="syncQuestions(true)"
        >
          Далее
        </esr-button>
        <esr-button
          v-if="questionEditModel"
          class="application__top-btn"
          color="primary"
          @click="syncQuestions(false, questionEditModel)"
        >
          Отправить на проверку
        </esr-button>
      </div>
    </div>
  </div>
</template>
