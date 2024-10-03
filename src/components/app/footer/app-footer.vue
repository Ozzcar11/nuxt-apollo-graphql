<script setup lang="ts">

import AppLogo from "~/components/app/app-logo.vue";
</script>

<template>
  <footer class="footer">
    <div class="footer__row">
      <app-logo variation="white" />
      <div class="footer__socials">
        <div class="social-item">
          <p class="p1-regular">
            Электронная почта:
          </p>
          <a
            href="mailto:info@ozzcar11-rating.ru"
            class="p1-medium"
          >
            info@ozzcar11-rating.ru
          </a>
        </div>

        <div class="social-item">
          <p class="p1-regular">
            Телефон:
          </p>
          <a
            class="p1-medium"
            href="tel:+74957446250"
          >
            +7 (495) 744-62-50
          </a>
        </div>

        <div class="social-item">
          <p class="p1-regular">
            Социальные сети
          </p>
          <div class="icons">
            <a
              href="https://t.me/ozzcar11rating"
              target="_blank"
            ><img
              alt="telegram"
              src="/images/social-media/tg.svg"
            ></a>
            <a
              href="https://rutube.ru/channel/28022562/"
              target="_blank"
            ><img
              alt="rutube"
              src="/images/social-media/rutube.svg"
            ></a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer__row">
      <p class="footer__about">
        Национальный стандарт «Индекс деловой репутации субъектов предпринимательской деятельности (ЭКГ-рейтинг). <br> Методика оценки и порядок формирования ЭКГ-рейтинга ответственного бизнеса»
      </p>
    </div>

    <div class="footer__row">
      <div class="footer__links">
        <a
          href="/docs/Политика_в_отношении_обработки_персональных_данных.pdf"
          target="_blank"
        >Политика конфиденциальности</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
.footer {
  padding: 56px 80px;
  background: var(--surface-dark-dark-basic, #010712);
  z-index: 1;

  @include screen-tablet {
    padding: 24px;
  }

  @include screen-tablet {
    padding: 16px;
  }

  .logo {
    width: 112px;
    height: 56px;

    @include screen-tablet {
      width: 96px;
      height: 48px;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  &__row {
    border-bottom:1px solid var(--stroke-secondary-inverted, rgba(255, 255, 255, 0.10));
    padding: 32px 0;
    display: flex;

    @include screen-tablet {
      padding: 24px;
    }

    @include screen-mobile {
      padding: 16px 0;
    }

    p {
      @include screen-tablet {
        font-size: 14px;
      }
    }

    &:first-of-type {
      justify-content: space-between;
      padding-top: 0;

      @include screen-tablet {
        flex-direction: column;
      }

    }

    &:last-of-type {
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  &__socials {
    display: flex;
    gap: 80px;

    @include screen-tablet {
      padding-top: 24px;
      gap: 48px;
    }

    @include screen-mobile {
      flex-direction: column;
      gap: 16px;
    }

    .social-item {
      display: flex;
      gap: 12px;
      flex-direction: column;

      @include screen-tablet {
        gap: 0;
      }

      .p1-medium {
        text-align: right;

        @include screen-tablet {
        text-align: left;
        }
      }

      .icons {
        display: flex;
        gap: 12px;
        justify-content: end;

        @include screen-tablet {
          justify-content: start;
        }
      }
    }
  }

  &__about {
    color: var(--text-primary-inverted, #FFF);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 32px;
  }

  &__links {
    display: flex;
    gap: 80px;

    @include screen-tablet {
      gap: 48px;
    }

    @include screen-mobile {
      flex-direction: column;
      gap: 16px;
    }

    a {
      color: var(--text-primary-inverted, #FFF);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px; /* 150% */
      text-decoration-line: underline;

      @include screen-tablet {
        font-size: 14px;
      }
    }
  }
}
</style>
