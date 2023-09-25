const getRepos = async ( username:any, token:any) => {
	const apiUrl = `https://gitlab.com/api/v4/users/${username}/projects`;
	// const apiUrl = `https://gitlab.com/api/v4/users/${username}/projects?private_token=${token}`;
  

	try {
		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(
				`GitLab API request failed with status ${response.status}`
			);
		}

		const repos = await response.json();
		return repos;
	} catch (error: any) {
		console.error(`Error: ${error.message}`);
		return null;
	}
};

export default getRepos;
