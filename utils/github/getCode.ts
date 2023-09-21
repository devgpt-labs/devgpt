const getCode = async (
	owner: any,
	repo: any,
	path: any,
	access_token: any
) => {
	// Define the GitHub API URL for getting repository contents
	const api_url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

	// Set up headers with the access token for authentication
	const headers = {
		Authorization: `Bearer ${access_token}`,
		Accept: "application/json",
	};

	try {
		const response = await fetch(api_url, { headers });

		if (response.ok) {
			const files = await response.json();
			return files
		} else {
			console.error(`Error: Unable to fetch files (HTTP ${response.status})`);
			return null;
		}
	} catch (error: any) {
		console.error(`Error: ${error.message}`);
		return null;
	}
};

export default getCode;
