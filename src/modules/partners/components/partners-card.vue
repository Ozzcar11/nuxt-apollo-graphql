<script lang="ts" setup>
import { EsrCard, EsrIcon, EsrLink } from "@/components/ui";
import { type ImageType } from "@/models/image";
import { partnersShow } from "@/router/partners";

defineProps<{
  id: number;
  image: ImageType | null;
  title: string;
  description: string;
  link: string;
}>();
</script>

<template>
  <esr-card class="partners-card">
    <div class="partners-card__image">
      <img
        :src="image?.file.url"
        :alt="title"
      >
    </div>
    <div class="partners-card__title">
      {{ title }}
    </div>
    <div class="partners-card__description">
      {{ description }}
    </div>
    <esr-link
      :to="{ name: partnersShow.name, params: { id } }"
      class="partners-card__link"
    >
      <span>Узнать подробнее<esr-icon icon="mdi-arrow-right" /></span>
    </esr-link>
  </esr-card>
</template>

<style lang="scss" scoped>
.partners-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: var(--surface-light);

  &__image {
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: var(--corner-radius-surface-small, 8px);
    margin-bottom: 16px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__title {
    color: var(--text-primary, #051945);
    margin-bottom: 8px;

    @include text-h6;
  }

  &__description {
    color: var(--text-secondary, #7C879F);
    margin-bottom: 24px;
    flex: 1 1 auto;
    max-height: 73px;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__link span {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
