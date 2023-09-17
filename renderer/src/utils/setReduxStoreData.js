import { supabase } from "@/src/utils/supabaseClient";
import store from "@/redux/store";

const setUserData = async (user) => {
  if (user && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

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

export default setUserData;
