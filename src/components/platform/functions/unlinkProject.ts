import { supabase } from "@/src/utils/supabase/supabase";

const unlinkProject = async (
  id: any,
  toast: any,
  forceRefresh: any,
  setForceRefresh: any
) => {
  if (supabase) {
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: "Please try again later. 😢 code: 0003",
        status: "error",
        isClosable: true,
      });
      return;
    } else {
      toast({
        position: "top-right",
        title: "Project unlinked.",
        description:
          "We've removed the project from your list and it's no longer available.",
        status: "success",
        isClosable: true,
      });
      setForceRefresh(!forceRefresh);
    }
  }
};

export default unlinkProject;
