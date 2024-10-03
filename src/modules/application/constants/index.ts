export const APPLICATION_STATUS = {
  PROCESSED: "processed",
  FORMING_THE_QUESTIONNAIRE: "forming_the_questionnaire",
  SEND_FOR_PROCESSING: "send_for_processing",
} as const;

export const APPLICATION_STATUS_TYPE = {
  [APPLICATION_STATUS.PROCESSED]: "processed",
  [APPLICATION_STATUS.FORMING_THE_QUESTIONNAIRE]: "forming_the_questionnaire",
  [APPLICATION_STATUS.SEND_FOR_PROCESSING]: "send_for_processing",
} as const;

export const APPLICATION_STATUS_TITLE = {
  [APPLICATION_STATUS.PROCESSED]: "Проверено",
  [APPLICATION_STATUS.FORMING_THE_QUESTIONNAIRE]: "Формирование анкеты",
  [APPLICATION_STATUS.SEND_FOR_PROCESSING]: "Отправлено на проверку",
};

export const APPLICATION_STEPS = {
  ECOLOGY: "Экология",
  PERSONNEL: "Кадры",
  GOVERMENT: "Государство",
  BUISINESS: "Взаимодействие с бизнес-объединениями",
} as const;

export type ApplicationStatusType = keyof typeof APPLICATION_STATUS_TYPE;
