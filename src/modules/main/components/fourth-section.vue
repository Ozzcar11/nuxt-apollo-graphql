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

const { isDesktop, isSmallHeightScreen, isDesktopXs } = useDeviceBySize();

function intro() {
  // Не показываем на мобильных устройствах
  if (!isDesktop.value) {
    return false;
  }

  emit("enter");

  const targets = document.querySelectorAll(".fourth-section__wrapper");
  anime({
    targets,
    easing: "linear",
    delay: 600,
    duration: 600,
    keyframes: [
      { opacity: ["0", "1"] },
    ],
  });

  const section: HTMLElement | null = document.querySelector(".fourth-section");

  if (section) {
    setTimeout(() => {
      addEventListener("wheel", wheelListener, { passive: false });
      addEventListener("keydown", keyboardListener);
    }, 300);
  }
}

const animateBlocks = (toFrontIdx: number = 0) => {
  nextStepAvailable.value = false;

  const items: NodeListOf<HTMLElement> = document.querySelectorAll(".fourth-section .content__list .item");

  const shift = 336;

  for (let i = 0; i < items.length; i++) {
    items[i].style.left = `${i * shift}px`;
  }
  const map = [];
  const length = items.length;

  let iter = 0;

  // левая сторона + показываемый блок
  for (let i = toFrontIdx; i >= 0; i--) {
    map.push({
      item: items[i],
      class: i === toFrontIdx ? "" : iter > 1 ? "item--third" : "item--secondary",
      translateZ: `${-iter}px`,
    });

    iter++;
  }

  // правая сторона
  iter = 1;
  for (let i = toFrontIdx + 1; i < length; i++) {
    map.push({
      item: items[i],
      class: iter <= 1 ? "item--secondary" : "item--third",
      translateZ: `${-iter}px`,
    });

    iter++;
  }

  for (let i = 0; i < map.length; i++) {
    map[i].item.style.transform = "translateZ(0)";
    map[i].item.classList.remove("item--secondary", "item--third");

    if (map[i].class.length > 0) {
      map[i].item.classList.add(map[i].class);
      map[i].item.style.transform = `translateZ(${map[i].translateZ})`;
    }
  }

  setTimeout(() => {
    nextStepAvailable.value = true;
  }, 300);
};

const keyboardListener = (e: KeyboardEvent) => {
  if (e.code === "ArrowUp") {
    changeBlock("up");
  } else if (e.code === "ArrowDown") {
    changeBlock("down");
  }
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

const changeBlock = (direction: "up" | "down") => {
  if (nextStepAvailable.value) {
    const items: NodeListOf<HTMLElement> = document.querySelectorAll(".fourth-section .content__list .item");

    if (direction === "down") {
      if (itemAnimatedIdx.value < items.length) {
        itemAnimatedIdx.value++;
      }

      if (itemAnimatedIdx.value >= items.length) {
        const section: HTMLElement | null = document.querySelector(".fourth-section");

        if (section) {
          removeEventListener("wheel", wheelListener);
          removeEventListener("keydown", keyboardListener);
        }

        emit("exit", "down");

        return;
      }

      if (items[itemAnimatedIdx.value]) {
        animateBlocks(itemAnimatedIdx.value);
      }
    } else {
      if (itemAnimatedIdx.value > -1) {
        itemAnimatedIdx.value--;
      }

      if (itemAnimatedIdx.value < 0) {
        const section: HTMLElement | null = document.querySelector(".fourth-section");

        if (section) {
          removeEventListener("wheel", wheelListener);
          removeEventListener("keydown", keyboardListener);
        }

        emit("exit", "up");

        return;
      }

      if (items[itemAnimatedIdx.value]) {
        animateBlocks(itemAnimatedIdx.value);
      }
    }
  }
};
const itemAnimatedIdx = ref<number>(0);
const nextStepAvailable = ref<boolean>(false);

onMounted(() => {
  if (!isDesktop.value || isSmallHeightScreen.value) {
    return;
  }

  const items: NodeListOf<HTMLElement> = document.querySelectorAll(".fourth-section .content__list .item");
  if (items.length) {
    animateBlocks();
  }
});

onBeforeUnmount(() => {
  removeEventListener("wheel", wheelListener);
  removeEventListener("keydown", keyboardListener);
});

</script>

<template>
  <section class="fourth-section">
    <div class="fourth-section__wrapper">
      <div class="fourth-section__title">
        <h2>Этапы рейтинга</h2>
        <p class="p1-regular">
          Оценка осуществляется на основе баллов и проводится в два этапа: скоринг и анкетирование. <br> Анкетирование
          проводится в <router-link :to="{ name: 'account'}">
            личном кабинете
          </router-link> участника рейтинга. <br>
          <a
            target="_blank"
            href="/docs/01.%20Национальный%20стандарт%20Индекс%20деловой%20репутации%20субъектов%20предпринимательской%20деятельности%20(ЭКГ-%20рейтинг).Методика%20оценки%20и%20порядо.pdf"
          >Национальный стандарт «Индекс деловой репутации субъектов предпринимательской деятельности (ЭКГ-рейтинг). <br> Методика оценки и порядок формирования ЭКГ-рейтинга ответственного бизнеса». <br> ГОСТ Р 71198-2023</a>
        </p>
      </div>

      <div class="fourth-section__content">
        <div class="content">
          <div class="content__list">
            <div class="item">
              <div class="item__box">
                <div class="icon-wrapper">
                  <img src="/images/pages/main/s4_icon_1.svg">
                </div>
              </div>
              <h5>Предквалификация</h5>
              <p>
                Первичный отбор коммерческих организаций и индивидуальных предпринимателей, которые допускаются к
                дальнейшей оценке. <br>
                Исключением являются финансовые институты (банки, страховые и др.), компании с дисквалифицированными
                лицами в руководстве, иностранные агенты, компании, находящиеся в процедуре банкротства или ликвидации.
              </p>
            </div>

            <div class="item">
              <div class="item__box item__box--blue">
                <div class="icon-wrapper">
                  <img src="/images/pages/main/s4_icon_2.svg">
                </div>
              </div>
              <h5>Скоринг</h5>
              <p>
                Комплексный анализ коммерческих организаций и индивидуальных предпринимателей на основании
                верифицированных публичных данных об их истории работы, уровне оплаты труда, финансовом состоянии,
                платежах в бюджет, учредителях. <br>
                Используются только официальные данные государственных органов без запросов к участникам рейтинга.
                <br>
                <strong>Максимальное количество баллов – 100.<strong /></strong>
              </p>
            </div>

            <div class="item">
              <div class="item__box item__box--red">
                <div class="icon-wrapper">
                  <img src="/images/pages/main/s4_icon_3.svg">
                </div>
              </div>
              <h5>Анкетирование</h5>
              <p>
                Экспертная оценка дополнительной информации, предоставленной участниками рейтинга в добровольном
                (заявительном) порядке. <br>
                Учитывается уровень использования наилучших доступных технологий, качество социального пакета,
                реализация экологических и благотворительных проектов, социальные инвестиции в регионы присутствия. <br>
                Для заполнения анкеты участник рейтинга должен зарегистрироваться в <router-link :to="{ name: 'account' }">
                  личном кабинете.
                </router-link> <br>
                <strong>Максимальное количество баллов – 60.<strong /></strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.fourth-section {
  display: flex;
  flex-direction: column;
  gap: 80px;
  background: var(--surface-dark-dark-accent, #051945);

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
      color: var(--text-primary-inverted, #FFF);
      text-align: center;
    }

    p {
      text-align: center;
      padding-top: 24px;
      color: var(--text-secondary-inverted, rgba(255, 255, 255, 0.70));

      a {
        color: var(--text-primary-inverted, #FFF);
        text-decoration-line: underline;
        display: inline-block;
      }

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
    width: 100%;

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
    display: block;
    width: 100%;
    max-width: 1440px;
    padding: 0 56px;

    @include screen-tablet {
      padding: 0;
    }

    &__list {
      display: flex;
      height: 500px;
      position: relative;
      width: 100%;
      transform-style: preserve-3d;

      @include screen-tablet {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        height: auto;
        overflow-x: scroll;
      }

      @include screen-small-height {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        height: auto;
        overflow-x: scroll;
      }

    }

    .item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 0 48px;
      border-radius: var(--corner-radius-surface-small, 8px);
      height: 100%;
      width: 656px;
      position: absolute;
      left: 0;
      top: 0;
      perspective: 550px;
      transform: translate3d(0, 0, 0);
      background: var(--surface-light, #FFF);
      transition: all 0.3s linear;

      @include screen-desktop-xs {
        width: 550px;
      }

      @include screen-small-height {
        position: unset;
        width: auto;
        padding: 32px;
        justify-content: unset;
      }

      @include screen-tablet {
        position: unset;
        max-width: 367px;
        padding: 32px;
        justify-content: unset;
      }

      @include screen-mobile {
        position: unset;
        max-width: 300px;
        padding: 24px;
        justify-content: unset;
      }

      &__box {
        display: flex;
        width: 100px;
        height: 100px;
        padding: 22px;
        justify-content: center;
        align-items: center;
        border-radius: var(--corner-radius-surface-small, 8px);
        background: var(--surface-dark-dark-accent, #051945);
        transition: all 0.3s linear;

        @include screen-tablet {
          width: 64px;
          height: 64px;
          padding: 12px;
        }

        @include screen-mobile {
          width: 48px;
          height: 48px;
          padding: 12px;
        }

        .icon-wrapper {
          width: 24px;
          height: 42px;
          transition: all 0.3s linear;

          @include screen-tablet {
            width: 14px;
            height: 24px;
          }

          @include screen-mobile {
            width: 12px;
            height: 20px;
          }

          img {
            width: 100%;
            height: 100%;
          }

        }

        &--blue {
          background: var(--surface-accent-accent, #14509F);
        }

        &--red {
          background: var(--service-error-error, #E3000F);
        }
      }

      h5 {
        padding-top: 40px;
        transition: all 0.3s linear;

        @include screen-tablet {
          padding-top: 24px;
        }

        @include screen-mobile {
          font-size: 16px;
        }
      }

      p {
        padding-top: 24px;
        color: var(--text-primary, #051342);
        text-align: center;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        transition: all 0.3s linear;

        a {
          color: var(--text-accent-accent, #14509F);
          text-decoration-line: underline;
        }

        @include screen-tablet {
          padding-top: 12px;
        }

        @include screen-mobile {
          font-size: 14px;
          padding-top: 8px;
        }

      }

      &--secondary {
        background: var(--surface-neutral-neutral, #D8DDE5);
        scale: 0.8;
      }

      &--third {
        background: var(--surface-neutral-neutral-dark, #C1C6D2);
        scale: 0.6;
      }
    }

  }

}
</style>
