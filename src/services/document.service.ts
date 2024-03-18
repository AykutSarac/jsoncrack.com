import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { FileFormat } from "src/enums/file.enum";
import { supabase } from "src/lib/api/supabase";
import { File } from "src/store/useFile";
import useUser from "src/store/useUser";

type CloudSave = {
  id?: string;
  contents: string;
  format: FileFormat;
};

export const documentSvc = {
  upsert: async (args: CloudSave): Promise<PostgrestSingleResponse<string>> => {
    const { id: p_id = "", contents: p_content, format: p_format = FileFormat.JSON } = args;
    return await supabase.rpc("upsert_document", {
      p_content,
      p_format,
      p_id,
    });
  },
  getById: async (doc_id: string): Promise<PostgrestSingleResponse<File[]>> => {
    return await supabase.rpc("get_document_by_id", { doc_id });
  },
  getAll: async (): Promise<File[]> => {
    const userEmail = useUser.getState().user?.email;
    if (!userEmail) return [];

    const { data, error } = await supabase
      .from("document")
      .select()
      .eq("owner_email", userEmail)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return [];
    }

    return data;
  },
  update: async (id: string, data: object) => {
    return await supabase.from("document").update(data).eq("id", id).select("private");
  },
  delete: async (id: string) => {
    await supabase.from("document").delete().eq("id", id);
  },
};
