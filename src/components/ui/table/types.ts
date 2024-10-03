import { type TableMeta } from "@ozzcar11/utilities/types";

export type TableHeader = {
  title: string;
  value: string;
  combine: boolean;
};

export type TableProps<T> = {
  headers: TableHeader[];
  list?: T[];
  meta?: TableMeta;
  gridTemplateColumns?: string;
  loading?: boolean;
};

export type TableItem = {
  id: number;
};
