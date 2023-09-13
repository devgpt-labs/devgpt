import { supabase } from "./supabase/supabase";

const provideFeedbackOnTask = async (
  id: any,
  feedback: any,
  toast: any,
  taskDescription: string,
  emailAddress: string
) => {
  if (!feedback) {
    toast({
      position: "top-right",
      title: "Oops! Something went wrong.",
      description:
        "Please put some feedback so we can better understand what to improve! 😃",
      status: "error",
      isClosable: true,
    });
    return;
  }

  // Update the transactions table feedback row with feedback
  if (supabase) {
    const { error } = await supabase
      .from("transactions")
      .update({ feedback: feedback })
      .eq("transaction_id", id.split("++")[0]);

    // If there's an error, show a toast
    if (error) {
      toast({ 
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: `Please try again later. 😢 code: 0009`,
        status: "error",
        isClosable: true,
      });
      return;
    }
  }

  if (feedback === "good") {
    toast({
      position: "top-right",

      title: "Thank you for your feedback.",
      description:
        "We've noted that DevGPT performed well. Your feedback helps to improve code quality and performance.",
      status: "success",
      isClosable: true,
    });
  } else {
    toast({
      position: "top-right",

      title: "Thank you for your feedback.",
      description:
        "We've noted that DevGPT didn't complete the task ideally. Your feedback helps to improve code quality and performance.",
      status: "success",
      isClosable: true,
    });
  }

  return;
};

export default provideFeedbackOnTask;
