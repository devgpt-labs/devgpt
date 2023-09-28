export const getPaginatedRepos = async (
  access_token: string,
  before?: string | null,
  after?: string
) => {
  if (!access_token) return console.error("Error: No access token provided");

  // Define the GitHub API GraphQL URL
  const graphql_api_url = "https://api.github.com/graphql";

  // Set up headers with the access token for authentication
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  // Set up GraphQL query to fetch both user and organization repositories
  const query = `query {
    viewer {
      repositories(first: 30, orderBy: { field: NAME, direction: ASC } ${
        before ? `, before: "${before}"` : ""
      }${after ? `, after: "${after}"` : ""}) {
        nodes {
          name
          owner {
            login
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalCount
      }
      organizations(first: 10) {
        nodes {
          repositories(first: 30, orderBy: { field: NAME, direction: ASC } ${
            before ? `, before: "${before}"` : ""
          }${after ? `, after: "${after}"` : ""}) {
            nodes {
              name
              owner {
                login
              }
            }
          }
        }
      }
    }
  }
  `;

  try {
    // Make a GET request to the GitHub API
    const response = await fetch(graphql_api_url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
    });

    // Parse the JSON response to get the list of repositories
    const data = await response.json();
    const userRepos = data.viewer.repositories.nodes;
    const orgRepos = data.viewer.organizations.nodes.flatMap(
      (org: any) => org.repositories.nodes
    );

    // Combine user and organization repositories into a single array
    const allRepos = [...userRepos, ...orgRepos];

    return {
      nodes: allRepos,
      pageInfo: data.viewer.repositories.pageInfo,
      totalCount: data.viewer.repositories.totalCount,
    };
  } catch (error) {
    console.error(error);
  }
};
