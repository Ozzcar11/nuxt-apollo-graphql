<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import anime from "animejs/lib/anime.es.js";
import { useDeviceBySize } from "~/composables/useDevice";

const emit = defineEmits<{
  (e: "exit", to: "up" | "down"): void;
  (e: "enter"): void;
}>();

defineExpose({
  intro,
});

const { isDesktop, isSmallHeightScreen } = useDeviceBySize();

function intro() {
  // Не показываем на мобильных устройствах
  if (!isDesktop.value) {
    return false;
  }

  emit("enter");

  const targets = document.querySelectorAll(".third-section__wrapper");
  anime({
    targets,
    easing: "linear",
    delay: 600,
    duration: 600,
    keyframes: [
      { opacity: ["0", "1"] },
    ],
  });

  const section: HTMLElement | null = document.querySelector(".third-section");

  if (section) {
    setTimeout(() => {
      addEventListener("wheel", wheelListener, { passive: false });
      addEventListener("keydown", keyboardListener);
    }, 300);
  }
}

const itemImageInAnimation = (image: HTMLElement) => {
  anime({
    targets: image,
    easing: "linear",
    duration: 400,
    keyframes: [
      { top: "0" },
    ],
  });
};

const itemImageOutAnimation = (image: HTMLElement) => {
  anime({
    targets: image,
    easing: "linear",
    duration: 400,
    keyframes: [
      { top: "100%" },
    ],
  });
};

const itemInAnimation = (item: HTMLElement) => {
  nextStepAvailable.value = false;

  anime({
    targets: item.querySelectorAll(".item-number__badge"),
    easing: "linear",
    duration: 400,
    keyframes: [
      { scale: "1.57" },
    ],
  });

  anime({
    targets: item.querySelectorAll(".item-text p"),
    easing: "linear",
    duration: 400,
    keyframes: [
      { translateY: "5px" },
    ],
  });

  anime({
    targets: item.querySelectorAll(".item-text h5"),
    easing: "linear",
    duration: 400,
    keyframes: [
      { scale: "1.4", translateY: "-5px" },
    ],
    complete() {
      nextStepAvailable.value = true;
    },
  });
};

const itemOutAnimation = (item: HTMLElement) => {
  anime({
    targets: item.querySelectorAll(".item-number__badge"),
    easing: "linear",
    duration: 400,
    keyframes: [
      { scale: "1" },
    ],
  });

  anime({
    targets: item.querySelectorAll(".item-text p"),
    easing: "linear",
    duration: 400,
    keyframes: [
      { translateY: "0" },
    ],
  });

  anime({
    targets: item.querySelectorAll(".item-text h5"),
    easing: "linear",
    duration: 400,
    keyframes: [
      { scale: "1", translateY: "0" },
    ],
  });
};

const wheelListener = (e: WheelEvent) => {
  e.preventDefault();

  if (!isDesktop.value) {
    return;
  }

  if (e.deltaY > 0) {
    changeBlock("down");
  } else {
    changeBlock("up");
  }
};

const keyboardListener = (e: KeyboardEvent) => {
  if (e.code === "ArrowUp") {
    changeBlock("up");
  } else if (e.code === "ArrowDown") {
    changeBlock("down");
  }
};

const changeBlock = (direction: "up" | "down") => {
  if (nextStepAvailable.value) {
    const items: NodeListOf<HTMLElement> = document.querySelectorAll(".third-section .content__list-item");
    const images: NodeListOf<HTMLElement> = document.querySelectorAll(".third-section .content__images img");

    if (direction === "down") {
      if (itemAnimatedIdx.value < items.length) {
        itemAnimatedIdx.value++;
      }

      if (itemAnimatedIdx.value >= items.length) {
        const section: HTMLElement | null = document.querySelector(".third-section");

        if (section) {
          removeEventListener("wheel", wheelListener);
          removeEventListener("keydown", keyboardListener);
        }

        emit("exit", "down");

        return;
      }

      if (items[itemAnimatedIdx.value - 1]) {
        itemOutAnimation(items[itemAnimatedIdx.value - 1]);
      }
      if (items[itemAnimatedIdx.value]) {
        itemInAnimation(items[itemAnimatedIdx.value]);
        itemImageInAnimation(images[itemAnimatedIdx.value]);
      }
    } else {
      if (itemAnimatedIdx.value > -1) {
        itemAnimatedIdx.value--;
      }

      if (itemAnimatedIdx.value < 0) {
        const section: HTMLElement | null = document.querySelector(".third-section");

        if (section) {
          removeEventListener("wheel", wheelListener);
          removeEventListener("keydown", keyboardListener);
        }

        emit("exit", "up");

        return;
      }

      if (items[itemAnimatedIdx.value + 1]) {
        itemOutAnimation(items[itemAnimatedIdx.value + 1]);
        itemImageOutAnimation(images[itemAnimatedIdx.value + 1]);
      }

      if (items[itemAnimatedIdx.value]) {
        itemInAnimation(items[itemAnimatedIdx.value]);
        itemImageInAnimation(images[itemAnimatedIdx.value]);
      }
    }
  }
};

const itemAnimatedIdx = ref<number>(0);
const nextStepAvailable = ref<boolean>(false);

onMounted(() => {
  if (!isDesktop.value) {
    return;
  }

  const items: NodeListOf<HTMLElement> = document.querySelectorAll(".third-section .content__list-item");
  const images: NodeListOf<HTMLElement> = document.querySelectorAll(".third-section .content__images img");
  if (items.length) {
    itemInAnimation(items[0]);
    itemImageInAnimation(images[0]);
  }
});

onBeforeUnmount(() => {
  removeEventListener("wheel", wheelListener);
  removeEventListener("keydown", keyboardListener);
});

const clickHandler = (idx: number = 0) => {
  if (isDesktop.value && !isSmallHeightScreen.value) {
    return;
  }

  const items: NodeListOf<HTMLElement> = document.querySelectorAll(".third-section .content__list-item");
  const images: NodeListOf<HTMLElement> = document.querySelectorAll(".third-section .content__images img");

  if (items.length && items[idx] && images.length && images[idx]) {
    for (let i = 0; i < items.length; i++) {
      if (i === idx) {
        itemInAnimation(items[i]);
        itemImageInAnimation(images[i]);
      } else {
        itemOutAnimation(items[i]);

        if (i > 0) {
          itemImageOutAnimation(images[i]);
        }
      }
    }
  }
};

</script>

<template>
  <section class="third-section">
    <div class="third-section__wrapper">
      <div class="third-section__title">
        <h2>О рейтинге</h2>
        <p class="p1-regular">
          ЭКГ-рейтинг – это комплексная оценка «здоровья» компаний, направленная на определение уровня их благонадёжности, социальной и экологической ответственности.
        </p>
      </div>

      <div class="third-section__content">
        <div class="content">
          <div class="content__list">
            <div
              class="content__list-item"
              @click="clickHandler(0)"
            >
              <div class="item-number">
                <div class="item-number__badge">
                  1
                </div>
                <div class="item-number__line" />
              </div>
              <div class="item-text">
                <h5>Экология</h5>
                <p class="p1-regular">
                  Степень воздействия на окружающую среду, использование наилучших доступных технологий и реализация
                  экологических проектов.
                </p>
              </div>
            </div>

            <div
              class="content__list-item"
              @click="clickHandler(1)"
            >
              <div class="item-number">
                <div class="item-number__badge item-number__badge--blue">
                  2
                </div>
                <div class="item-number__line" />
              </div>
              <div class="item-text">
                <h5>Кадры</h5>
                <p class="p1-regular">
                  Уровень оплаты труда, собственные социальные и демографические программы, благотворительные проекты.
                </p>
              </div>
            </div>

            <div
              class="content__list-item"
              @click="clickHandler(2)"
            >
              <div class="item-number">
                <div class="item-number__badge item-number__badge--red">
                  3
                </div>
              </div>
              <div class="item-text">
                <h5>Государство</h5>
                <p class="p1-regular">
                  Налоговая история, деловая репутация, социальное инвестирование в регионах присутствия, взаимодействие
                  с бизнес-объединениями.
                </p>
              </div>
            </div>
          </div>
          <div class="content__images">
            <img src="/images/pages/main/s3_1.png">
            <img src="/images/pages/main/s3_22.jpg">
            <img src="/images/pages/main/s3_3.png">
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.third-section {
  display: flex;
  flex-direction: column;
  gap: 80px;
  background: #fff;

  @include screen-desktop-xs {
    padding: 120px 56px 120px;
  }

  @include screen-tablet {
    padding: 40px 40px 80px;
    gap: 40px;
  }

  @include screen-mobile {
    padding: 20px 16px 40px;
    gap: 24px;
  }

  &__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  &__title {
    width: 100%;
    max-width: 1440px;

    h2 {
      color: var(--text-primary, #051342);
      text-align: center;
    }

    p {
      text-align: center;
      padding-top: 24px;

      @include screen-tablet {
        padding-top: 16px;
        max-width: 640px;
        margin: 0 auto;
      }

      @include screen-mobile {
        padding-top: 12px;
        font-size: 14px;
      }
    }
  }

  &__content {
    display: flex;
    padding: 80px 0 0;
    flex-direction: column;
    gap: 80px;
    align-items: center;
    justify-content: center;

    @include screen-tablet {
      padding: 40px 0 0;
      gap: 40px;

    }

    @include screen-mobile {
      padding: 24px 0 0;
      gap: 24px;

    }
  }

  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    width: 100%;
    max-width: 1440px;

    @include screen-tablet {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    &__list {
      padding: 16px 0;

      @include screen-tablet {
        padding: 0;
      }
    }

    &__list-item {
      display: flex;
      gap: 32px;
      margin-bottom: 24px;

      &:last-child {
        margin-bottom: 0;
      }

      @include screen-desktop-xs {
        cursor: pointer;
      }

      @include screen-mobile {
        gap: 16px;
        margin-bottom: 16px;
      }

      .item-number {
        display: flex;
        flex-direction: column;
        gap: 24px;

        @include screen-tablet {
          gap: 20px;
        }

        &__badge {
          border-radius: var(--corner-radius-surface-small, 8px);
          border: 1.5px solid var(--stroke-secondary, #D8DDE5);
          display: flex;
          width: 32px;
          height: 32px;
          justify-content: center;
          align-items: center;
          color: var(--text-primary, #051945);
          font-size: 20px;
          font-style: normal;
          font-weight: 600;
          line-height: 32px;

          @include screen-mobile {
            width: 32px;
            font-size: 14px;
            line-height: 24px;
            padding: 4px 0;
          }

          &--blue {
            background: var(--surface-accent-accent, #14509F);
            border-radius: var(--corner-radius-surface-x-small, 4px);
            color: var(--text-primary-inverted, #FFF);
            border-color: transparent;
          }

          &--red {
            background: var(--service-error-error, #E3000F);
            border-radius: var(--corner-radius-surface-x-small, 4px);
            color: var(--text-primary-inverted, #FFF);
            border-color: transparent;
          }
        }

        &__line {
          display: flex;
          justify-content: center;
          height: 100%;
          min-height: 96px;

          &::after {
            content: "";
            display: block;
            background: var(--stroke-secondary, #D8DDE5);
            width: 1.5px;
            height: 100%;
          }

          @include screen-tablet {
            min-height: 48px;
          }

        }
      }

      .item-text {
        h5 {
          transform-origin: 0 0;
        }

        p {
          padding-top: 12px;
          color: var(--text-primary, #051342);

          @include screen-tablet {
            padding-top: 8px;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
          }

          @include screen-mobile {
            padding-top: 4px;
            font-size: 14px;
          }
        }

      }
    }

    &__images {
      position: relative;
      overflow: hidden;
      border-radius: var(--corner-radius-surface-small, 8px);

      @include screen-tablet {
        order: -1;
        height: 300px;
      }

      @include screen-mobile {
        order: -1;
        height: 200px;
      }

      img {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 100%;

        &:first-child {
          top: 0;
        }

      }

    }
  }
}
</style>
