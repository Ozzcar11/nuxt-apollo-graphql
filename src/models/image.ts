import { type UploadFile } from "./file";

export type ImageType = {
  id: number;
  title: string;
  description?: string;
  file: UploadFile;
};
