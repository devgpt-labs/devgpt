const getCode = async (owner, repo, path, access_token) => {
    // Define the GitHub API URL for getting repository contents
    const api_url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

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
            // Parse the JSON response to get the list of files
            const files = await response.json();
            console.log(files);
            // Extract and return the names of all files
            // return files.map((file) => file.name);
        } else {
            // Handle error response
            console.error(`Error: Unable to fetch files (HTTP ${response.status})`);
            return null;
        }
    } catch (error) {
        // Handle any network or connection errors
        console.error(`Error: ${error.message}`);
        return null;
    }
}

export default getCode;