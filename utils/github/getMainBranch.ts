const getMainBranch = async (user: any, repo: any, token: any) => {
	const apiUrl = `https://api.github.com/repos/${user}/${repo}/branches`;

  console.log({user, repo, token});

	const headers = {
		Authorization: `token ${token}`,
	};

	try {
		const response = await fetch(apiUrl, {
			method: "GET",
			headers: headers,
		});

		if (!response.ok) {
			throw new Error(
				`GitHub API request failed with status ${response.status}`
			);
		}

		const branches = await response.json();

		// Find the main branch (usually named "main" or "master")
		const mainBranch = branches.find(
			(branch: any) => branch.name === "main" || branch.name === "master"
		);

		if (!mainBranch) {
			throw new Error(`Main branch not found for repository ${user}/${repo}`);
		}

		return mainBranch.name;
	} catch (error: any) {
		throw new Error(`Error finding main branch: ${error.message}`);
	}
};

export default getMainBranch;
