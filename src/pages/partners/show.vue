<script lang="ts" setup>
import { useRoute } from "vue-router";
import { EsrButton, EsrCard } from "@/components/ui";

import { usePartnersGet } from "@/modules/partners/composables/usePartnersGet";
import { partnersList } from "@/router/partners";

const route = useRoute();

const id = +route.params.id;

const { partner, loading } = usePartnersGet(id);

function toPartner() {
  if (!partner.value?.link) return;
  window.location.href = partner.value?.link;
}

</script>

<template>
  <div
    v-if="!loading"
    class="partner container"
  >
    <div class="partner__title">
      <span>{{ partner?.name }}</span>
    </div>
    <esr-card class="partner__card">
      <div class="partner__image">
        <img
          :src="partner?.image?.file.url"
          alt=""
        >
      </div>
      <div class="partner__description">
        {{ partner?.description }}
      </div>
      <div class="partner__buttons">
        <esr-button @click="toPartner">
          Перейти к предложению
        </esr-button>
        <esr-button
          color="secondary"
          :to="partnersList"
        >
          К списку предложений
        </esr-button>
      </div>
    </esr-card>
  </div>
</template>

<style lang="scss" scoped>
.partner {
  &__title {
    color: var(--text-primary);
    margin-bottom: 40px;

    @include text-h4;
  }

  &__image {
    width: 100%;
    height: 400px;
    margin-bottom: 24px;
    border-radius: var(--corner-radius-surface-small);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__card {
    padding: 24px;
    background-color: var(--surface-light);
  }

  &__description {
    color: var(--text-primary);
    margin-bottom: 24px;
  }

  &__buttons {
    display: flex;
    gap: 12px;
  }
}
</style>
