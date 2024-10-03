<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookie } from "#app";
import { useUserStore } from "@/stores/useUserStore";

import { EsrButton, EsrCard, EsrCheckbox } from "@/components/ui";

import { useEsiaLogin } from "@/modules/auth/composables/useEsiaLogin";

import { type User } from "~/models";
import { accountAbout } from "~/router/account";
import { authLogin } from "~/router/auth";

const route = useRoute();
const router = useRouter();
const cookie = useCookie("orgOid");
const userStore = useUserStore();

const termsStatus = ref(false);
const errorPage = ref(false);
const loading = ref(true);

const { loginEsia } = useEsiaLogin();

const userValue = ref<User | null>(null);

function onSubmit() {
  if (errorPage.value) {
    void router.push(authLogin);

    return;
  }

  if (!userValue.value?.company) return;

  userStore.setUser(userValue.value);
  void router.push(accountAbout);
}

onMounted(async () => {
  try {
    if (!cookie.value) return;
    const res = await loginEsia({
      input: {
        orgOid: +cookie.value,
        state: route.query.state as string,
        code: route.query.code as string,
      },
    });

    userValue.value = res?.data?.esiaLogin?.user ?? null;
    cookie.value = null;
  } catch (e) {
    console.error(e);

    if ((e as Error).message === "Company with this inn not found") {
      errorPage.value = true;
    } else {
      void router.push(authLogin);
    }
  } finally {
    loading.value = false;
  }
});

</script>

<template>
  <div class="login-complete">
    <esr-card
      v-if="!loading"
      class="login-complete__card"
    >
      <h2
        class="login-complete__title"
      >
        {{ errorPage ? "Компания с таким ИНН не найдена" : "Завершение регистрации" }}
      </h2>
      <template v-if="!errorPage">
        <h4
          class="login-complete__subtitle"
        >
          {{ userValue?.company?.name }}
        </h4>
        <p
          class="login-complete__description"
        >
          ИНН: {{ userValue?.company?.inn }}
        </p>
        <esr-checkbox
          v-model="termsStatus"
          class="login-complete__checkbox"
        >
          <template #label>
            Я соглашаюсь с <nuxt-link to="/">
              Политикой конфиденциальности
            </nuxt-link>
          </template>
        </esr-checkbox>
      </template>
      <esr-button
        class="login-complete__button"
        :disabled="!termsStatus && !errorPage"
        @click="onSubmit"
      >
        {{ errorPage ? "На страницу авторизации" : "Зарегистрироваться" }}
      </esr-button>
    </esr-card>
  </div>
</template>

<style lang="scss" scoped>
.login-complete {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--surface-neutral-neutral-light-s, #F8FAFC);

  &__card {
    padding: 56px 32px 32px;
    max-width: 500px;
    text-align: center;
    background-color: var(--surface-light);

    @include screen-tablet {
      max-width: 400px;
    }

    @include screen-mobile {
      max-width: 336px;
      padding: 32px 24px 24px;
    }
  }

  &__subtitle {
    color: var(--text-primary);

    @include text-sm;
  }

  &__title {
    color: var(--text-primary);
    margin-bottom: 16px;
    line-height: 32px;

    @include text-h5;

    @include screen-tablet {
      margin-bottom: 12px;
    }

    @include screen-mobile {
      margin-bottom: 8px;

      @include text-h6;
    }
  }

  &__description {
    color: var(--text-secondary);
    line-height: 24px;
    margin-bottom: 32px;

    @include screen-mobile {
      margin-bottom: 24px;

      @include text-sm;
    }
  }

  &__button {
    width: 100%;
    margin-top: 32px;

    @include screen-mobile {
      margin-top: 24px;
    }
  }
}
</style>
