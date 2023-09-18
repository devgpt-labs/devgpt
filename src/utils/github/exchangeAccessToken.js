const exchangeAccessToken = async (code) => {
    const GITHUB_CLIENT_ID = process?.env?.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process?.env?.GITHUB_CLIENT_SECRET;
    const api_url = "https://github.com/login/oauth/access_token";

    const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        mode: 'no-cors',
    };

    try {
        const response = await fetch(api_url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: code,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log({ data });
            const githubAccessToken = data.access_token;
            return { githubAccessToken };
        } else {
            throw new Error("Failed to exchange access_token for GitHub token");
        }
    } catch (error) {
        // Handle any network or connection errors
        console.error(`Error: ${error.message}`);
        return null;
    }
};

export default exchangeAccessToken;
