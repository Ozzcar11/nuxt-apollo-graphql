<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";
import { objectIsFull } from "@/utils/object";
import { type ApolloError } from "@/models/apollo";

import AuthForm from "@/modules/auth/components/auth-form.vue";
import { EsrLink } from "@/components/ui/link";
import { useUserStore } from "@/stores/useUserStore";

import { useLoginInn } from "@/modules/auth/composables/useLoginInn";
import { useEsiaStart } from "@/modules/auth/composables/useEsiaStart";

import { accountAbout } from "@/router/account";

import { WRONG_LOGIN_OR_PASSWORD } from "@/constants/errors";
import { refWithDefault } from "@/utils/ref";

const router = useRouter();
const userStore = useUserStore();

const { loginRequest } = useLoginInn();
const { startEsia } = useEsiaStart();

const loginForm = refWithDefault({
  login: "",
  password: "",
});

const v = useVuelidate();

const disableStatus = computed(() => objectIsFull({
  login: loginForm.ref.value.login,
  password: loginForm.ref.value.password,
}));

const invalidCredentials = ref(false);

async function onSubmit() {
  try {
    invalidCredentials.value = false;
    const isValid = await v.value.$validate();
    if (!isValid) return;

    const res = await loginRequest({
      input: {
        login: loginForm.ref.value.login.toString(),
        password: loginForm.ref.value.password,
      },
    });

    const user = res?.data?.login.user;

    if (!user) throw new Error(WRONG_LOGIN_OR_PASSWORD);

    if (user) {
      userStore.setUser(user);
    }

    void router.push(accountAbout);
  } catch (e) {
    if ((e as ApolloError).message === WRONG_LOGIN_OR_PASSWORD) {
      invalidCredentials.value = true;
      loginForm.saveAsDefault();
    }

    console.error(e);
  }
}

async function loginEsia() {
  const res = await startEsia();
  if (!res?.data?.esiaStart) return;

  window.location.href = res.data.esiaStart;
}

watch(() => loginForm.isDefault(), (value) => {
  if (!value) invalidCredentials.value = false;
}, { deep: true });
</script>

<template>
  <div class="login">
    <auth-form
      v-model:firstInput="loginForm.ref.value.login"
      v-model:secondInput="loginForm.ref.value.password"
      title="Вход с помощью ИНН и пароля"
      :invalid="invalidCredentials"
      :disabled="disableStatus || loginForm.isDefault()"
      @submit="onSubmit"
    >
      <template #footer>
        <div class="login-footer">
          <esr-link
            class="login-footer__link"
            @click="loginEsia"
          >
            Войти через ЕСИА
          </esr-link>
          <p class="login-footer__description">
            По вопросам входа в личный кабинет обращайтесь на почту <a href="mailto:ozzcar11@mail.ru">ozzcar11@mail.ru</a>
          </p>
        </div>
      </template>
    </auth-form>
  </div>
</template>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--surface-neutral-neutral-light-s, #F8FAFC);

  &__link {
    margin-bottom: 32px;
  }

  &-footer {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 24px;
    text-align: center;

    &__description {
      font-size: 14px;
      color: var(--text-secondary);
      margin-top: 32px;
      max-width: 300px;

      @include text-sm;
    }
  }
}
</style>
