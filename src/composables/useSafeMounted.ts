import { type Ref, onMounted } from "vue";

// workaround for https://github.com/vuejs/core/issues/5844
export function useSafeOnMounted(element: Ref<HTMLElement | null>, listener: () => void, checkTimeLimit = 500) {
  const checkInterval: number = 50;
  let checksLeft = checkTimeLimit / checkInterval;

  const check = () => {
    if (element.value?.isConnected) {
      listener();
    } else if (checksLeft > 0) {
      setTimeout(check, checkInterval);
      checksLeft--;
    }
  };

  onMounted(() => {
    check();
  });
}
