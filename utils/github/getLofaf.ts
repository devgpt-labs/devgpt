import getMainBranch from './getMainBranch';
import IGNORED_FILES from '@/app/configs/ignoredFiles';
import IGNORED_FOLDERS from '@/app/configs/ignoredFolders';

const getLofaf = async (owner: any, repo: any, branch: any, token: any) => {
	console.log({owner, repo, branch, token});
	
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  const headers = {
    Authorization: `token ${token}`,
  };

  if (!owner || !repo || !branch || !token) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    // Filter out ignored files and folders
    const filteredData = filterIgnoredFilesAndFolders(data);

    return filteredData;
  } catch (error: any) {
    throw new Error(`Error fetching GitHub repo tree: ${error.message}`);
  }
};

// Helper function to filter out ignored files and folders
const filterIgnoredFilesAndFolders = (data: any) => {
  if (!data || !data.tree || !Array.isArray(data.tree)) {
    return data;
  }

  const filteredTree = data.tree.filter((item: any) => {
    if (
      (item.type === 'blob' && IGNORED_FILES.includes(item.path)) ||
      (item.type === 'tree' && IGNORED_FOLDERS.includes(item.path))
    ) {
      return false; // Exclude ignored files and folders
    }
    return true; // Include all other files and folders
  });

  return {
    ...data,
    tree: filteredTree,
  };
};

export default getLofaf;
