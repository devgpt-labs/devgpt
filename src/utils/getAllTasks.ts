import { supabase } from "./supabase/supabase";

const getAllTasks = async (user_id: string, toast: any) => {
  return new Promise(async (resolve, reject) => {
    if (!supabase || !user_id) {
      console.log('error getting tasks');
      return;
    }

    const { data, error } = await supabase
      .from("new_transactions")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: `Please try again later. 😢 code: 0008`,
        status: "error",
        isClosable: true,
      });
      return;
    } else {
      resolve(data);
    }
  });
};

export default getAllTasks;
