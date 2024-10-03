<script lang="ts" setup>
import anime from "animejs/lib/anime.es.js";
import { onMounted } from "vue";
import { type RouteLocationRaw, useRouter } from "vue-router";
import { EsrButton } from "~/components/ui";
import MainLoader from "~/modules/main/components/main-loader.vue";
import { useDeviceBySize } from "~/composables/useDevice";

const router = useRouter();

const { isDesktop } = useDeviceBySize();

const props = defineProps<{ alreadyScrolled: boolean }>();

function intro() {
  // Не показываем на мобильных устройствах
  if (!isDesktop.value) {
    return false;
  }

  let targetClasses = ".first-section .info";

  if (!props.alreadyScrolled) {
    targetClasses += ", .header__wrapper";
  }

  const targets = document.querySelectorAll(targetClasses);
  anime({
    targets,
    easing: "linear",
    delay: 600,
    duration: 600,
    keyframes: [
      { opacity: ["0", "1"] },
    ],
  });
}

defineExpose({
  intro,
});

onMounted(() => {
  if (isDesktop.value) {
    const shape: HTMLElement | null = document.querySelector(".shape");
    window.addEventListener("mousemove", function(e) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (shape) {
        shape.style.transform = "translate(-" + x * 50 + "px, -" + y * 50 + "px)";
      }
    });

    const headerWrapper: HTMLElement | null = document.querySelector(".header__wrapper");

    if (headerWrapper) {
      headerWrapper.style.opacity = "0";
    }

    const infoBlock: HTMLElement | null = document.querySelector(".first-section .info");

    if (infoBlock) {
      infoBlock.style.opacity = "0";
    }
  }
});

const goTo = (to: RouteLocationRaw) => {
  void router.push(to);
};
</script>

<template>
  <section class="first-section">
    <main-loader
      v-if="isDesktop"
      @intro-completed="intro"
    />

    <div class="first-section__left">
      <div class="shape" />

      <div class="info">
        <div class="info__main">
          <h1>ЭКГ</h1>
          <p>рейтинг <br>ответственного <br>бизнеса</p>
        </div>

        <div class="info__secondary">
          <blockquote>
            «Важно, когда бизнес, компании на деле, конкретными решениями демонстрируют ответственность за страну, за регион, за город, в которо они работают, за специалистов в их коллективах, реализуют проекты в социальной сфере, в области защиты окружающей среды»
          </blockquote>
          <p>Президент России <br> В.В. Путин</p>
        </div>

        <div
          class="info__button"
        >
          <esr-button
            size="large"
            color="light"
            :to="{ name: 'main', hash: '#rating'}"
          >
            Ознакомиться с рейтингом
          </esr-button>
        </div>
      </div>
    </div>
    <div
      class="first-section__right"
    >
      <div
        class="cover-primary"
        @click="goTo({ name: 'main', hash: '#about-rating'})"
      >
        <div
          class="caption"
        >
          <h2>7 млн</h2>
          <p class="caption__subtitle p2-regular">
            участников рейтинга
          </p>
        </div>
      </div>

      <div
        class="cover-secondary"
        @click="goTo({ name: 'main', hash: '#rating-stages'})"
      >
        <div
          class="caption"
        >
          <h2>47</h2>
          <p class="caption__subtitle p2-regular">
            показателей в методике
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.first-section {
  background: var(--surface-dark-accent, #051945);
  display: grid;
  grid-template-columns: 1fr 41.67%;
  overflow: hidden;
  position: relative;
  grid-auto-rows: auto;

  @include screen-tablet {
    grid-template-columns: 1fr;
  }

  &__left {
    display: flex;

    @include screen-tablet {
      order: 2;
    }

    .shape {
      fill: var(--gradient-accent, linear-gradient(181deg, rgba(105, 147, 255, 0.24) -12.57%, rgba(5, 25, 69, 0.24) 55.33%));
      background: url("/images/pages/main/shape.svg") no-repeat;
      position: absolute;
      width: 1174px;
      height: 1340px;
      flex-shrink: 0;
      bottom: -524px;
      left: -365px;
      background-size: contain;
      transition: all 0.1s ease;

      @include screen-tablet {
        display: none;
      }
    }

    .info {
      z-index: 1000;
      align-self: flex-end;
      padding-left: 56px;
      padding-bottom: 80px;
      padding-right: 128px;

      @include screen-tablet {
        width: 100%;
        padding: 48px 40px;
        background: url("/images/pages/main/s1_shape2.svg") no-repeat;
        background-size: contain;
      }

      @include screen-mobile {
        background: url("/images/pages/main/s1_shape.svg") no-repeat;
        background-size: cover;
      }

      @include screen-mobile {
        padding: 32px 16px;
      }

      &__main {
        display: flex;
        gap: 32px;

        @include screen-small-height {
          gap: 12px;
        }

        @include screen-mobile {
          gap: 16px;
        }

        h1 {
          font-size: 132px;
          font-style: normal;
          font-weight: 700;
          line-height: 132px;
          margin-bottom: 0;

          @include screen-small-height {
            font-size: 72px;
            line-height: 83px;
          }

          @include screen-mobile {
            font-size: 72px;
            font-style: normal;
            font-weight: 700;
            line-height: 72px;
          }
        }

        p {
          padding: 6px 0;
          font-size: 32px;
          font-style: normal;
          font-weight: 700;
          line-height: 40px;
          color: var(--text-primary-inverted, #FFF);

          @include screen-small-height {
            font-size: 16px;
            line-height: 24px;
          }

          @include screen-mobile {
            padding: 0;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: 24px;
          }
        }
      }

      &__secondary {
        padding-top: 32px;

        @include screen-small-height {
          padding-top: 16px;
        }

        @include screen-tablet {
          padding-top: 24px;
        }

        @include screen-mobile {
          padding-top: 16px;
        }

        blockquote {
          color: var(--text-primary-inverted, #FFF);
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;
        }

        p {
          padding-top: 8px;
          color: var(--text-primary-inverted, #FFF);
          text-align: right;
          font-size: 16px;
          font-style: normal;
          font-weight: 500;
          line-height: 24px;

          @include screen-mobile {
            padding-top: 16px;
          }
        }

      }

      &__button {
        padding-top: 32px;

        @include screen-small-height {
          padding-top: 16px;
        }

        @include screen-tablet {
          padding-top: 24px;
        }

        @include screen-mobile {
          padding-top: 16px;

          .esr-button {
            width: 100%;
          }
        }

      }
    }
  }

  &__right {
    position: relative;

    @include screen-tablet {
      height: 512px;
      order: 1
    }

    .cover-primary {
      background: url("/images/pages/main/s1_right_1.jpg");
      background-size: 100% 100%;
      width: 100%;
      height: 100%;

      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--gradient-dark, linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.72) 100%));
      }

      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--surface-dark-accent, #051945);
        mix-blend-mode: color;
      }

      &:hover {
        &::before {
          background: transparent;
        }

        &::after {
          background: transparent;
        }
      }
    }

    .caption {
      position: absolute;
      bottom: 80px;
      left: 32px;

      h2 {
        @include screen-tablet {
          font-size: 48px;
        }

        @include screen-mobile {
          font-size: 32px;
        }
      }

      @include screen-tablet {
        bottom: 40px;
        left: 40px;
      }

      @include screen-mobile {
        bottom: 16px;
        left: 16px;
      }

      &__subtitle {
        color: var(--text-primary-inverted, #FFF);
      }

      @include screen-mobile{
        min-height: 90px;
      }
    }

    .cover-secondary {
      background: url("/images/pages/main/s1_right_2.jpg") lightgray no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 50%;
      width: 50%;
      height: 75%;
      top: 25%;
      z-index: 1000;

      @include screen-tablet {
        top: 0;
        height: 100%;
      }

      &::before {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--gradient-dark, linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.72) 100%));
      }

      &::after {
        content: "";
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--surface-accent-light-xxl, #B4C7E0);
        mix-blend-mode: color;
      }

      &:hover {
        &::before {
          background: transparent;
        }

        &::after {
          background: transparent;
        }
      }

    }
  }
}

</style>
