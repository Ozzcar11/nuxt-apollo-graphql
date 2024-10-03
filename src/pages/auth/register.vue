<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { useNotifications } from "@ozzcar11/utilities/composables";
import { objectIsFull } from "@/utils/object";
import { useUserStore } from "@/stores/useUserStore";

import { EsrCheckbox } from "@/components/ui/checkbox";
import AuthForm from "@/modules/auth/components/auth-form.vue";

import { useRegister } from "@/modules/auth/composables/useRegister";
import { useCompanyByToken } from "@/modules/companies/composables/useCompanyByToken";

import { accountAbout } from "@/router/account";

import { WRONG_LOGIN_OR_PASSWORD } from "@/constants/errors";

const route = useRoute();
const router = useRouter();
const token = route.query.token as string;

const { notificate } = useNotifications();

const registerForm = ref({
  password: "",
  repeat_password: "",
  token,
});

const v = useVuelidate();
const userStore = useUserStore();

const { registerRequest } = useRegister();
const { company } = await useCompanyByToken(token);

const termsStatus = ref(false);

const disableStatus = computed(() => objectIsFull({
  password: registerForm.value.password,
  repeat_password: registerForm.value.repeat_password,
}) || !termsStatus.value);

async function onSubmit() {
  try {
    const isValid = await v.value.$validate();
    if (!isValid) return;

    const res = await registerRequest({ inviteRegistration: registerForm.value });

    const user = res?.data?.inviteRegistration;

    if (!user) throw new Error(WRONG_LOGIN_OR_PASSWORD);

    if (user) {
      userStore.setUser(user);
    }

    void router.push(accountAbout);
  } catch (e) {
    console.error(e);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

</script>

<template>
  <div class="register">
    <auth-form
      v-model:firstInput="registerForm.password"
      v-model:secondInput="registerForm.repeat_password"
      title="Завершение регистрации"
      :subtitle="company?.name"
      :description="company ? `ИНН: ${company?.inn}` : ''"
      button-name="Зарегистрироваться"
      :disabled="disableStatus"
      both-password
      @submit="onSubmit"
    >
      <template #default>
        <esr-checkbox
          v-model="termsStatus"
          class="register__checkbox"
        >
          <template #label>
            Я соглашаюсь с <nuxt-link to="/">
              Политикой конфиденциальности
            </nuxt-link>
          </template>
        </esr-checkbox>
      </template>
    </auth-form>
  </div>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--surface-neutral-neutral-light-s, #F8FAFC);

  &__checkbox {
    margin: 32px 0;
  }
}
</style>
