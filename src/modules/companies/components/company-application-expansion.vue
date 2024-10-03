<script lang="ts" setup>
import CompanyApplicationCircle from "./company-application-circle.vue";
import { EsrCard, EsrIcon } from "~/components/ui";
import { type Area } from "~/models";

defineProps<{
  areaTree: Area[];
}>();

function onClickHandler(value: Area) {
  if (value.children.length === 0) return;

  value.isOpen === undefined ? value.isOpen = true : value.isOpen = !value.isOpen;
}
</script>

<template>
  <div class="application-expansion">
    <div
      v-for="area in areaTree"
      :key="area.id"
      class="application-expansion__item"
      :class="{ 'is-open': area.isOpen }"
      @click="onClickHandler(area)"
    >
      <div class="application-expansion__content">
        <div class="application-expansion__text">
          {{ area?.public_name }}
        </div>
        <div class="application-expansion__info">
          <div class="application-expansion__points">
            <span class="application-expansion__points--colored">{{ area?.area_result?.result_points ?? 0 }}</span> из <span>{{ area.area_result?.max_points ?? 0 }}</span> баллов
          </div>
          <div
            class="application-expansion__caret"
            :class="{ 'is-open': area.isOpen }"
          >
            <esr-icon
              icon="mdi-chevron-down"
              size="16"
            />
          </div>
        </div>
      </div>
      <div class="application-expansion__questions">
        <esr-card
          v-for="children in area.children"
          :key="children.id"
          class="application-expansion__question"
          :class="{ 'is-open': children.isOpen }"
          @click.stop="onClickHandler(children)"
        >
          <div class="application-expansion__question-header">
            <div class="application-expansion__question-info">
              <div class="application-expansion__title">
                {{ children?.public_name }}
              </div>
              <div class="application-expansion__description">
                {{ children?.public_name }}
              </div>
            </div>
            <div class="flex">
              <div class="application-expansion__points">
                <company-application-circle
                  :max-value="children.area_result?.max_points"
                  :value="children.area_result?.result_points"
                />
                <div class="application-expansion__points-text">
                  <span class="application-expansion__points--colored">{{ children.area_result?.result_points ?? 0 }}</span>из<span>{{ children.area_result?.max_points ?? 0 }}</span>
                </div>
              </div>
              <div
                class="application-expansion__caret"
                :class="{ 'is-open': children.isOpen }"
              >
                <esr-icon
                  v-if="children.children.length > 0"
                  icon="mdi-chevron-down"
                  size="16"
                />
              </div>
            </div>
          </div>
          <transition name="slide-top">
            <ul
              v-if="children.isOpen"
              class="application-expansion__question-list"
              @click.stop
            >
              <li
                v-for="question in children.children"
                :key="question.id"
                class="application-expansion__question-item"
              >
                <div class="application-expansion__question-wrapper">
                  <div class="application-expansion__title">
                    {{ question.public_name }}
                  </div>
                  <div class="mr-left application-expansion__points">
                    <company-application-circle
                      :max-value="question.area_result?.max_points"
                      :value="question.area_result?.result_points"
                    />
                    <div class="application-expansion__points-text">
                      <span class="application-expansion__points--colored">{{ question.area_result?.result_points ?? 0 }}</span>из<span>{{ question.area_result?.max_points ?? 0 }}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </transition>
        </esr-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.application-expansion {
  &__item {
    position: relative;
    margin-bottom: 16px;
    padding: 20px 24px;
    border-radius: var(--corner-radius-surface-small, 8px);
    background: var(--surface-light, #FFF);
    box-shadow: 0 4px 16px 0 rgba(5, 25, 69, 0.04);
    max-height: 72px;
    overflow: hidden;
    transition: max-height .3s cubic-bezier(.4,0,.2,1);;

    &.is-open {
      max-height: 2000px;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__questions {
    margin-top: 20px;
  }

  &__question {
    position: relative;
    padding: 16px 20px;
    background: var(--surface-accent-accent-light-s, #F6F8FB);
    max-height: auto;
    overflow: hidden;

    .application-expansion__caret {
      top: 28px;
    }

    &-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;

      @include screen-mobile {
        flex-direction: column;
        align-items: start;
      }
    }

    & + & {
      margin-top: 12px;
    }

    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      @include screen-mobile {
        flex-direction: column;
        align-items: start;
      }
    }

    &.is-open {
      max-height: 2000px;
    }

  }

  &__info {
    display: flex;
    align-items: center;
    margin-right: 20px;
  }

  &__caret {
    color: var(--icon-secondary, #7C879F);
    position: absolute;
    top: 23px;
    right: 24px;
    display: flex;
    align-self: center;
    justify-items: center;
    margin-left: 16px;
    width: 24px;
    height: 24px;

    &.is-open {
      transform: rotate(180deg);
    }
  }

  &__points {
    display: flex;
    align-items: center;
    color: var(--text-third, #BFC6D8);
    font-weight: 500;
    position: relative;
    flex: 0 1 120px;
    margin-right: 40px;

    span {
      display: inline-block;
      width: 19px;
      text-align: center;
      margin: 0 3px;
    }

    &--colored {
      color: var(--text-primary, #051945);
    }

    &-text {
      white-space: nowrap;
      margin-left: 16px;

      @include screen-mobile {
        margin-left: 7px;
      }
    }
  }

  &__text {
    color: var(--text-primary, #051945);

    @include text-h6;
  }

  &__title {
    color: var(--text-primary, #051945);
    max-width: 900px;
    font-weight: 500;
    flex: 1 1 0;

    @include screen-tablet {
      max-width: 600px;
    }

    @include screen-mobile {
      max-width: 170px;
    }
  }

  &__description {
    color: var(--text-secondary, #7C879F);
    max-width: 900px;
    margin-top: 4px;

    @include text-sm;
  }

  &__question-list {
    margin-top: 18px;
  }

  &__question-item {
    display: flex;
    border-top: 1px solid var(--stroke-accent-accent-light-s, #D9E3F0);
    padding: 16px 0;

    &:last-child {
      padding-bottom: 0;
    }

    &::before {
      content: '\2022 ';
      color: var(--surface-accent);
      margin-right: 16px;
      line-height: 24px;

      @include text-h6;

      @include screen-mobile {
        display: none;
      }
    }

    .application-expansion__points {
      margin-right: 0;
    }
  }
}

.mr-left {
  margin-left: auto;
}
</style>
