<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { EsrButton } from "../../ui";
import AppLogo from "../app-logo.vue";
import { useBEMNamespace } from "~/composables/useBEMNamespace.ts";
import { useHeader } from "~/composables/useHeader.ts";
import AppHeaderNav from "~/components/app/header/app-header-nav.vue";
import { useUserStore } from "@/stores/useUserStore";

const { headerVariation, setHeaderVariation } = useHeader();

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();

const ns = useBEMNamespace("header");
const headerClasses = computed(() => [
  ns.block(),
  ns.modifier(headerVariation.value),
]);

const goToAccount = async () => {
  await router.push({ name: "account" });
};

watch(
  () => route.fullPath,
  () => {
    isMenuOpened.value = false;
  },
);

const isMenuOpened = ref<boolean>(false);

const logoVariation = computed(() => {
  if (headerVariation.value === "white") {
    return "default";
  }

  if (headerVariation.value === "transparent-black") {
    return "default";
  }

  if (headerVariation.value === "transparent-white") {
    return "white";
  }

  return "default";
});

const loginButtonVariation = computed(() => {
  if (headerVariation.value === "white") {
    return "secondary";
  }

  if (headerVariation.value === "transparent-black") {
    return "secondary";
  }

  if (headerVariation.value === "transparent-white") {
    return "light";
  }

  return "secondary";
});

const toggleMenu = () => {
  isMenuOpened.value = !isMenuOpened.value;

  if (isMenuOpened.value) {
    setHeaderVariation("white");
  }
};

const menuIcon = computed(() => {
  if (isMenuOpened.value) {
    return "mdi-close";
  }

  return "mdi-menu";
});
</script>

<template>
  <header
    :class="headerClasses"
  >
    <div class="header__wrapper">
      <div class="wrapper-first-row">
        <div class="header__logo">
          <app-logo :variation="logoVariation" />
        </div>
        <nav
          class="header__nav"
        >
          <app-header-nav
            class="desktop-nav"
            variation="horizontal"
          />
        </nav>

        <div class="header__buttons">
          <esr-button
            v-if="userStore.user"
            :color="loginButtonVariation"
            size="large"
            prefix-icon="mdi-account-outline"
            @click="goToAccount()"
          >
            <span class="header__buttons-wrapper">
              <span class="header__buttons-name">{{ userStore.user.company?.name }}</span>
              <span class="header__buttons-description">ИНН: {{ userStore.user.company?.inn }}</span>
            </span>
          </esr-button>

          <esr-button
            v-else
            :color="loginButtonVariation"
            size="large"
            prefix-icon="mdi-account-outline"
            @click="goToAccount()"
          >
            Войти
          </esr-button>

          <esr-button
            :color="loginButtonVariation"
            size="large"
            :prefix-icon="menuIcon"
            class="menu-button"
            @click="toggleMenu"
          />
        </div>
      </div>

      <div
        v-if="isMenuOpened"
        id="header__menu"
        class="header__menu"
      >
        <app-header-nav
          class="mobile-nav"
          variation="vertical"
        />
      </div>
    </div>
  </header>
</template>

<style lang="scss">
/* stylelint-disable-next-line scss/at-import-partial-extension */
@import "assets/styles/typography";

.header {
  padding: 16px;
  position: fixed;
  width: 100%;
  z-index: 9999;
  top: 0;

  @include screen-tablet {
    padding: 16px 24px;
  }

  @include screen-mobile {
    padding: 12px
  }

  &__nav {
    .desktop-nav {
      @include screen-tablet {
        display: none;
      }
    }
  }

  &__wrapper {
    box-shadow: 0 4px 24px 0 rgba(5, 25, 69, 0.08);
    background: var(--surface-light, #201f1f);
    padding: 16px 16px 16px 32px;
    border-radius: var(--corner-radius-surface-small, 8px);
    z-index: 1000;
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    transition: all 0.2s ease-in-out;

    @include screen-tablet {
      padding: 16px 16px 16px 24px;
      gap: 12px;
    }

    @include screen-mobile {
      padding: 8px 8px 8px 16px;
      gap: 8px;
    }

    .wrapper-first-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__logo {
    width: 96px;
    height: 48px;
    display: flex;
    align-items: center;

    @include screen-mobile {
      width: 80px;
      height: 40px;
    }
  }

  &--transparent-white {
    .header__wrapper {
      background: transparent;
      box-shadow: none;
    }

    .app-header-nav__item {
      a {
        color: var(--text-primary-inverted, #FFF);
      }
    }
  }

  &--transparent-black {
    .header__wrapper {
      background: transparent;
      box-shadow: none;
    }

    .app-header-nav__item {
      a {
        color: var(--text-primary, #051945);
      }
    }

  }

  &--white {
    background: transparent;

    .app-header-nav__item {
      a {
        color: var(--text-primary, #051945);
      }
    }
  }

  &__buttons {
    display: flex;
    gap: 16px;

    @include screen-tablet {
      gap: 8px;
    }

    .menu-button {
      display: none;

      @include screen-tablet {
        display: flex;
      }
    }

    &-account {
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;

      &:hover {
        .header__buttons-icon {
          background: var(--surface-accent-accent-light-s, #F6F8FB);
        }

        .header__buttons-name {
          color: var(--text-accent, #051945);
        }
      }
    }

    &-text {
      @include screen-tablet {
        margin-left: -60px;
        display: none;
      }
    }

    &-icon {
      color: var(--icon-accent, #14509f);
      height: 48px;
      padding: 12px;
      border-radius: var(--corner-radius-surface-x-small, 4px);
      background: var(--surface-accent-accent-light-m, #F6F8FB);
    }

    &-wrapper {
      display: flex;
      flex-direction: column;
      text-align: left;

      @include screen-tablet {
        display: none;
      }
    }

    &-name {
      color: var(--text-primary, #051945);
      font-weight: 500;
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      @include text-sm;
    }

    &-description {
      color: var(--text-secondary, #7C879F);

      @include text-xs;
    }
  }

}

</style>
