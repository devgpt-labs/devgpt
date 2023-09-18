import { supabase } from "@/src/utils/supabase/supabase";

const getProjects = async (user: any, setProjects: any, toast: any) => {
  
  if (supabase) {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user?.id);

    if (error) {
      toast({					
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: `Please try again later. 😢 code: 0002`,
        status: "error",
        isClosable: true,
      });
      return;
    } else {
      setProjects(data);
    }
  }
};

export default getProjects;
