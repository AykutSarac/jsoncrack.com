import { altogic, AltogicResponse } from "src/api/altogic";

const getPartnerStatus = async (
  parentURL: string
): Promise<AltogicResponse<{ premium: boolean }>> => {
  return await altogic.endpoint.get("/partner", {}, { parentURL });
};

export { getPartnerStatus };
