import router from "next/router";
import { supabase } from "./supabase/supabase";

const deleteTask = async (
  id: any,
  toast: any,
  forceRefresh: any,
  setForceRefresh: any
) => {
  if (supabase) {
    // This method just marks the task as deleted
    const { error } = await supabase
      .from("new_transactions")
      .update({ deleted: true })
      .eq("transaction_id", id);

    //  If there's an error, show a toast
    if (error) {
      toast({
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: `Please try again later. 😢`,
        status: "error",
        isClosable: true,
      });
      return;
    } else {
      //  If success, show a toast
      router.push(`/platform/transactions/new`);
      toast.closeAll();
      toast({
        position: "top-right",
        title: "Task Removed",
        description:
          "Your task has now been removed and is no longer accessible.",
        isClosable: true,
        status: "success",
      });
    }
    setForceRefresh(!forceRefresh);
  }
};

export default deleteTask;
