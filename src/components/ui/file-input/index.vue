<script lang="ts" setup>
import { type MaybeRef, computed, defineModel, ref, unref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { EsrIcon, EsrTag } from "@/components/ui";
import { useUploadFile } from "@/modules/file/composables/useUploadFile";
import { useBEMNamespace } from "@/composables/useBEMNamespace";
import { type UploadFile } from "@/models/file";

const props = defineProps<{
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  errorMessages?: MaybeRef<string>[];
  accept?: string;
  maxFileSize?: number;
  fileLimit?: number;
}>();

const { uploadFile } = useUploadFile();

const model = defineModel<UploadFile[] | null>();
const fileInput = ref<HTMLInputElement>();

const ns = useBEMNamespace("esr-file-input");

const fileInputClasses = computed(() => [
  ns.block(),
  ns.modifier(props.disabled ? "disabled" : ""),
  ns.modifier(haveErrors.value),
]);
const filesErrors = ref<string[]>([]);

const rules = computed(() => ({
  filesErrors: { filesErrors: () => filesErrors.value.length === 0 },
}));

const v = useVuelidate(rules, { filesErrors });

const haveErrors = computed(() => {
  if (!props.errorMessages || props.disabled) return;

  return props.errorMessages.length > 0 ? "error" : undefined;
});

async function onFilesSelected(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  filesErrors.value = [];

  if (files) {
    if (props.fileLimit && files.length > props.fileLimit) {
      filesErrors.value.push(`Кол-во файлов не более ${props.fileLimit}`);

      return;
    }

    if (props.maxFileSize) {
      const maxFileSize = props.maxFileSize;
      const isExceed = Array.from(files).some(file => file.size > maxFileSize);

      if (isExceed) {
        filesErrors.value.push(`Размер файла не должен превышать ${maxFileSize / 1024 / 1024} Мб`);

        return;
      }
    }
  }

  const isValid = await v.value.$validate();
  if (!isValid) return;

  if (files) {
    try {
      const result = await uploadFile({ files });

      model.value = result?.data?.filesUploadMultiple;
    } catch (e) {
      console.error(e);
    }
  }
}

function deleteFile(file: UploadFile) {
  model.value = model.value?.filter(item => item.id !== file.id);
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}
</script>

<template>
  <div :class="fileInputClasses">
    <div
      v-if="label !== ''"
      class="esr-file-input__label"
    >
      {{ label }}
    </div>
    <div
      class="esr-file-input__label-wrapper"
      @click="fileInput?.click()"
    >
      <input
        ref="fileInput"
        class="esr-file-input__input"
        type="file"
        :accept="accept"
        :multiple="multiple"
        @change="onFilesSelected"
      >
      <esr-icon
        icon="mdi-paperclip"
        class="esr-file-input__icon"
      />
      <span
        v-if="!modelValue || modelValue.length === 0"
        class="esr-file-input__placeholder"
      >{{ placeholder ?? "Нажмите, чтобы загрузить документы" }}</span>
      <span>
        <esr-tag
          v-for="(file, idx) in modelValue"
          :key="idx"
          closable
          @close="deleteFile(file)"
          @click.stop
        >
          {{ file.name }}
        </esr-tag>
      </span>
    </div>
    <div
      v-if="haveErrors || filesErrors.length"
      class="esr-file-input__error"
    >
      {{ unref(errorMessages)?.[0] ?? filesErrors[0] }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.esr-file-input {
 &__input {
  display: none;
 }

 &__label {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 8px;

    @include text-sm;
  }

 &__label-wrapper {
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  color: var(--text-secondary);
  border-radius: var(--corner-radius-surface-small, 8px);
  border: 1.5px solid var(--stroke-secondary, #D8DDE5);
  background: var(--surface-light, #FFF);
  cursor: pointer;
 }

 &--error {
  .esr-file-input__label-wrapper {
    border-color: var(--service-error);
  }
 }

 &__error {
  color: var(--service-error);
  font-size: 0.875rem;
  margin-top: 8px;

  @include text-sm;
 }

 &__icon {
  margin-right: 12px;
  min-width: 20px;
 }

 &__placeholder {
  color: var(--text-secondary);
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
 }
}
</style>
