const getRepos = async (access_token: any) => {
  if (!access_token) return console.error("Error: No access token provided");

  // Define the GitHub API URL for user repositories
  const api_url = "https://api.github.com/user/repos";

  // Set up headers with the access token for authentication
  const headers = {
    Authorization: `Bearer ${access_token}`,
    Accept: "application/json",
  };

  try {
    // Make a GET request to the GitHub API
    const response = await fetch(api_url, { headers });

    // Check if the request was successful (status code 200)
    if (response.ok) {
      // Parse the JSON response to get the list of repositories
      const repositories = await response.json();
      return repositories;
    } else {
      // Handle error response
      console.error(
        `Error: Unable to fetch repositories (HTTP ${response.status})`
      );
      return null;
    }
  } catch (error: any) {
    // Handle any network or connection errors
    console.error(`Error: ${error.message}`);
    return null;
  }
};

export default getRepos;
