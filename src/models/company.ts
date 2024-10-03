import { type Okved } from "~/models/okved.ts";

export type CompanyCategory = {
  id: number;
  name: string;
};

export type CompanyRegion = {
  id: number;
  name?: string;
};

export type ContactPerson = {
  id?: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  add_information: string;
};

export type Company = {
  id: number;
  name: string;
  link: string;
  inn: string;
  trademarks: string;
  product_information: string;
  okved: Okved;
  contact_person: ContactPerson;
  company_category: CompanyCategory;
  average_headcount: number | null;
  region_registration: CompanyRegion;
  revenue_year: number | null;
  region_presences: CompanyRegion[];
  level_1: string;
  level_2: string;
  ecology_points: number;
  staff_points: number;
  government_points: number;
  result_points: number;
  status: string;
};
