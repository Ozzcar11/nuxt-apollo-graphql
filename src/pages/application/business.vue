<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from "vue";
import { cloneDeep } from "lodash-es";
import { useVuelidate } from "@vuelidate/core";
import { EsrButton, EsrDialog, EsrStepper, EsrTag } from "@/components/ui";

import ApplicationQuestions from "@/modules/application/components/application-questions.vue";

import { useApplicationTreeGet } from "@/modules/application/composables/useApplicationTreeGet";
import { useApplicationGet } from "@/modules/application/composables/useApplicationGet";
import { useApplicationSync } from "@/modules/application/composables/useApplicationSync";
import { useApplicationUpdate } from "@/modules/application/composables/useApplicationUpdate";
import { APPLICATION_STATUS, APPLICATION_STATUS_TITLE, APPLICATION_STEPS } from "@/modules/application/constants";
import { refWithDefault } from "@/utils/ref";

import { type Area } from "@/models/application";
import { applicationGovernment } from "@/router/application";

const stepperItems = Object.values(APPLICATION_STEPS);
const stepperModel = ref<number>(3);

const { applicationTree, onResult, loading, refetch: refetchTree } = useApplicationTreeGet();
const { application, refetch } = useApplicationGet();
const { updateApplication } = useApplicationUpdate();
const { syncApplication } = useApplicationSync();
const instance = getCurrentInstance();

const applicationData = refWithDefault<Area[]>([]);

const editable = computed(() => application?.value?.account_status === APPLICATION_STATUS.FORMING_THE_QUESTIONNAIRE);

const v = useVuelidate();

onResult(() => {
  if (!applicationTree.value) return;

  const applicationDataValue = cloneDeep(applicationTree.value?.find(item => item.name === APPLICATION_STEPS.BUISINESS)?.children) ?? [];

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

const questionEditModel = ref<boolean>(false);
const questionEditValue = ref<boolean>(false);

const sendDialog = ref<boolean>(false);

async function syncQuestions(questionEdit: boolean = false, sync: boolean = true) {
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

  if (sync) {
    await updateApplication({
      userApplication: {
        account_status: APPLICATION_STATUS.SEND_FOR_PROCESSING,
        is_edited: questionEdit,
      },
    });

    await refetch();

    questionEditModel.value = false;

    instance?.proxy?.$forceUpdate();

    void refetchTree();
  }
}

async function sendQuestionsHandler() {
  await syncQuestions(questionEditModel.value);

  sendDialog.value = false;
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
        :is-edited="application?.is_edited"
        :editable="editable"
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
          color="secondary"
          :to="applicationGovernment"
          class="application__prev-btn"
        >
          Назад
        </esr-button>
        <esr-button
          v-if="editable"
          class="application__save-btn"
          color="secondary"
          @click="syncQuestions(false, false)"
        >
          Сохранить как черновик
        </esr-button>
        <template v-if="!questionEditModel">
          <esr-button
            :disabled="!editable"
            class="application__next-btn"
            @click="sendDialog = true"
          >
            {{ editable ? 'Отправить на проверку' : 'Далее' }}
          </esr-button>
        </template>
        <template v-else>
          <esr-button
            disabled
            class="application__next-btn"
            color="secondary"
          >
            {{ 'Далее' }}
          </esr-button>
          <esr-button
            v-if="questionEditModel"
            class="application__top-btn"
            @click="sendDialog = true"
          >
            {{ 'Отправить на проверку' }}
          </esr-button>
        </template>
      </div>
    </div>
    <esr-dialog
      v-model="sendDialog"
      @submit-dialog="sendQuestionsHandler"
      @cancel-dialog="sendDialog = false"
    >
      <template #title>
        Отправить анкету на проверку?
      </template>
      <template #description>
        После отправки анкеты на проверку редактировать её уже нельзя
      </template>
    </esr-dialog>
  </div>
</template>
