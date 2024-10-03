<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHeader } from "~/composables/useHeader.ts";
import { useMe } from "~/modules/auth/composables/useMe.ts";
import { useUserStore } from "~/stores/useUserStore.ts";
import { useDeviceBySize } from "~/composables/useDevice.ts";

const { isSmallHeightScreen } = useDeviceBySize();

const { setHeaderVariation } = useHeader();
const router = useRouter();
const route = useRoute();

const layout = computed(() => route.meta.layout || "default");

router.afterEach((to) => {
  if (to.name === "main") {
    // setHeaderVariation("transparent-white");

    return;
  }

  document.getElementsByTagName("body")[0].classList.remove("hide-scrollbar");

  setHeaderVariation("white");
});

const favicons = computed(() => {
  const matcher = window.matchMedia("(prefers-color-scheme: dark)");
  if (!matcher.matches) {
    return [
      { size: "16x16", icon: "/favicon/16х16.png" },
      { size: "32x32", icon: "/favicon/32х32.png" },
      { size: "48x48", icon: "/favicon/48х148.png" },
    ];
  } else {
    return [
      { size: "16x16", icon: "/favicon/b16х16.png" },
      { size: "32x32", icon: "/favicon/b32х32.png" },
      { size: "48x48", icon: "/favicon/b48х148.png" },
    ];
  }
});

onMounted(async () => {
  const { user, refresh } = await useMe();

  await refresh();

  const userStore = useUserStore();

  if (user.value) {
    userStore.setUser(user.value);
  }

  if (isSmallHeightScreen.value) {
    document.getElementsByTagName("body")[0].classList.remove("hide-scrollbar");
  }
});

</script>

<template>
  <Head>
    <Title>ЭКГ-рейтинг ответственного бизнеса</Title>
    <Meta
      name="description"
      content="Национальный стандарт «Индекс деловой репутации субъектов предпринимательской деятельности (ЭКГ-рейтинг). Методика оценки и порядок формирования ЭКГ-рейтинга ответственного бизнеса»"
    />
    <ClientOnly>
      <Link
        v-for="favicon in favicons"
        :key="favicon.size"
        rel="icon"
        type="image/png"
        :href="favicon.icon"
        :sizes="favicon.size"
        class="light"
      />
    </ClientOnly>
  </Head>

  <NuxtLayout :name="layout">
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgb(251, 200, 150);
}

</style>
