<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { merge } from "lodash-es";
import { EsrButton, EsrIcon } from "@/components/ui";

import PartnersCard from "@/modules/partners/components/partners-card.vue";
import AppSearch from "@/components/ui/search/index.vue";

import { defaultFilters, usePartnersList } from "~/modules/partners/composables/usePartnersList";

import { type PartnerOffer } from "@/models";

const { partnersOffers, meta, filters, loading } = usePartnersList();

const partnersOffersStack = ref<PartnerOffer[]>([]);

const loadValue = computed(() => {
  const defaultPerPage = 6;

  if (!meta.value?.last_page) return;

  if (partnersOffersStack.value.length + defaultPerPage > meta.value.total) return meta.value.total - partnersOffersStack.value.length;

  return defaultPerPage;
});

filters.updateFilters(defaultFilters);

function loadMore() {
  if (!loadValue.value) return;

  filters.default.value.per_page = filters.default.value.per_page + loadValue.value ?? 0;
}

watch(partnersOffers, (value) => {
  if (!value) return;

  partnersOffersStack.value = merge(partnersOffersStack.value, value);
});

watch(() => filters.default.value.filter.search, () => {
  partnersOffersStack.value = [];
});
</script>

<template>
  <div class="partners container">
    <div class="partners__header">
      <div>
        <div class="partners__title">
          <span>Предложения от партнеров</span>
        </div>
        <div class="partners__description">
          Здесь вы можете посмотреть предложения от наших партнёров
        </div>
      </div>
      <div class="partners__search">
        <app-search
          v-model="filters.default.value.filter.search"
          label="Поиск предложения"
          placeholder="Введите наименование предложения"
        />
      </div>
    </div>
    <div class="partners__content">
      <template v-if="partnersOffersStack.length">
        <div class="partners__grid">
          <partners-card
            v-for="offer in partnersOffersStack"
            :id="offer.id"
            :key="offer.id"
            :link="offer.link"
            :title="offer.name"
            :description="offer.description"
            :image="offer.image"
          />
        </div>
        <esr-button
          v-if="partnersOffersStack.length !== meta?.total"
          class="partners__load-more"
          color="light"
          prefix-icon="mdi-refresh"
          :disabled="loading"
          @click="loadMore"
        >
          Загрузить ещё {{ loadValue }} из {{ meta?.total }}
        </esr-button>
      </template>
      <template v-else-if="!loading">
        <div class="partners-empty">
          <div class="partners-empty__icon">
            <esr-icon
              icon="mdi-magnify-close"
            />
          </div>
          <div class="partners-empty__title">
            К сожалению, нет подходящих вариантов...
          </div>
          <div class="partners-empty__description">
            Мы ничего не нашли, проверьте свой запрос и попробуйте снова
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.partners {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;

    @include screen-mobile {
      flex-direction: column;
    }
  }

  &__title {
    color: var(--text-primary, #051945);
    margin-bottom: 16px;
    line-height: 32px;

    @include text-h4;

    @include screen-tablet {
       @include text-h6;
    }
  }

  &__description {
    color: var(--text-secondary, #7C879F);

    @include screen-tablet {
       @include text-sm;
    }
  }

  &__search {
    width: 400px;

    @include screen-tablet {
      margin-top: 12px;
       width: 336px;
    }

    @include screen-mobile {
      .esr-input.esr-input--medium {
        .esr-input__label {
          display: none !important;
        }
      }
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @include screen-tablet {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    @include screen-mobile {
      grid-template-columns: repeat(1, 1fr);
      gap: 12px;
    }
  }

  &__load-more {
    color: var(--text-primary, #051945);
    margin: 40px auto 0;
  }

  &-empty {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
    color: var(--surface-accent-light-xl, #7C879F);

    @include screen-tablet {
      margin-top: 60px;
    }

    &__icon {
      width: 200px;
      height: 200px;
      margin-bottom: 40px;

      @include screen-tablet {
        width: 160px;
        height: 160px;
        margin-bottom: 36px;
      }

      @include screen-mobile {
        width: 130px;
        height: 130px;
        margin-bottom: 24px;
      }

      .esr-icon {
        width: 100%;
        height: 100%;
      }
    }

    &__title {
      color: var(--text-primary, #051945);
      margin-bottom: 12px;
      text-align: center;

      @include text-h6;

      @include screen-tablet {
        @include text-base
      }
    }

    &__description {
      color: var(--text-secondary, #7C879F);
      text-align: center;

      @include screen-tablet {
        @include text-sm
      }
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

}
</style>
