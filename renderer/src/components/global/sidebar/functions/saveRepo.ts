import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabase/supabase";
import store from "@/redux/store";

interface saveRepoProps {
  onSettingsClose: () => void;
  userIsPremium: boolean;
  localRepoDirectory: string;
  toast: any;
  user: any;
}

const saveRepo = async ({
  onSettingsClose,
  userIsPremium,
  localRepoDirectory,
  toast,
  user,
}: saveRepoProps) => {
  // if (repoFileCount < 5) {
  //   toast({
  //     title: "Not enough files",
  //     position: "top-right",
  //     description:
  //       "We need more files in your repo to train the AI model, DevGPT is designed for existing repositories.",
  //     status: "error",
  //     duration: 5000,
  //     isClosable: true,
  //   });
  //   return;
  // }

  if (user && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        local_repo_dir: localRepoDirectory,
      })
      .eq("id", user?.id)
      .single();

    if (!error) {
      onSettingsClose();

      //update redux store with new localRepoDirectory and technologiesUsed
      store.dispatch({
        type: "SETTINGS_CHANGED",
        payload: {
          localRepoDirectory: localRepoDirectory,
        },
      });
    } else {
      toast({
        title: "Error",
        position: "top-right",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }
};

export default saveRepo;
