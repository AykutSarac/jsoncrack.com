import { compressToBase64, decompressFromBase64 } from "lz-string";
import { HttpClient } from "src/api/interceptor";

const saveJson = async ({ id, data }) => {
  const compressedData = compressToBase64(data);

  if (id) {
    return await HttpClient.put<{ _id: string }>(`json/${id}`, {
      data: compressedData,
    });
  }

  return await HttpClient.post<{ _id: string }>("json", {
    data: compressedData,
  });
};

const getJson = async (id: string) =>
  await HttpClient.get(`json/${id}`).then(res =>
    decompressFromBase64(res.data.data)
  );

export { saveJson, getJson };
