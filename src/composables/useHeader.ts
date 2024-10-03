import { ref } from "vue";
import { type Ref } from "vue";
import { type HeaderVariation } from "~/components/app/header/types.ts";

const headerVariation: Ref<HeaderVariation> = ref("white");

export function useHeader() {
  function setHeaderVariation(variation: HeaderVariation) {
    headerVariation.value = variation;
  }

  return { headerVariation, setHeaderVariation };
}
