import { useAuthContext } from "@/src/context";
import { supabase } from "@/src/utils/supabaseClient";
import store from "@/redux/store";

interface saveTechStackProps {
  onSettingsClose: () => void;
  technologiesUsed: string;
  toast: any;
  user: any;
}

const saveTechStack = async ({
  onSettingsClose,
  technologiesUsed,
  toast,
  user,
}: saveTechStackProps) => {
  if (technologiesUsed.length === 0) {
    toast({
      title: "Error",
      position: "top-right",
      description:
        "Technology list is too short, please lengthen it to 1 technology or more.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  // Get the length of technologisedUsed.split(',') excluding empty strings
  if (technologiesUsed.split(",").filter((item) => item !== "").length > 6) {
    toast({
      title: "Error",
      position: "top-right",
      description:
        "Technology list is too long, please shorten it to 6 technologies or less.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  if (user && supabase) {
    const { data, error } = await supabase
      .from("profiles")
      .update({
        technologies_used: technologiesUsed,
      })
      .eq("id", user?.id)
      .single();

    if (!error) {
      //update redux store with new localRepoDirectory and technologiesUsed
      store.dispatch({
        type: "SETTINGS_CHANGED",
        payload: {
          technologiesUsed: technologiesUsed,
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

export default saveTechStack;
