const getDefaultBranch = async (owner: any, repo: any, token: any) => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;

  const options = {
    method: "GET",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `token ${token}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // If GitHub API returns a message (like errors), then throw an Error
    if (data.message) throw new Error(data.message);

    return data.default_branch;
  } catch (error) {
    console.log(`Failed to get the default branch: ${error}`);
  }
};

export default getDefaultBranch;
