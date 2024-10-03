<script lang="ts" setup>
import { type Ref, computed, defineModel } from "vue";
import { containsLetter, containsNumber, minLength, requiredIf, sameAs } from "@ozzcar11/utilities/validators";
import { useVuelidate } from "@vuelidate/core";
import { helpers } from "@vuelidate/validators";
import { EsrCard } from "@/components/ui/card";
import { EsrInput } from "@/components/ui/input";
import { EsrButton } from "@/components/ui/button";

const props = defineProps<{
  title: string;
  subtitle?: string;
  description?: string;
  bothPassword?: boolean;
  buttonName?: string;
  invalid?: boolean;
  disabled?: boolean;
}>();

defineEmits<{
  (e: "submit", event: Event): void;
}>();

const firstInput = defineModel<string | number | null>("firstInput", { default: null });
const secondInput = defineModel<string | number | null>("secondInput", { default: null });

const credentialsValidator = helpers.withMessage("Указанный вами ИНН или пароль некорректен", () => {
  return !props.invalid;
});

const formValue = computed(() => ({
  firstInput: firstInput.value,
  secondInput: secondInput.value,
}));

const getfirstInputRules = () => {
  let rules: Record<string, unknown> = {
    required: requiredIf(() => firstInput !== null),
    invalid: () => !props.invalid,
  };

  if (props.bothPassword) {
    rules = {
      ...rules,
      minLength: minLength(8),
      containsLetter,
      containsNumber,
    };
  }

  return rules;
};

const clearFromLetters = (event: InputEvent) => {
  if (props.bothPassword && event.target) return;
  firstInput.value = (event.target as HTMLInputElement)?.value.replace(/[^0-9]/g, "");
};

const secondInputRules = {
  required: requiredIf(() => secondInput !== null),
  sameAs: props.bothPassword ? sameAs(firstInput as Ref<string>, "Пароли не совпадают") : false,
  invalid: credentialsValidator,
};

const rules = computed(() => ({
  firstInput: getfirstInputRules(),
  secondInput: secondInputRules,
}));

const v = useVuelidate(rules, formValue);

const firstInputProps = computed(() => {
  if (props.bothPassword) {
    return {
      type: "password",
      label: "Придумайте пароль",
      placeholder: "Введите пароль",
    };
  }

  return {
    type: "text",
    label: "ИНН",
    placeholder: "Введите ИНН",
  };
});

</script>

<template>
  <esr-card
    class="login-form"
  >
    <div class="login-form__header">
      <h5
        v-if="props.title"
        class="login-form__title"
      >
        {{ props.title }}
      </h5>
      <h6
        v-if="props.subtitle"
        class="login-form__subtitle"
      >
        {{ props.subtitle }}
      </h6>
      <p
        v-if="props.description"
        class="login-form__description"
      >
        {{ props.description }}
      </p>
    </div>
    <esr-input
      v-if="firstInput !== null"
      v-model="firstInput"
      v-bind="firstInputProps"
      class="login-form__input"
      width="100%"
      size="large"
      :type="bothPassword ? 'password' : 'text'"
      :invalid="invalid"
      :error-messages="v.firstInput.$errors.map((e) => e.$message)"
      @keyup="clearFromLetters($event)"
    />
    <esr-input
      v-if="secondInput !== null"
      v-model="secondInput"
      class="login-form__input"
      type="password"
      width="100%"
      size="large"
      :invalid="invalid"
      :label="bothPassword ? 'Повторите пароль' : 'Пароль'"
      :placeholder="bothPassword ? 'Введите пароль ещё раз' : 'Введите пароль'"
      :error-messages="v.secondInput.$errors.map((e) => e.$message)"
    />
    <slot name="default" />
    <esr-button
      class="login-form__button"
      width="100%"
      :disabled="disabled"
      @click="$emit('submit', $event)"
    >
      {{ buttonName ?? "Войти" }}
    </esr-button>

    <slot name="footer" />
  </esr-card>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  padding: 56px 32px 32px;
  background-color: var(--surface-light);

  @include screen-mobile {
    padding: 32px 24px 24px;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__title {
    max-width: 390px;
    color: var(--text-primary);
    margin-bottom: 24px;

    @include text-h5
  }

  &__subtitle {
    margin-bottom: 12px;
    color: var(--text-primary);

    @include text-base
  }

  &__description {
    color: var(--text-secondary);
    margin-bottom: 24px;

    @include text-sm
  }

  &__input {
    & + & {
      margin-top: 16px;
    }
  }

  &__button {
    width: 100%;
  }

  &__input + &__button {
    margin-top: 32px;
  }

  @include screen-tablet {
    width: 400px;
  }

  @include screen-mobile {
    width: 100%;
    margin: 0 12px;
  }
}
</style>
