import { supabase } from "@/integrations/supabase/client";

export async function uploadContentFile(file: File, folder: "posts" | "library" | "media" | "misc" = "misc") {
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("content-files")
    .upload(path, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("content-files").getPublicUrl(path);
  return { url: data.publicUrl, path };
}
