<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotifications } from "@ozzcar11/utilities/composables";
import { useVuelidate } from "@vuelidate/core";

import { objectIsFull } from "@/utils/object";

import { authLoginInn } from "@/router/auth";

import AuthForm from "@/modules/auth/components/auth-form.vue";

import { useReset } from "@/modules/auth/composables/useReset";
import { useCompanyByToken } from "@/modules/companies/composables/useCompanyByToken";

const route = useRoute();
const router = useRouter();
const token = route.query.token as string;

const { notificate } = useNotifications();

const resetForm = ref({
  new_password: "",
  repeat_password: "",
  token,
});

const v = useVuelidate();

const { resetRequest } = useReset();
const { company } = await useCompanyByToken(token);

const disableStatus = computed(() => objectIsFull({
  new_password: resetForm.value.new_password,
  repeat_password: resetForm.value.repeat_password,
}));

async function onSubmit() {
  try {
    const isValid = await v.value.$validate();
    if (!isValid) return;

    await resetRequest({ password_reset: resetForm.value });

    void router.push({ name: authLoginInn.name });
  } catch (e) {
    console.error(e);
    notificate("Возникла техническая ошибка", { type: "error" });
  }
}

</script>

<template>
  <div class="register">
    <auth-form
      v-model:firstInput="resetForm.new_password"
      v-model:secondInput="resetForm.repeat_password"
      title="Восстановление пароля"
      button-name="Восстановить"
      both-password
      :subtitle="company?.name"
      :description="company ? `ИНН: ${company?.inn}` : ''"
      :disabled="disableStatus"
      @submit="onSubmit"
    />
  </div>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--surface-neutral-neutral-light-s, #F8FAFC);

  &__checkbox {
    margin: 32px 0;
  }
}
</style>
