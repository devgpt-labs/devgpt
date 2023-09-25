const getDefaultBranch = async (projectId: string, personalAccessToken: string) => {
    const apiUrl = `https://gitlab.example.com/api/v4/projects/${projectId}`;
  
    const headers = {
      "PRIVATE-TOKEN": personalAccessToken,
      Accept: "application/json",
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
  
      if (!response.ok) {
        throw new Error(`GitLab API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
  
      return data.default_branch;
    } catch (error: any) {
      console.error(`Failed to get the default branch: ${error.message}`);
    }
  };
  
  export default getDefaultBranch;
  