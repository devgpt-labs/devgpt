import { supabase } from "./supabase/supabase";

const removeRepo = async (
  id: any,
  toast: any
) => {

  const { error } = await supabase
    .from("repos")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
  } else {
    toast({
      title: "Repo removed.",
      description: "Repo removed successfully.",
      status: "success",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    })
  }
};

export default removeRepo;
