import { PostgrestSingleResponse } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { supabase } from "src/lib/api/supabase";
import { File } from "src/store/useFile";
import useUser from "src/store/useUser";
import { FileFormat } from "src/types/models";

type CloudSave = {
  id?: string;
  contents: string;
  format: FileFormat;
};

const saveToCloud = async ({
  id,
  contents,
  format = FileFormat.JSON,
}: CloudSave): Promise<PostgrestSingleResponse<{ id: string }[]>> => {
  return await supabase.from("document").upsert({ id, content: contents, format }).select("id");
};

const getFromCloud = async (doc_id: string): Promise<PostgrestSingleResponse<File[]>> => {
  return await supabase.rpc("get_document_by_id", { doc_id });
};

const getAllJson = async (): Promise<File[]> => {
  const userId = useUser.getState().user?.id;
  if (!userId) return [];

  const { data, error } = await supabase
    .from("document")
    .select()
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    toast.error(error.message);
    return [];
  }

  return data;
};

const updateJson = async (id: string, data: object) => {
  return await supabase.from("document").update(data).eq("id", id).select("private");
};

const deleteJson = async (id: string) => await supabase.from("document").delete().eq("id", id);

export { saveToCloud, getFromCloud, getAllJson, updateJson, deleteJson };
