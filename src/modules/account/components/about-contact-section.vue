<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { email, minLength } from "@ozzcar11/utilities/validators";
import { useVuelidate } from "@vuelidate/core";
import { merge, omit } from "lodash-es";
import { type ContactPerson } from "@/models";
import { refWithDefault } from "@/utils/ref";
import { phoneMask } from "@/constants/masks";
import { objectIsFull } from "@/utils/object";

import { EsrButton, EsrCard, EsrInput, EsrText, EsrTextarea } from "@/components/ui";

import { stringToPhone } from "@/utils/maska";

const props = defineProps<{
  contact: ContactPerson;
}>();

const emit = defineEmits<{
  (e: "save-section", value: { contact_person: ContactPerson }): void;
}>();

const model = refWithDefault<ContactPerson>({
  firstname: "",
  lastname: "",
  middlename: "",
  phone: "",
  email: "",
  position: "",
  add_information: "",
});

const rules = computed(() => ({
  phone: { minLength: minLength(17, "Поле должно содержать не менее 11 символов") },
  email: { email },
}));

const v = useVuelidate(rules.value, model.ref.value);

const editable = ref<"empty" | "full" | "editable">("empty");

const saveDisabled = computed(() => objectIsFull(omit(model.ref.value, "middlename")));

model.ref.value = merge(model.ref.value, props.contact);

async function saveAboutContact() {
  const isValid = await v.value.$validate();
  if (!isValid) return;

  emit("save-section", {
    contact_person: model.ref.value,
  });
  editable.value = "full";
}

function cancelAboutContact() {
  merge(model.ref.value, model.default);
  editable.value = model.isEmpty() ? "empty" : "full";
}

onMounted(() => {
  editable.value = model.isEmpty() ? "empty" : "full";
});
</script>

<template>
  <esr-card class="account__card account-card">
    <h3
      class="account-card__title"
      :class="{ 'account-card__title--empty': editable === 'empty' }"
    >
      Информация о контактном лице
    </h3>
    <template v-if="editable === 'empty'">
      <div class="account-card__empty">
        Пока данных нет, заполните данные о контактном лице компании
      </div>
    </template>
    <esr-card
      v-else
      class="account-card__inner"
      background-color="--surface-accent-light-s"
    >
      <template v-if="editable === 'editable'">
        <div class="account-card__content">
          <esr-input
            v-model="model.ref.value.lastname"
            label="Фамилия"
            placeholder="Введите фамилию"
            size="large"
          />
          <esr-input
            v-model="model.ref.value.firstname"
            label="Имя"
            placeholder="Введите имя"
            size="large"
          />
          <esr-input
            v-model="model.ref.value.middlename"
            label="Отчество"
            placeholder="Введите отчество"
            size="large"
          />
          <esr-input
            v-model="model.ref.value.phone"
            :mask="phoneMask"
            label="Телефон"
            :error-messages="v.phone.$errors.map((e) => e.$message)"
            placeholder="Введите номер телефона"
            size="large"
          />
          <esr-input
            v-model="model.ref.value.email"
            label="Электронная почта"
            placeholder="Введите электронную почту"
            :error-messages="v.email.$errors.map((e) => e.$message)"
            size="large"
          />
          <esr-input
            v-model="model.ref.value.position"
            label="Должность"
            placeholder="Введите должность"
            size="large"
          />
        </div>
        <esr-textarea
          v-model="model.ref.value.add_information"
          label="Дополнительная информация"
          placeholder="Введите дополнительную информацию"
        />
      </template>
      <template v-else>
        <div class="account-card__content">
          <esr-text label="Фамилия">
            {{ contact?.lastname ?? '-' }}
          </esr-text>
          <esr-text label="Имя">
            {{ contact?.firstname ?? '-' }}
          </esr-text>
          <esr-text label="Отчество">
            {{ contact?.middlename ?? '-' }}
          </esr-text>
          <esr-text label="Телефон">
            {{ stringToPhone(contact?.phone ?? '') }}
          </esr-text>
          <esr-text label="E-mail">
            {{ contact?.email ?? '-' }}
          </esr-text>
          <esr-text label="Должность">
            {{ contact?.position ?? '-' }}
          </esr-text>
        </div>
        <esr-text label="Дополнительная информация">
          {{ contact?.add_information }}
        </esr-text>
      </template>
    </esr-card>
    <template v-if="editable === 'editable'">
      <div class="account-card__buttons">
        <esr-button
          class="account-card__button"
          :disabled="saveDisabled"
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
        @click="editable = 'editable'"
      >
        {{ editable === 'full' ? 'Редактировать' : 'Заполнить' }}
      </esr-button>
    </template>
  </esr-card>
</template>
