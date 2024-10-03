<script lang="ts" setup>
import { ref } from "vue";
import { type ApplicationProject } from "@/models";
import { EsrButton, EsrCard, EsrDialog } from "@/components/ui";

import ApplicationProjectsFields from "@/modules/application/components/application-projects-fields.vue";

defineProps<{
  projects?: ApplicationProject[];
  editable?: boolean;
  isGoverment?: boolean;
}>();

const emit = defineEmits<{
  (e: "add-project"): void;
  (e: "remove-project", idx: number): void;
}>();

const deleteDialog = ref(false);
const deletedIdx = ref<number | null>(null);

function removeProject() {
  if (deletedIdx.value === null) return;
  emit("remove-project", deletedIdx.value);
  deleteDialog.value = false;
}

</script>

<template>
  <div
    v-if="projects"
    class="projects"
  >
    <esr-card
      v-for="(project, idx) in projects"
      :key="idx"
      class="projects__card"
    >
      <div class="projects__header">
        <h5 class="projects__title">
          Проект №{{ idx + 1 }}
        </h5>
        <esr-button
          v-if="editable"
          color="blue"
          @click="deleteDialog = true, deletedIdx = idx"
        >
          Удалить
        </esr-button>
      </div>
      <esr-card class="projects__inner-card">
        <application-projects-fields
          :project="project"
          :editable="editable"
          :is-goverment="isGoverment"
        />
      </esr-card>
    </esr-card>
    <esr-button
      v-if="editable"
      prefix-icon="mdi-plus"
      color="light"
      class="projects__button"
      @click="$emit('add-project')"
    >
      Добавить новый проект
    </esr-button>
  </div>
  <esr-dialog
    v-model="deleteDialog"
    @submit-dialog="removeProject"
    @cancel-dialog="deleteDialog = false, deletedIdx = null"
  >
    <template #title>
      Вы хотите удалить проект?
    </template>
    <template #description>
      Проект будет полностью удален с сайта без возможности его восстановления
    </template>
  </esr-dialog>
</template>

<style lang="scss" scoped>
.projects {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__header {
    display: flex;
    justify-content: space-between;
    align-self: center;
    margin-bottom: 24px;
  }

  &__card {
    width: 100%;
    margin-top: 24px;
    padding: 32px;
    border-radius: 8px;
    background: var(--surface-light, #FFF);
    box-shadow: 0 4px 24px 0 rgba(5, 25, 69, 0.04);
  }

  &__title {
    color: var(--text-primary);

    @include text-h5;
  }

  &__inner-card {
    padding: 24px;
    border-radius: 8px;
    background: var(--surface-accent-light-s, #F6F8FB);
  }

  &__button {
    text-align: center;
    width: 270px;
    margin-top: 30px;

    @include screen-tablet {
      margin-top: 12px;
    }

    @include screen-mobile {
      margin-top: 14px;
    }
  }
}
</style>
