import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabaseClient";

import store from "@/redux/store";

interface ISetLocalConfigs {
  setTechnologiesUsed: React.Dispatch<React.SetStateAction<string>>;
  setContext: any;
  setLocalRepoDirectory: React.Dispatch<React.SetStateAction<string>>;
  user: any;
}

const fetchLocalConfigs = async ({
  setTechnologiesUsed,
  setContext,
  setLocalRepoDirectory,
  user,
}: ISetLocalConfigs) => {
  if (user && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (data?.technologies_used) {
      setTechnologiesUsed(data?.technologies_used);
    }

    if (data?.context) {
      setContext(data?.context);
    }

    if (data?.local_repo_dir) {
      setLocalRepoDirectory(data?.local_repo_dir);
    }

    //dispatch this to redux
    store.dispatch({
      type: "SETTINGS_CHANGED",
      payload: {
        localRepoDirectory: data?.local_repo_dir,
        technologiesUsed: data?.technologies_used,
        context: data?.context,
      },
    });
  }
};

export default fetchLocalConfigs;
