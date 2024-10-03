<script setup lang="ts">
import anime from "animejs/lib/anime.es.js";
import { useDeviceBySize } from "~/composables/useDevice";

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

  const targets = document.querySelectorAll(".fifth-section__wrapper .item");
  anime({
    targets,
    easing: "linear",
    duration: 1000,
    delay: 1000,
    keyframes: [
      { translateY: ["550px", "0"] },
    ],
  });

  emit("enter");
}

</script>

<template>
  <section class="fifth-section">
    <div class="fifth-section__wrapper">
      <div class="fifth-section__title">
        <h2>Система оценки</h2>
        <p class="p1-regular">
          На основании полученной оценки участнику рейтинга присваивается соответствующий уровень.
        </p>
      </div>

      <div class="fifth-section__content">
        <div class="content">
          <div class="content__list">
            <div class="item">
              <div class="item__container">
                <div class="item__head">
                  <div class="item__icon">
                    <img src="/images/pages/main/s5_icon_1.svg">
                  </div>
                  <h6>Лидер</h6>
                </div>

                <div class="item__body">
                  <div class="item__row">
                    <p class="p1-regular">
                      Оценка
                    </p>
                    <p class="p1-regular">
                      Количество баллов
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      AAA
                    </p>
                    <p class="p1-regular">
                      от 101
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item__container">
                <div class="item__head">
                  <div class="item__icon">
                    <img src="/images/pages/main/s5_icon_1.svg">
                  </div>
                  <h6>Продвинутый</h6>
                </div>

                <div class="item__body">
                  <div class="item__row">
                    <p class="p1-regular">
                      Оценка
                    </p>
                    <p class="p1-regular">
                      Количество баллов
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      AA
                    </p>
                    <p class="p1-regular">
                      91 — 100
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      A
                    </p>
                    <p class="p1-regular">
                      81 — 90
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item__container">
                <div class="item__head">
                  <div class="item__icon">
                    <img src="/images/pages/main/s5_icon_2.svg">
                  </div>
                  <h6>Средний</h6>
                </div>

                <div class="item__body">
                  <div class="item__row">
                    <p class="p1-regular">
                      Оценка
                    </p>
                    <p class="p1-regular">
                      Количество баллов
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      BBB
                    </p>
                    <p class="p1-regular">
                      71 — 80
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      BB
                    </p>
                    <p class="p1-regular">
                      61 — 70
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      B
                    </p>
                    <p class="p1-regular">
                      51 — 60
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="item">
              <div class="item__container">
                <div class="item__head">
                  <div class="item__icon">
                    <img src="/images/pages/main/s5_icon_3.svg">
                  </div>
                  <h6>Базовый</h6>
                </div>

                <div class="item__body">
                  <div class="item__row">
                    <p class="p1-regular">
                      Оценка
                    </p>
                    <p class="p1-regular">
                      Количество баллов
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      ССС
                    </p>
                    <p class="p1-regular">
                      41 — 50
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      СС
                    </p>
                    <p class="p1-regular">
                      31 — 40
                    </p>
                  </div>
                  <div class="item__row">
                    <p class="p1-regular">
                      С
                    </p>
                    <p class="p1-regular">
                      меньше 30-ти
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.fifth-section {
  display: flex;
  flex-direction: column;
  gap: 80px;
  background: var(--surface-light, #FFF);

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
    gap: 80px;

    @include screen-tablet {
      gap: 40px;
    }
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
      color: var(--text-secondary, #7C879F);

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
    width: 100%;
    max-width: 1440px;

    .content {
      width: 100%;

      @include screen-tablet {
        padding: 0;
      }

      &__list {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 32px;
        overflow: hidden;

        @include screen-tablet {
          overflow: auto;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .item {
          display: flex;
          align-items: end;

          &:nth-child(1) {
            .item__container {
              height: 550px;

              @include screen-tablet {
                height: auto;
              }
            }
          }

          &:nth-child(2) {
            .item__container {
              height: 500px;

              @include screen-tablet {
                height: auto;
              }
            }

            .item__icon {
              background: var(--surface-accent-accent-dark-m, #153275);
            }
          }

          &:nth-child(3) {
            .item__container {
              height: 450px;

              @include screen-tablet {
                height: auto;
              }
            }

            .item__icon {
              background:  var(--surface-accent-accent, #14509F);
            }
          }

          &:nth-child(4) {
            .item__container {
              height: 400px;

              @include screen-tablet {
                height: auto;
              }
            }

            .item__icon {
              background: var(--surface-accent-accent-light-xxxl, #4E83C4);
            }
          }

          &__container {
            border-radius: var(--corner-radius-surface-small, 8px);
            background: var(--surface-accent-accent-light-s, #F6F8FB);
            display: flex;
            padding: 24px;
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            flex-shrink: 0;
            width: 100%;

            @include screen-mobile {
              padding: 16px;
            }
          }

          &__head {
            display: flex;
            flex-direction: column;
            gap: 24px;

            @include screen-tablet {
              flex-direction: row;
              align-items: center;
              gap:16px;
            }

            @include screen-tablet {
              gap:12px;
            }
          }

          &__icon {
            width: 48px;
            height: 48px;
            background: var(--surface-dark-dark-accent, #051945);
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;

            @include screen-tablet {
              width: 32px;
              height: 32px;

              img {
                width: 16px;
                height: 16px;
              }
            }

            @include screen-mobile {
              width: 24px;
              height: 24px;

              img {
                width: 12px;
                height: 12px;
              }
            }
          }

          h6 {
            font-size: 20px;
            color: var(--text-primary, #051945);

            @include screen-mobile {
              font-size: 16px;
            }
          }

          &__body {
            display: flex;
            flex-direction: column;
            width: 100%;
          }

          &__row {
            display: flex;
            justify-content: space-between;
            padding: 16px 0;
            border-bottom: 1px solid var(--stroke-accent-accent-light-s, #D9E3F0);

            @include screen-mobile {
              padding: 8px 0;
            }

            p {
              color: var(--text-primary, #051945);

              @include screen-mobile {
                font-size: 14px;
              }
            }

            &:first-of-type {
              padding-top: 0;

              p {
                color: var(--text-secondary, #7C879F);
              }
            }

            &:last-of-type{
              padding-bottom: 0;
              border-bottom: none;
            }

          }
        }

      }
    }

  }

}
</style>
