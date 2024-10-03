<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import FirstSection from "@/modules/main/components/first-section.vue";
import { useHeader } from "~/composables/useHeader";
import { useDeviceBySize } from "~/composables/useDevice";
import SecondSection from "~/modules/main/components/second-section.vue";
import ThirdSection from "~/modules/main/components/third-section.vue";
import FourthSection from "~/modules/main/components/fourth-section.vue";
import FifthSection from "~/modules/main/components/fifth-section.vue";
import SixthSection from "~/modules/main/components/sixth-section.vue";

const { setHeaderVariation } = useHeader();

const { isDesktop, isSmallHeightScreen } = useDeviceBySize();
const route = useRoute();
const router = useRouter();

const scrollLocked = ref<boolean>(false);
const currentSectionIdx = ref<number>(0);

type SectionComponent = InstanceType<typeof FirstSection>;
const sections = ref<SectionComponent[] | null>([]);

const sectionUnique = ref<string[]>([]);
const lockDoubleWatch = ref<boolean>(false);
watch(
  () => route.hash,
  () => {
    if (!lockDoubleWatch.value && route.name === "main") {
      void inspectRouteHash(route.hash as keyof typeof hashSectionsMap);
    }
  },
);

const hashSectionsMap = {
  "#rating": {
    position: 1,
  },
  "#about-rating": {
    position: 2,
  },
  "#rating-stages": {
    position: 3,
  },
  "#rating-system": {
    position: 4,
  },
  "#methodology": {
    position: 5,
  },
};

const inspectRouteHash = async (hash: keyof typeof hashSectionsMap) => {
  if (hashSectionsMap[hash]) {
    scrollLocked.value = false;
    currentSectionIdx.value = hashSectionsMap[hash].position - 1;
    await changeBlock("up");

    return;
  }

  if (currentSectionIdx.value !== 0) {
    scrollLocked.value = false;
    currentSectionIdx.value = -1;
    await changeBlock("up");
  }
};

const addToSections = (el: InstanceType<typeof FirstSection> | null, name: string) => {
  if (sectionUnique.value.includes(name)) {
    return;
  }

  if (sections.value && el) {
    sectionUnique.value.push(name);
    sections.value.push(el);
  }
};

const callback = (entries: IntersectionObserverEntry[]) => {
  entries.forEach(({ isIntersecting }) => {
    if (isIntersecting) {
      setTimeout(() => {
        scrollLocked.value = false;
      }, 200);
    }
  });
};

const alreadyScrolled = ref<boolean>(false);

const wheelListener = (e: WheelEvent) => {
  e.preventDefault();

  if (isSmallHeightScreen.value) {
    return false;
  }

  if (!isDesktop.value) {
    return false;
  }

  if (!sections.value) {
    return false;
  }

  if (e.deltaY > 0) {
    void changeBlock("up");
  } else if (e.deltaY <= 0) {
    void changeBlock("down");
  }
};

const keyboardListener = (e: KeyboardEvent) => {
  if (e.code === "ArrowUp") {
    void changeBlock("down");
  } else if (e.code === "ArrowDown") {
    void changeBlock("up");
  }
};

const changeBlock = async (direction: "up" | "down") => {
  if (!sections.value) {
    return false;
  }

  if (!scrollLocked.value) {
    scrollLocked.value = true;
    alreadyScrolled.value = true;

    if (direction === "up") {
      if (sections.value[currentSectionIdx.value + 1]) {
        currentSectionIdx.value++;
        const el = sections.value[currentSectionIdx.value].$el as HTMLElement;
        el.scrollIntoView({ behavior: "smooth" });

        lockDoubleWatch.value = true;
        if (el.id) {
          await router.replace({ name: "main", hash: "#" + el.id });
          lockDoubleWatch.value = false;
        } else {
          await router.replace({ name: "main" });
          lockDoubleWatch.value = false;
        }

        if (!isSmallHeightScreen.value) {
          sections.value[currentSectionIdx.value].intro();
        }
      } else {
        scrollLocked.value = false;
      }
    } else {
      if (sections.value[currentSectionIdx.value - 1]) {
        currentSectionIdx.value--;
        const el = sections.value[currentSectionIdx.value].$el as HTMLElement;
        el.scrollIntoView({ behavior: "smooth" });

        lockDoubleWatch.value = true;
        if (el.id) {
          await router.replace({ name: "main", hash: "#" + el.id });
          lockDoubleWatch.value = false;
        } else {
          await router.replace({ name: "main" });
          lockDoubleWatch.value = false;
        }

        if (!isSmallHeightScreen.value) {
          sections.value[currentSectionIdx.value].intro();
        }
      } else {
        scrollLocked.value = false;
      }
    }

    if (currentSectionIdx.value === 0) {
      setHeaderVariation("transparent-white");
    } else {
      setHeaderVariation("white");
    }

    // Если хоть раз скрольнули, надо сделать хеадер видимым
    const headerWrapper: HTMLElement | null = document.querySelector(".header__wrapper");
    if (headerWrapper && parseFloat(headerWrapper.style.opacity) < 1) {
      headerWrapper.style.opacity = "1";
    }
  }
};

let observer: IntersectionObserver;
onMounted(() => {
  setTimeout(() => {
    void inspectRouteHash(route.hash as keyof typeof hashSectionsMap);
  }, 300);

  if (!isDesktop.value || isSmallHeightScreen.value) {
    // На мобильных устройствах, надо чекать скрол и менять хеадер
    setHeaderVariation("transparent-white");

    window.addEventListener("scroll", () => {
      // TODO RequestAnimationFrame ???
      if (window.scrollY === 0) {
        setHeaderVariation("transparent-white");
      } else {
        setHeaderVariation("white");
      }
    });

    return false;
  }

  document.getElementsByTagName("body")[0].classList.add("hide-scrollbar");
  document.getElementsByTagName("body")[0].style.overflow = "hidden";

  setHeaderVariation("transparent-white");

  observer = new IntersectionObserver(callback, {
    rootMargin: "0px 0px 0px 0px",
    threshold: 1,
  });

  if (sections.value) {
    sections.value.forEach((section) => {
      const el = section.$el as HTMLElement;
      observer.observe(el);
    });

    addEventListener("wheel", wheelListener, { passive: false });
    addEventListener("keydown", keyboardListener);
  }

  // Нужно что бы можно было скролить внутри объектов, а не скролить страницу
  const unlockElements: NodeListOf<HTMLElement> = document.querySelectorAll(".esr-table__body, .esr-multiselect .multiselect-dropdown");
  unlockElements.forEach((unlockElement) => {
    unlockElement.addEventListener("mouseenter", () => {
      removeEventListener("wheel", wheelListener);
    });
  });

  unlockElements.forEach((unlockElement) => {
    unlockElement.addEventListener("mouseleave", () => {
      addEventListener("wheel", wheelListener, { passive: false });
    });
  });
});

onBeforeUnmount(() => {
  document.getElementsByTagName("body")[0].style.overflow = "visible";
  removeEventListener("wheel", wheelListener);
  removeEventListener("keydown", keyboardListener);

  if (sections.value && observer) {
    sections.value.forEach((section) => {
      const el = section.$el as HTMLElement;
      if (el) {
        observer.unobserve(el);
      }
    });
  }
});

// выходим из компоненов где есть свой скроллинг
const exit = () => {
  addEventListener("wheel", wheelListener, { passive: false });
  addEventListener("keydown", keyboardListener);
};

// когда входим в компонент где есть внутренний скроллинг, нужно отрубить общий
const enter = () => {
  removeEventListener("wheel", wheelListener);
  removeEventListener("keydown", keyboardListener);
};
</script>

<template>
  <div
    class="main-page"
  >
    <first-section
      :ref="(el) => addToSections(el as SectionComponent, 'first')"
      :already-scrolled="alreadyScrolled"
      class="full-page"
    />

    <second-section
      id="rating"
      :ref="(el) => addToSections(el as SectionComponent, 'second')"
      class="full-page"
    />

    <third-section
      id="about-rating"
      :ref="(el) => addToSections(el as SectionComponent, 'third')"
      class="full-page"
      @exit="exit"
      @enter="enter"
    />

    <fourth-section
      id="rating-stages"
      :ref="(el) => addToSections(el as SectionComponent, 'fourth')"
      class="full-page"
      @enter="enter"
      @exit="exit"
    />

    <fifth-section
      id="rating-system"
      :ref="(el) => addToSections(el as SectionComponent, 'fifth')"
      class="full-page"
    />

    <sixth-section
      id="methodology"
      :ref="(el) => addToSections(el as SectionComponent, 'sixth')"
      class="full-page"
    />
  </div>
</template>

<style lang="scss">
.main-page {
  background: var(--surface-dark-dark-accent, #051945);

  @include screen-tablet {
    padding-top: 112px;
  }

  @include screen-mobile {
    padding-top: 80px;
  }
}
</style>
