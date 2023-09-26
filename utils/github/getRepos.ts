export const getPaginatedRepos = async (
  access_token: string,
  before?: string | null,
  after?: string
) => {
  if (!access_token) return console.error("Error: No access token provided");

  // Define the GitHub API GraphQL URL for user repositories
  const graphql_api_url = "https://api.github.com/graphql";

  // Set up headers with the access token for authentication
  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  // Set up GraphQL query with a max of 30 items per page
  const query = `query {
    viewer {
      repositories(first: 30, orderBy: {field: NAME, direction: ASC} ${
        before ? `,before: "${before}"` : ""
      }${after ? `,after: "${after}"` : ""}) {
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
    const repositories: {
      data: {
        viewer: {
          repositories: {
            nodes: { name: string; owner: { login: string } }[];
            pageInfo: {
              hasNextPage: boolean;
              hasPreviousPage: boolean;
              startCursor: string;
              endCursor: string;
            };
            totalCount: number;
          };
        };
      };
    } = await response.json();
    return repositories.data.viewer.repositories;
  } catch (error) {
    console.error(error);
  }
};
