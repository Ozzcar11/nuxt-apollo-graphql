<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useVuelidate } from "@vuelidate/core";

import { useCookie } from "#app";
import { EsrButton, EsrCard, EsrSelect } from "@/components/ui";

import { type EsiaType, useEsiaGetOrgs } from "~/modules/auth/composables/useEsiaGetOrgs";
import { useGetAuthLink } from "~/modules/auth/composables/useGetAuthLink";

import { authLogin } from "~/router/auth";

const route = useRoute();
const router = useRouter();

const loading = ref(true);

const { getOrgs, loading: orgsLoading } = useEsiaGetOrgs();
const { getLink } = useGetAuthLink();

const companyValue = ref<EsiaType | null>(null);
const companyOptions = ref<EsiaType[] | null>(null);

const cookie = useCookie("orgOid");

const v = useVuelidate();

const emptyForm = computed(() => !loading.value && companyOptions.value?.length === 0);

async function onSubmit() {
  try {
    const isValid = await v.value.$validate();
    if (!isValid) return;

    if (!companyValue.value) return;
    const res = await getLink({
      input: {
        orgOid: +companyValue.value.orgOid,
        code: route.query.code as string,
        state: route.query.state as string,
      },
    });

    if (!res?.data?.esiaGetAuthLinkByOrgOid) throw new Error();

    cookie.value = companyValue.value.orgOid.toString();
    window.location.href = res.data.esiaGetAuthLinkByOrgOid;
  } catch (e) {
    console.error(e);
  }
}

onMounted(async () => {
  try {
    const orgsResult = await getOrgs({
      input: {
        code: route.query.code as string,
        state: route.query.state as string,
      },
    });

    companyOptions.value = orgsResult?.data?.esiaGetOrgs ?? null;
    loading.value = false;
  } catch (e) {
    console.error(e);
    void router.push(authLogin);
  }
});
</script>

<template>
  <div class="login-esia">
    <esr-card
      v-if="!loading"
      class="login-esia__card"
    >
      <h2
        class="login-esia__title"
      >
        {{ emptyForm ? 'У вас нет доступных компаний или ИП' : 'Выберите компанию' }}
      </h2>
      <p
        class="login-esia__description"
      >
        {{ emptyForm ? 'Завершение регистрации невозможно, у вас нет доступных компаний или ИП, вы будете перенаправлены на начало авторизации' : 'Вам доступно несколько компаний, выберите одну для входа в личный кабинет' }}
      </p>
      <esr-select
        v-if="!emptyForm && companyOptions"
        v-model="companyValue"
        class="login-esia__select"
        label="Компания"
        :options="companyOptions"
        :disabled="orgsLoading"
        label-prop="shortName"
        value-prop="shortName"
        return-object
      />
      <esr-button
        v-if="!emptyForm"
        class="login-esia__button"
        @click="onSubmit"
      >
        Продолжить
      </esr-button>
      <esr-button
        v-else
        class="login-esia__button"
        @click="router.push('/')"
      >
        На страницу авторизации
      </esr-button>
    </esr-card>
  </div>
</template>

<style lang="scss" scoped>
.login-esia {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--surface-neutral-neutral-light-s, #F8FAFC);

  &__card {
    padding: 56px 32px 32px;
    max-width: 500px;
    text-align: center;
    background-color: var(--surface-light);

    @include screen-tablet {
      max-width: 400px;
    }

    @include screen-mobile {
      max-width: 336px;
      padding: 32px 24px 24px;
    }
  }

  &__title {
    color: var(--text-primary);
    margin-bottom: 16px;
    line-height: 32px;

    @include text-h5;

    @include screen-tablet {
      margin-bottom: 12px;
    }

    @include screen-mobile {
      margin-bottom: 8px;

      @include text-h6;
    }
  }

  &__description {
    color: var(--text-secondary);
    line-height: 24px;
    margin-bottom: 32px;

    @include screen-mobile {
      margin-bottom: 24px;

      @include text-sm;
    }
  }

  &__select {
    text-align: left;
  }

  &__button {
    width: 100%;
    margin-top: 32px;

    @include screen-mobile {
      margin-top: 24px;
    }
  }
}
</style>
