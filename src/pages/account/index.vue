<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import { merge, omit } from "lodash-es";
import { useRouter } from "vue-router";
import { ApolloError } from "@apollo/client/errors";
import { EsrButton } from "@/components/ui/button";
import { refWithDefault } from "@/utils/ref";

import AboutCompanySection from "@/modules/account/components/about-company-section.vue";
import AboutContactSection from "@/modules/account/components/about-contact-section.vue";
import AboutSecuritySection from "@/modules/account/components/about-security-section.vue";

import { EsrDialog } from "@/components/ui/dialog";

import { useMe } from "@/modules/auth/composables/useMe";
import { type CompanyProps, useMeUpdate } from "@/modules/auth/composables/useMeUpdate";

import { useUserStore } from "@/stores/useUserStore";

import { authLogin } from "@/router/auth";
import { useLogout } from "@/modules/auth/composables/useLogout";
import { getOnlyNumbers } from "@/utils/maska";
import { INCORRECT_OLD_PASSWORD } from "@/constants/errors";

const userStore = useUserStore();

const { user } = await useMe();
const { updateMe } = useMeUpdate();
const { logout: logoutUser } = useLogout();

const router = useRouter();

const inputsSize = ref<"medium" | "large">("medium");
const incorrectPassword = ref(false);
const logoutDialog = ref(false);

const company = ref<CompanyProps>({
  inn: "",
  link: "",
  name: "",
  trademarks: "",
  product_information: "",
  okved: {
    id: -0,
    name: "",
  },
  contact_person: {
    firstname: "",
    lastname: "",
    middlename: "",
    phone: "",
    email: "",
    position: "",
    add_information: "",
  },
  company_category: {
    id: -0,
    name: "",
  },
  average_headcount: null,
  region_registration: {
    id: -0,
    name: "",
  },
  revenue_year: null,
  region_presences: [],
  ecology_points: 0,
  staff_points: 0,
  government_points: 0,
  result_points: 0,
});

const passwords = refWithDefault({
  old_password: "",
  password: "",
  repeat_password: "",
});

async function saveCompany(value?: Record<string, unknown>) {
  incorrectPassword.value = false;

  if (value) {
    Object.assign(company.value, value);
  }

  const me = {
    company: {
      id: company.value.id ?? 0,
      link: company.value.link,
      trademarks: company.value.trademarks,
      product_information: company.value.product_information,
      region_presences: company.value.region_presences.map((item) => ({ id: item.id })),
      contact_person: {
        ...omit(company.value.contact_person, "id"),
        phone: getOnlyNumbers(company.value.contact_person?.phone ?? "").toString(),
      },
    },
    user: !passwords.isEmpty() ? { ...passwords.ref.value } : null,
  };

  try {
    await updateMe({ me });
  } catch (e: unknown) {
    if (e instanceof ApolloError) {
      const isIncorrectOldPassword = (e.graphQLErrors[0].extensions?.validation as { [key: string]: string[] })?.["me.user.old_password"].includes(INCORRECT_OLD_PASSWORD);
      if (isIncorrectOldPassword) {
        incorrectPassword.value = true;
      }
    }
    console.error(e);
  }
}

async function savePasswords(value: Record<string, unknown>) {
  Object.assign(passwords.ref.value, value);
  await saveCompany();
}

async function logout() {
  logoutDialog.value = false;
  userStore.logout();

  await logoutUser();

  void router.push(authLogin);
}

merge(company.value, {
  ...user.value?.company,
  contact_person: user.value?.company?.contact_person || company.value.contact_person,
});

window.addEventListener("resize", () => {
  inputsSize.value = window.innerWidth <= 720 ? "medium" : "large";
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {});
});

</script>

<template>
  <div class="account">
    <div class="container">
      <h1 class="account__title">
        {{ company.name }}
      </h1>
      <p class="account__description">
        Здесь вы можете редактировать информацию о своей компании и контактные данные
      </p>
      <about-company-section
        :company="company"
        :inputs-size="inputsSize"
        @save-section="saveCompany"
      />
      <about-contact-section
        :contact="company.contact_person"
        :inputs-size="inputsSize"
        @save-section="saveCompany"
      />
      <about-security-section
        :passwords="passwords.ref.value"
        :inputs-size="inputsSize"
        :invalid="incorrectPassword"
        @reset-status="incorrectPassword = false"
        @save-section="savePasswords"
      />
      <esr-button
        class="account__error-btn"
        color="error"
        @click="logoutDialog = true"
      >
        Выйти из учетной записи
      </esr-button>
      <esr-dialog
        v-model="logoutDialog"
        @submit-dialog="logout"
        @cancel-dialog="logoutDialog = false"
      >
        <template #title>
          Вы хотите выйти из учетной записи ?
        </template>
        <template #description>
          Вы выйдете из своей учетной записи и будете перенаправлены на страницу авторизации
        </template>
      </esr-dialog>
    </div>
  </div>
</template>

<style lang="scss">
.account {
  display: flex;
  justify-content: center;
  color: var(--text-primary);

  &__title {
    color: var(--text-primary);
    margin-bottom: 16px;
    line-height: 40px;

    @include text-h1;

    @include screen-tablet {
      line-height: 32px;

      @include text-h5;
    }
  }

  &__description {
    color: var(--text-secondary);
    margin-bottom: 40px;

    @include screen-tablet {
      @include text-sm;

      margin-bottom: 32px;
    }

    @include screen-mobile {
      margin-bottom: 24px;
    }
  }

  &-card {
    padding: 24px;
    background-color: var(--surface-light);

    &__title {
      margin-bottom: 24px;

      &--empty {
        margin-bottom: 12px;
      }
    }

    &__inner {
      margin-bottom: 24px;
      padding: 24px;
      background: var(--surface-accent-light-s, #F6F8FB);
    }

    &__content {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      @include screen-tablet {
        grid-template-columns: 1fr 1fr;
      }

      @include screen-mobile {
        grid-template-columns: 1fr;
      }

      &.password-grid {
        .password-grid__first {
          grid-area: F;
        }

        .password-grid__second {
          grid-area: S;
        }

        .password-grid__third {
          grid-area: T;

          @include screen-tablet {
            width: 100%;
          }
        }

        grid-template-columns: 1fr 1fr 1fr;
        grid-template-areas: 'F S T';

        @include screen-tablet {
          grid-template-columns: 1fr 1fr;
          grid-template-areas: 'F T' 'S S';
        }

        @include screen-mobile {
          grid-template-columns: 1fr;
          grid-template-areas: 'F' 'S' 'T';
        }
      }
    }

    & + & {
      margin-top: 24px;
    }
  }

  &__error-btn {
    margin-top: 40px;

    @include screen-mobile {
      width: 100%;
    }
  }
}
</style>
