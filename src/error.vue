<!-- eslint-disable vue/multi-word-component-names -->
<script lang="ts" setup>
import { EsrButton, EsrIcon } from "./components/ui";
</script>

<template>
  <NuxtLayout name="default">
    <div class="error-page">
      <div class="error-page__wrapper">
        <esr-icon
          class="error-page__icon"
          icon="mdi-alert-rhombus"
        />
        <h4 class="error-page__title">
          Страница не найдена или не существует...
        </h4>
        <p class="error-page__description">
          Что-то пошло не так, возвращайтесь на главную страницу или напишите нам на почту <a href="mailto:info@ozzcar11-rating.ru">info@ozzcar11-rating.ru</a>
        </p>
        <esr-button
          to="/"
          color="light"
        >
          На главную страницу
        </esr-button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  background: var(--surface-accent-accent-light-s, #F6F8FB);

  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__icon {
    color: var(--surface-accent-light-xl);
    width: 256px;
    height: 256px;
    margin-bottom: 40px;

    @include screen-tablet {
      width: 200px;
      height: 200px;
      margin-bottom: 32px;
    }

    @include screen-mobile {
      width: 156px;
      height: 156px;
      margin-bottom: 32px;
    }
  }

  &__title {
    color: var(--text-primary);
    line-height: 40px;
    margin-bottom: 24px;

    @include screen-tablet {
      @include text-h5;

      margin-bottom: 16px;
    }

    @include screen-mobile {
      @include text-h6;

      line-height: 32px;
      max-width: 250px;
      margin-bottom: 12px;
    }
  }

  &__description {
    color: var(--text-secondary);
    margin-bottom: 40px;
    line-height: 24px;

    @include screen-tablet {
      @include text-sm;

      max-width: 390px;
      margin-bottom: 32px;
    }

    @include screen-mobile {
      max-width: 260px;
    }
  }
}
</style>
