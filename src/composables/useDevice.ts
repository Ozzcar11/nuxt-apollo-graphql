import { onMounted, ref } from "vue";
import { useDevice } from "#imports";

const isDesktop = ref<boolean>(false);
const isTablet = ref<boolean>(false);
const isMobile = ref<boolean>(false);
const isDesktopXs = ref<boolean>(false);

// Маленькие по высоте экраны, нужно убрать блочный скрол что бы все нормально помещалось
const isSmallHeightScreen = ref<boolean>(false);

export function useDeviceBySize() {
  const {
    isDesktop: isDesktopDevice,
    isTablet: isTabletDevice,
    isMobile: isMobileDevice,
  } = useDevice();

  isDesktop.value = isDesktopDevice;
  isTablet.value = isTabletDevice;
  isMobile.value = isMobileDevice;

  onMounted(() => {
    setSizing();

    window.addEventListener("resize", () => {
      setSizing();
    });
  });

  function setSizing() {
    isDesktop.value = window.innerWidth >= 1280;
    isTablet.value = window.innerWidth >= 720 && window.innerWidth < 1280;
    isMobile.value = window.innerWidth < 720;
    isSmallHeightScreen.value = window.innerWidth >= 1280 && window.innerHeight < 910;
    isDesktopXs.value = window.innerWidth >= 1280 && window.innerWidth < 1440;
  }

  return { isDesktop, isTablet, isMobile, isSmallHeightScreen, isDesktopXs };
}
