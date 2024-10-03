<script setup lang="ts">
import { onMounted } from "vue";
import anime from "animejs/lib/anime.es.js";
import { useDeviceBySize } from "~/composables/useDevice";
import { EsrIcon } from "~/components/ui";
import AppFooter from "~/components/app/footer/app-footer.vue";

const emit = defineEmits<{
  (e: "exit", to: "up" | "down"): void;
  (e: "enter"): void;
}>();

defineExpose({
  intro,
});

const { isDesktop } = useDeviceBySize();

function intro() {
  // Не показываем на мобильных устройствах
  if (!isDesktop.value) {
    return false;
  }

  const targets = document.querySelectorAll(".sixth-section__title");
  anime({
    targets,
    easing: "linear",
    delay: 600,
    duration: 600,
    keyframes: [
      { opacity: ["0", "1"] },
    ],
  });

  emit("enter");
}

onMounted(() => {
  if (isDesktop.value) {
    const shape: HTMLElement | null = document.querySelector(".sixth-section .shape");
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

</script>

<template>
  <section class="sixth-section">
    <div class="sixth-section__wrapper">
      <div class="shape" />
      <div class="sixth-section__title">
        <h2>Нормативные акты</h2>
        <ul class="sixth-section__list">
          <li>
            <esr-icon icon="mdi-file-document-outline" /> <a
              target="_blank"
              href="/docs/01.%20Национальный%20стандарт%20Индекс%20деловой%20репутации%20субъектов%20предпринимательской%20деятельности%20(ЭКГ-%20рейтинг).Методика%20оценки%20и%20порядо.pdf"
            >Национальный стандарт «Индекс деловой репутации субъектов предпринимательской деятельности (ЭКГ-рейтинг). <br>
              Методика оценки и порядок формирования ЭКГ-рейтинга ответственного бизнеса». ГОСТ Р 71198-2023</a>
          </li>
          <li>
            <esr-icon icon="mdi-file-document-outline" /> <a
              target="_blank"
              href="/docs/Форма_согласия_компании_на_включение_в_ЭКГ_рейтинг.xlsx"
            >Форма согласия компании на включение в ЭКГ-рейтинг</a>
          </li>
          <li>
            <esr-icon icon="mdi-file-document-outline" /> <a
              target="_blank"
              href="/docs/Проект_модельного_закона_о_развитии_ответственного_ведения_бизнеса.docx"
            >Проект модельного закона о развитии ответственного ведения бизнеса в субъекте Российской Федерации</a>
          </li>

          <li>
            <esr-icon icon="mdi-file-document-outline" /> <a
              target="_blank"
              href="/docs/03.%20Закон%20от%205%20декабря%202022%20г.%20№%20116-ОЗ%20О%20развитии%20ответственного%20ведения%20бизнеса%20во%20Владимирской%20области.pdf"
            >Закон от 5 декабря 2022 г. № 116-ОЗ «О развитии ответственного ведения бизнеса во Владимирской области»</a>
          </li>
          <li>
            <esr-icon icon="mdi-file-document-outline" /><a
              target="_blank"
              href="/docs/04.%20Закон%20от%2030%20ноября%202023%20г.%20№%20116-ОЗ%20О%20развитии%20ответственного%20ведения%20бизнеса%20на%20территории%20Воронежской%20области.pdf"
            >Закон от 30 ноября 2023 г. № 116-ОЗ «О развитии ответственного ведения бизнеса на территории Воронежской области»</a>
          </li>
          <li>
            <esr-icon icon="mdi-file-document-outline" /> <a
              target="_blank"
              href="/docs/05.%20Закон%20от%2028%20декабря%202023%20г.%20№%20436-ОЗ%20О%20развитии%20ответственного%20ведения%20бизнеса%20в%20Липецкой%20области.pdf"
            >Закон от 28 декабря 2023 г. № 436-ОЗ «О развитии ответственного ведения бизнеса в Липецкой области»</a>
          </li>
        </ul>
      </div>
    </div>
    <app-footer />
  </section>
</template>

<style lang="scss">
.sixth-section {
  display: flex;
  flex-direction: column;
  background: var(--surface-dark-dark-accent, #051945);
  overflow: hidden;

  .shape {
      background: url("/images/pages/main/shape3.svg") no-repeat;
      position: absolute;
      width: 1450px;
      height: 100%;
      z-index: 0;
      top: 9.5%;

      @include screen-tablet {
        background: url("/images/pages/main/shape4.svg") no-repeat;
        width: 100%;
        top: 7%;
        background-size: cover;
      }

      @include screen-mobile {
        background: url("/images/pages/main/shape5.svg") no-repeat;
        top: 7%;
        background-size: cover;
      }
  }

  &__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 80px;
    z-index: 1;
    position: relative;

    @include screen-desktop-xs {
      padding: 120px 56px 120px;
    }

    @include screen-tablet {
      padding: 150px 40px;
    }

    @include screen-mobile {
      padding: 80px 16px;
    }
  }

  &__title {
    width: 100%;
    max-width: 1440px;
    z-index: 1;

    h2 {
      color: var(--text-primary-inverted, #FFF);
      text-align: center;
      font-size: 56px;
      font-style: normal;
      font-weight: 600;
      line-height: 64px;

      @include screen-tablet {
        font-size: 48px;
        line-height: 56px;
      }

      @include screen-mobile {
        font-size: 32px;
        line-height: 40px;
      }
    }

  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-top: 40px;

    @include screen-tablet {
      padding-top: 32px;
    }

    @include screen-mobile {
      gap: 24px;
      padding-top: 24px;
    }

    li {
      display: flex;
      gap: 8px;
      justify-content: center;

      .esr-icon {
        flex-shrink: 0;
        width: 24px;
        height: 24px;

        svg {
          fill: var(--icon-secondary-inverted, rgba(255, 255, 255, 0.70));
        }

      }
    }

    a {
      color: var(--text-primary-inverted, #FFF);
      text-align: center;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
      text-decoration-line: underline;
      display: block;

      @include screen-mobile {
        font-size: 14px;
      }
    }
  }

}
</style>
