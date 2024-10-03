import { type Ref } from "vue";
import { helpers } from "@vuelidate/validators";
import { dayjs } from "@ozzcar11/utilities/plugins";

export const dateLessThen = (endDate: Ref<unknown>) => {
  if (endDate == null) return true;

  const validator = (value: string) => {
    const startDateDayJs = dayjs(value);
    let endDateDayJs;

    if (typeof endDate.value === "string") {
      endDateDayJs = dayjs(endDate.value);
    } else {
      endDateDayJs = dayjs((endDate.value as { date_end: string }).date_end);
    }

    return startDateDayJs.diff(endDateDayJs) <= 0;
  };

  return helpers.withMessage("Поле не может быть больше чем дата окончания", validator);
};
