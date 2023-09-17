import packageJson from "../../../../../../package.json"

const getLatestReleaseVersion = async (): Promise<any> => {
	const response = await fetch(
		"https://api.github.com/repos/february-Labs/devgpt-releases/releases/latest"
	);
	
	const data = await response.json();
	if (data.tag_name <= packageJson.version) return false;
};

export default getLatestReleaseVersion;
