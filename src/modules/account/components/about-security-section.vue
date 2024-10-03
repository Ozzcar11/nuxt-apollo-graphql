<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { containsLetter, containsNumber, minLength, sameAs } from "@ozzcar11/utilities/validators";
import { useVuelidate } from "@vuelidate/core";
import { cloneDeep } from "lodash-es";
import { helpers } from "@vuelidate/validators";
import { refWithDefault } from "@/utils/ref";

import { EsrButton, EsrCard, EsrInput } from "@/components/ui";

type PasswordsType = {
  old_password: string;
  password: string;
  repeat_password: string;
};

const props = defineProps<{
  passwords: PasswordsType;
  invalid?: boolean;
}>();

const emit = defineEmits<{
  (e: "save-section", value: PasswordsType): void;
  (e: "reset-status"): void;
}>();

const model = refWithDefault(cloneDeep(props.passwords));

const firstPassord = computed(() => model.ref.value.password);

const oldPasswordValidator = helpers.withMessage("Некорректный пароль", () => {
  return !props.invalid;
});

const rules = computed(() => ({
  old_password: {
    invalid: oldPasswordValidator,
  },
  password: {
    minLength: minLength(8),
    containsLetter,
    containsNumber,
  },
  repeat_password: {
    minLength: minLength(8),
    containsLetter,
    containsNumber,
    sameAs: sameAs(firstPassord, "Пароли не совпадают"),
  },
}));

const v = useVuelidate(rules, model.ref.value);

const editable = ref<boolean>(false);

async function saveAboutContact() {
  emit("reset-status");

  const isValid = await v.value.$validate();
  if (!isValid) return;

  emit("save-section", model.ref.value);
  editable.value = false;
}

function cancelAboutContact() {
  editable.value = false;
  model.reset();
}

watch(() => props.invalid, (value: boolean) => {
  if (value) editable.value = true;
});
</script>

<template>
  <esr-card class="account__card account-card">
    <h3
      class="account-card__title"
      :class="{ 'account-card__title--empty': editable === false }"
    >
      Безопасность
    </h3>
    <template v-if="!editable">
      <div class="account-card__empty">
        Здесь вы можете редактировать доступы к личному кабинету
      </div>
    </template>
    <esr-card
      v-else
      class="account-card__inner"
      background-color="--surface-accent-light-s"
    >
      <div class="account-card__content password-grid">
        <esr-input
          v-model="model.ref.value.old_password"
          label="Старый пароль"
          class="password-grid__first"
          type="password"
          placeholder="Введите старый пароль"
          size="large"
          :error-messages="v.old_password.$errors.map((e) => e.$message)"
        />
        <esr-input
          v-model="model.ref.value.password"
          label="Новый пароль"
          type="password"
          class="password-grid__second"
          placeholder="Введите новый пароль"
          size="large"
          :error-messages="v.password.$errors.map((e) => e.$message)"
        />
        <esr-input
          v-model="model.ref.value.repeat_password"
          label="Новый пароль ещё раз"
          placeholder="Введите новый пароль ещё раз"
          class="password-grid__third"
          type="password"
          size="large"
          :error-messages="v.repeat_password.$errors.map((e) => e.$message)"
        />
      </div>
    </esr-card>
    <template v-if="editable">
      <div class="account-card__buttons">
        <esr-button
          class="account-card__button"
          :disabled="model.isFull()"
          size="large"
          @click="saveAboutContact"
        >
          Сохранить
        </esr-button>
        <esr-button
          color="secondary"
          size="large"
          @click="cancelAboutContact"
        >
          Отмена
        </esr-button>
      </div>
    </template>
    <template v-else>
      <esr-button
        class="account-card__edit"
        color="secondary"
        size="large"
        @click="editable = true"
      >
        Редактировать
      </esr-button>
    </template>
  </esr-card>
</template>
