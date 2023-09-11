import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabaseClient";
import store from "@/redux/store";

interface saveContextProps {
  context: string;
  toast: any;
  user: any;
}

const saveContext = async ({
  context,
  toast,
  user,
}: saveContextProps) => {
  if (context.length === 0) {
    return;
  }

  if (user && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        context: context,
      })
      .eq("id", user?.id)
      .single();

    if (!error) {
      //update redux store with new localRepoDirectory and technologiesUsed
      store.dispatch({
        type: "SETTINGS_CHANGED",
        payload: {
          context: context,
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

export default saveContext;
