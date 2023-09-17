//TODO make compare and return true/false from packagejson

const getLatestReleaseVersion = async (): Promise<string> => {
	const response = await fetch(
		"https://api.github.com/repos/february-Labs/devgpt-releases/releases/latest"
	);
	const data = await response.json();
	return data.tag_name;
};

export default getLatestReleaseVersion;
