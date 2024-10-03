<script lang="ts" setup>
import { ref } from "vue";
import AuthForm from "@/modules/auth/components/auth-form.vue";
import { EsrButton } from "@/components/ui/button";
import { authLoginInn } from "@/router/auth";
import { useEsiaStart } from "@/modules/auth/composables/useEsiaStart";

const showRouteButton = ref(false);

const { startEsia, loading } = useEsiaStart();

async function login() {
  const res = await startEsia();
  if (!res?.data?.esiaStart) return;

  window.location.href = res.data.esiaStart;
}
</script>

<template>
  <div class="login">
    <auth-form
      :disabled="loading"
      title="Вход в личный кабинет компании"
      button-name="Войти через ЕСИА"
      @submit="login"
    >
      <template #footer>
        <div class="login-footer">
          <p class="login-footer__description">
            По вопросам входа в личный кабинет обращайтесь на почту <a href="mailto:ozzcar11@mail.ru">ozzcar11@mail.ru</a>
          </p>
        </div>
      </template>
    </auth-form>
    <div class="route">
      <esr-button
        v-if="showRouteButton"
        :to="authLoginInn"
        color="light"
      >
        Вход с помощью инн и пароля
      </esr-button>
      <esr-button
        class="route__button"
        prefix-icon="mdi-login-variant"
        color="light"
        @click="showRouteButton = !showRouteButton"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--surface-neutral-neutral-light-s, #F8FAFC);

  &-footer {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 32px;
    text-align: center;

    &__description {
      font-size: 14px;
      color: var(--text-secondary);
      max-width: 300px;

      @include text-sm;
    }
  }
}

.route {
  position: absolute;
  bottom: 56px;
  left: 56px;
  display: flex;
  flex-direction: column;

  @include screen-tablet {
    left: 24px;
    bottom: 24px;
  }

  @include screen-mobile {
    left: 12px;
    bottom: 12px;
  }

  &__button {
    width: 48px;
    height: 48px;
    margin-top: 8px;
    padding: 4px 12px;
  }
}
</style>
