import { altogic, AltogicResponse } from "src/api/altogic";

const getPartnerStatus = async (): Promise<AltogicResponse<{ premium: boolean }>> => {
  return await altogic.endpoint.get("/partner");
};

export { getPartnerStatus };
