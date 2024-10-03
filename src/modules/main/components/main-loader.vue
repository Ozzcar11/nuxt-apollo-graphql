<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import anime from "animejs/lib/anime.es.js";
import { useSafeOnMounted } from "~/composables/useSafeMounted";
import AppLogo from "@/components/app/app-logo.vue";

const emit = defineEmits(["introCompleted"]);

const show = ref<boolean>(true);
const container = ref<HTMLElement | null>(null);

useSafeOnMounted(container, () => {
  anime({
    targets: ".loader__logo",
    easing: "linear",
    duration: 3000,
    keyframes: [
      { translateX: ["100%", "0%"] },
      { delay: 1000 },
      { translateX: ["0%", "100%"] },
    ],
  });

  anime({
    targets: ".loader__title",
    easing: "linear",
    duration: 3000,
    keyframes: [
      { translateX: ["-100%", "0%"] },
      { delay: 1000 },
      { translateX: ["0%", "-100%"] },
    ],
    complete() {
      anime({
        targets: ".loader__wrapper",
        easing: "linear",
        duration: 2000,
        keyframes: [
          { gridTemplateColumns: "1fr 41.67%" },
          { opacity: 0 },
        ],
        complete: function() {
          show.value = false;

          emit("introCompleted");
        },

      });
    },
  });
});

onBeforeUnmount(() => {
  anime.remove(".loader__logo");
  anime.remove(".loader__title");
  anime.remove(".loader__wrapper");
});

</script>

<template>
  <div
    v-if="show"
    id="loader"
    ref="container"
    class="loader"
  >
    <section>
      <div
        class="loader__wrapper"
        style="grid-template-columns: 1fr 61.09%;"
      >
        <div class="loader__left">
          <div class="loader__logo">
            <app-logo variation="white" />
          </div>
        </div>
        <div class="loader__right">
          <div class="loader__title">
            <img
              src="/images/logo-title.svg"
              alt="Рейтинг Ответственного Бизнеса"
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.loader {
  position: absolute;
  z-index: 10000;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;

  &__wrapper {
    width: 100%;
    height: 100vh;
    display: grid;

    // grid-template-columns: 1fr 41.67%;
    grid-template-columns: 1fr 61.09%;
  }

  &__left {
    background: #051945;
    display: flex;
    justify-content: right;
    align-items: center;
    overflow: hidden;
  }

  &__right {
    background: #0E52A2;
    display: flex;
    justify-content: left;
    align-items: center;
    overflow: hidden;
  }

  &__logo {
    transform: translateX(100%);
    width: 275px;
    height: 98px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__title {
    transform: translateX(-100%);
  }
}

</style>
