<script lang="ts" setup>
import { computed, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { cloneDeep } from "lodash-es";
import { useVuelidate } from "@vuelidate/core";
import { EsrButton, EsrStepper, EsrTag } from "@/components/ui";

import ApplicationQuestions from "@/modules/application/components/application-questions.vue";
import ApplicationProjects from "@/modules/application/components/application-projects.vue";

import { useApplicationTreeGet } from "@/modules/application/composables/useApplicationTreeGet";
import { useApplicationGet } from "@/modules/application/composables/useApplicationGet";
import { useApplicationSync } from "@/modules/application/composables/useApplicationSync";
import { useApplicationUpdate } from "@/modules/application/composables/useApplicationUpdate";
import { useProjectDelete } from "@/modules/project/composables/useProjectDelete";
import { APPLICATION_STATUS, APPLICATION_STATUS_TITLE, APPLICATION_STEPS } from "@/modules/application/constants";
import { refWithDefault } from "@/utils/ref";
import { applicationEcology, applicationGovernment } from "@/router/application";

import { type Area } from "@/models/application";

const router = useRouter();
const stepperItems = Object.values(APPLICATION_STEPS);
const stepperModel = ref<number>(1);
const instance = getCurrentInstance();

const { applicationTree, onResult, loading } = useApplicationTreeGet();
const { application, refetch } = useApplicationGet();
const { syncApplication } = useApplicationSync();
const { updateApplication } = useApplicationUpdate();
const { removeProject } = useProjectDelete();

const applicationData = refWithDefault<Area[]>([]);
const applicationDataParent = refWithDefault<Area | undefined>(undefined);

const questionEditModel = ref<boolean>(false);
const questionEditValue = ref<boolean>(false);

const editable = computed(() => application?.value?.account_status === APPLICATION_STATUS.FORMING_THE_QUESTIONNAIRE);

const v = useVuelidate();

onResult(() => {
  if (!applicationTree.value) return;

  applicationDataParent.ref.value = cloneDeep(applicationTree.value?.find(item => item.name === APPLICATION_STEPS.PERSONNEL));
  const applicationDataValue = applicationDataParent.ref.value?.children[0].children ?? [];

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

  const projects = applicationDataParent.ref.value?.projects.map(project => ({
    ...project,
    area: {
      id: applicationDataParent.ref.value?.id,
    },
  }));

  await syncApplication({
    userApplicationSync: {
      userApplicationQuestionnaires,
      projects: projects ?? [],
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
    void router.push(applicationGovernment);
  }
}

function addDefaultProject() {
  applicationDataParent.ref.value?.projects.push({
    name: "",
    description: "",
    place: "",
    date_start: "",
    date_end: "",
    investment_volume: "",
    materials: "",
    project_direction: null,
    documents: [],
  });
}

async function removeProjectById(idx: number) {
  if (!applicationDataParent.ref.value) return;

  await removeProject({ userApplicationProjects: [{ id: applicationDataParent.ref.value?.projects[idx].id }] });

  applicationDataParent.ref.value?.projects.splice(idx, 1);
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
        :status="application?.account_status"
        :is-edited="application?.is_edited"
        :question-edit-value="questionEditValue"
        @question-edit="questionEditModel = true"
      />
      <application-projects
        :projects="applicationDataParent.ref.value?.projects"
        :editable="editable"
        @add-project="addDefaultProject"
        @remove-project="removeProjectById"
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
          :to="applicationEcology"
          class="application__prev-btn"
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
