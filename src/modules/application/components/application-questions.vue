<script lang="ts" setup>
import { EsrCard } from "@/components/ui";

import ApplicationQuestionsFields from "@/modules/application/components/application-questions-fields.vue";

import { type Area } from "@/models";
import { type ApplicationStatusType } from "@/modules/application/constants";

defineProps<{
  areas: Area[];
  editable: boolean;
  inputNumbers?: boolean;
  questionEditValue?: boolean;
  status?: ApplicationStatusType;
  isEdited?: boolean;
}>();

defineEmits<{
  (e: "question-edit"): void;
}>();

</script>

<template>
  <div
    v-for="area in areas"
    :key="area.id"
    class="questions"
  >
    <esr-card
      v-if="area.application_area_questions.length"
      class="questions__card"
    >
      <h5 class="questions__title">
        {{ area.name }}
      </h5>
      <div
        v-for="(question, idx ) in area.application_area_questions"
        :key="idx"
        class="questions-inner"
      >
        <esr-card
          v-if="question.system_name !== 'social_investments'"
          class="questions-inner__card"
        >
          <application-questions-fields
            :question="question"
            :idx="idx"
            :editable="editable"
            :input-numbers="inputNumbers"
            :question-edit-value="questionEditValue"
            :status="status"
            :is-edited="isEdited"
            @question-edit="$emit('question-edit')"
          />
        </esr-card>
      </div>
    </esr-card>
  </div>
</template>

<style lang="scss" scoped>
.questions {
  &__card {
    padding: 24px;
    background-color: var(--surface-light);
  }

  &__title {
    color: var(--text-primary);
    margin-bottom: 24px;

    @include text-h5;
  }

  &-inner {
    & + & {
      margin-top: 24px;
    }
  }

  &-inner__card {
    padding: 24px;
    background: var(--surface-accent-light-s, #F6F8FB);
  }

  & + & {
    margin-top: 24px;
  }
}
</style>
