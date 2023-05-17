import dayjs from "dayjs";
import { decompressFromBase64 } from "lz-string";
import { altogic, AltogicResponse } from "src/api/altogic";
import { File } from "src/store/useFile";

const saveToCloud = async (contents: string): Promise<AltogicResponse<{ _id: string }>> => {
  return await altogic.endpoint.post("json", { json: contents });
};

const getFromCloud = async (id: string) => {
  const { data, errors } = await altogic.endpoint.get(`json/${id}`, undefined, {
    userid: altogic.auth.getUser()?._id,
  });

  if (errors) throw errors;

  const isCompressed = dayjs("2023-04-20T07:04:25.255Z").isAfter(data?.updatedAt);
  if (isCompressed) {
    return { ...data, json: decompressFromBase64(data.json) };
  }

  return data;
};

const getAllJson = async (): Promise<AltogicResponse<{ result: File[] }>> =>
  await altogic.endpoint.get(`json`);

const updateJson = async (id: string, data: object) =>
  await altogic.endpoint.put(`json/${id}`, {
    ...data,
  });

const deleteJson = async (id: string) => await altogic.endpoint.delete(`json/${id}`);

export { saveToCloud, getFromCloud, getAllJson, updateJson, deleteJson };
