import { supabase } from "./supabase/supabase";
import store from "@/redux/store";

const addRepo = async (
  user: any,
  technologiesUsed: string,
  localRepoDirectory: string,
  context: string,
  toast: any
) => {
  const { data, error } = await supabase.from("repos").insert([
    {
      user_id: user?.id,
      local_repo_dir: localRepoDirectory,
      technologies_used: technologiesUsed,
      context: context,
    },
  ]);

  if (error) {
    console.log(error);
  } else { 
    // dispatch add_repo action
    store.dispatch({
      type: "ADD_REPO",
      payload: {
        user_id: user?.id,
        local_repo_dir: localRepoDirectory,
        technologies_used: technologiesUsed,
        context: context,
      }
    });

    toast({
      title: "Repo added.",
      description: "Repo added successfully.",
      status: "success",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    })
  }
};

export default addRepo;