<script setup lang="ts">
import { computed } from "vue";
import { useBEMNamespace } from "~/composables/useBEMNamespace.ts";

interface Props {
  variation: "vertical" | "horizontal";
}

const props = withDefaults(defineProps<Props>(), {
  variation: "horizontal",
});

const ns = useBEMNamespace("app-header-nav");
const classes = computed(() => [
  ns.block(),
  ns.modifier(props.variation),
]);

</script>

<template>
  <ul
    :class="classes"
  >
    <li class="app-header-nav__item">
      <router-link :to="{ name: 'main', hash: '#rating' }">
        Рейтинг
      </router-link>
    </li>
    <li class="app-header-nav__item">
      <router-link :to="{ name: 'main', hash: '#about-rating'}">
        О рейтинге
      </router-link>
    </li>
    <li class="app-header-nav__item">
      <router-link :to="{ name: 'main', hash: '#rating-stages'}">
        Этапы
      </router-link>
    </li>
    <li class="app-header-nav__item">
      <router-link :to="{ name: 'main', hash: '#rating-system'}">
        Система оценки
      </router-link>
    </li>
    <li class="app-header-nav__item">
      <router-link :to="{ name: 'main', hash: '#methodology'}">
        Нормативные акты
      </router-link>
    </li>
    <li class="app-header-nav__item">
      <a
        href="https://rutube.ru/channel/28022562/"
        target="_blank"
      >
        Медиа
      </a>
    </li>
  </ul>
</template>

<style scoped lang="scss">
/* stylelint-disable-next-line scss/at-import-partial-extension */
@import "assets/styles/typography";

.app-header-nav {
  display: flex;
  gap: 56px;

  &__item {
    @include p2-regular;

    text-align: center;
  }

  &--vertical {
    flex-flow: column;
    gap: 0;

    .app-header-nav__item {
      color: var(--text-primary, #051945);
      text-align: left;
      border-top: 1px solid var(--stroke-accent-accent-light-s, #D9E3F0);
      padding: 12px;

      @include screen-mobile {
        padding: 8px;

      }
    }
  }
}
</style>
