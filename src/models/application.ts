import { type AnyObject } from "@ozzcar11/utilities/types";
import { type UploadFile, type User } from ".";

export type ResponsibleUser = {
  id: number;
  user: User;
  user_application: {
    id: number;
  };
};

export type ApplicationSelf = {
  id: number;
  name: string;
};

export type Application = {
  id: number;
  user: User;
  user_application_responsibles: ResponsibleUser;
  application: ApplicationSelf;
  created_at: string;
};

export type ApplicationQuestionAnswer = {
  id?: number;
  value?: string | null;
  question: {
    id: number;
    text: string;
  };
  answer: {
    id: number;
    text: string;
  } | AnyObject;
  company_comment: string;
  user_question_scoring?: {
    id?: number;
    points: number | null;
    expert_comment: string;
    max_points: number | null;
  };
  questionIndex?: number;
  documents: {
    title: string;
    file: UploadFile;
  }[];
};

export type ApplicationRes = {
  points: number | null;
  user_application_questionnaire: number | null;
};

export type ApplicationCannedAnswer = {
  id: number;
  points: number | null;
  max_points: number | null;
  text: string;
};

export type ApplicationQuestion = {
  id: number;
  user_application_questionnaires: ApplicationQuestionAnswer[];
  question_canned_answers: ApplicationCannedAnswer[];
  text: string;
  system_name: string;
  public_text?: string;
};

export type ApplicationProject = {
  id?: number;
  name: string;
  description: string;
  date_start: string;
  date_end: string;
  place: string;
  materials: string;
  investment_volume: string;
  project_direction: {
    id: number;
    name: string;
  } | null;
  documents: {
    title: string;
    file: UploadFile;
  }[];
};

export type AreaResult = {
  id?: number;
  result_points?: number | null;
  max_points?: number | null;
};

export type Area = {
  id: number;
  name: string;
  description: string;
  application_area_questions: ApplicationQuestion[];
  text: string;
  public_name?: string;
  children: Area[];
  projects: ApplicationProject[];
  area_result?: AreaResult;
  isOpen?: boolean;
};
