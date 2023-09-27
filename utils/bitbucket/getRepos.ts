const getRepos = async (token: string) => {
	const apiUrl = "https://api.bitbucket.org/2.0/repositories";

	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			throw new Error(
				`Bitbucket API request failed with status ${response.status}`
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching repositories:", error);
		throw error;
	}
};

export default getRepos;
