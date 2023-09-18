import { supabase } from "@/src/utils/supabase/supabase";

const createProject = async (
  projectRepo: any,
  baseBranch: any,
  setProjectRepo: any,
  setBaseBranch: any,
  user_id: any,
  toast: any,
  onClose: any,
  forceRefresh: any,
  setForceRefresh: any
) => {
  // If the user hasn't filled the fields, show a toast
  if (projectRepo === "") {
    toast({
      position: "top-right",
      title: "Oops! Something went wrong.",
      description:
        "It doesn't look like you have a project selected. Please select one.",
      status: "error",
      isClosable: true,
    });
    return;
  }

  if (supabase) {
    // // Don't allow the creation of a project with the same name
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .match({
        github_repo: projectRepo,
        user_id: user_id,
      });

    if (projects !== null && projects.length > 0) {
      toast({
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: "You already have a project with that name 😃",
        status: "error",
        isClosable: true,
      });

      return;
    }

    // // Don't allow the person to create a new project for 30 seconds after creating one
    const { data: newProject } = await supabase
      .from("projects")
      .select("*")
      .eq("github_repo", projectRepo)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (newProject !== null && newProject.length > 0) {
      const lastProject = newProject[0];
      const lastProjectDate: any = new Date(lastProject.created_at);
      const now: any = new Date();

      const diff = now - lastProjectDate;
      const diffSeconds = diff / 1000;
      const diffMinutes = diffSeconds / 1;

      if (diffMinutes < 30) {
        toast({
          position: "top-right",

          title: "Oops! Something went wrong.",
          description:
            "You can only add one project per minute, take it easy! 😎 ",
          status: "error",
          isClosable: true,
        });
        return;
      }
    }

    // Insert the project into the database
    const { error } = await supabase.from("projects").insert([
      {
        github_repo: projectRepo,
        base_branch: baseBranch,
        name: "github_project",
        user_id: user_id,
      },
    ]);

    // If there's an error, show a toast
    if (error) {
      toast({
        position: "top-right",
        title: "Oops! Something went wrong.",
        description: `Please try again later. code: 0001`,
        status: "error",
        isClosable: true,
      });
      return;
    } else {
      // If success, show a toast
      toast({
        position: "top-right",
        title: "Project added successfully.",
        description: "Your project has been added and is available now.",
        status: "success",
        isClosable: true,
      });

      // Force a list refresh
      setForceRefresh(!forceRefresh);

      // Set inputs back to blank
      setProjectRepo("");
      setBaseBranch("");

      // Close the modal
      onClose();
    }
  }
};

export default createProject;
