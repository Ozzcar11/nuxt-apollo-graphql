<script lang="ts" setup>
import { ref } from "vue";
import { EsrIcon } from "@/components/ui";

const isOpen = ref<boolean>(false);
</script>

<template>
  <nav
    class="main-nav"
    :class="{ 'main-nav--open': isOpen }"
    @click="isOpen = !isOpen"
  >
    <ul class="main-nav__list">
      <li
        class="main-nav__item"
      >
        <router-link
          to="/account"
          @click.stop
        >
          <esr-icon icon="mdi-account-multiple" /><span class="main-nav__label">Моя компания</span>
        </router-link>
      </li>
      <li
        class="main-nav__item"
      >
        <router-link
          to="/application"
          @click.stop
        >
          <esr-icon icon="mdi-file-document-check-outline" /><span class="main-nav__label">Участие в анкетировании</span>
        </router-link>
      </li>
      <li
        class="main-nav__item"
      >
        <router-link
          to="/results"
          @click.stop
        >
          <esr-icon
            icon="mdi-file-star-outline"
          /><span class="main-nav__label">Результаты проверки</span>
        </router-link>
      </li>
      <li
        class="main-nav__item"
      >
        <router-link
          to="/partners"
          @click.stop
        >
          <esr-icon
            icon="mdi-account-multiple-outline"
          /><span class="main-nav__label">Предложения от партнеров</span>
        </router-link>
      </li>
      <div class="main-nav__caret">
        <esr-icon icon="mdi-chevron-down" />
      </div>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.main-nav {
  padding-top: 112px;

  @include screen-mobile {
    padding-top: 80px;
  }

  &__list {
    position: relative;
    display: flex;
    border-radius: var(--corner-radius-surface-small, 8px);
    background: var(--surface-dark-blue, #051945);
    padding: 16px 24px;
    margin: 0 16px 40px;
    font-weight: 400;
    transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);

    @include horizontal-scroll;

    @include screen-tablet {
      margin-bottom: 32px;
    }

    @include screen-mobile {
      flex-direction: column;
      margin-bottom: 24px;
      padding: 12px 16px;
      max-height: 48px;
    }
  }

  &--open {
    @include screen-mobile {
      .main-nav__caret {
        transform: rotate(180deg);
        top: 4px;
      }

      .main-nav__list {
        max-height: 300px;
      }
    }
  }

  &__label {
    margin-left: 12px;

    @include text-sm;
  }

  &__item {
    display: flex;

    a {
      display: inline-flex;
      align-items: center;
      color: var(--text-secondary-inverted);
      white-space: nowrap;
    }

    & + & {
      margin-left: 24px;
    }

    @include screen-mobile {
      & + & {
        margin-left: 0;
        margin-top: 16px;
      }
    }
  }

  &__caret {
    display: none;
    color: var(--icon-primary-inverted);
    position: absolute;
    top: 12px;
    right: 12px;

    @include screen-mobile {
      display: block;
    }
  }
}

.router-link-active {
  color: var(--text-primary-inverted) !important;
}
</style>
