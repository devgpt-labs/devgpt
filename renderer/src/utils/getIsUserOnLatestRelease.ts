import packageJson from "../../../package.json";

const getIsUserOnLatestRelease = async (): Promise<boolean> => {
	const response = await fetch(
		"https://api.github.com/repos/february-Labs/devgpt-releases/releases/latest"
	);
	const data = await response.json();
	return packageJson.version > data.tag_name;
};

export default getIsUserOnLatestRelease;
