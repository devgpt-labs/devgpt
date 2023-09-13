import { supabase } from "./supabase/supabase";
import store from "@/redux/store";

const removeRepo = async (
  id: any,
  toast: any,
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

    // Update "repos" in store
    store.dispatch({
      type: "REMOVE_REPO",
      payload: id,
    })
  }
};

export default removeRepo;
