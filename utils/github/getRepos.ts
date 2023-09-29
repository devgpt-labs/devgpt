export const getPaginatedRepos = async (
  access_token: string,
  before?: string | null,
  after?: string
) => {
  if (!access_token) {
    console.error("Error: No access token provided");
    return;
  }

  const graphql_api_url = "https://api.github.com/graphql";

  const headers = {
    Authorization: `Bearer ${access_token}`,
    "Content-Type": "application/json",
  };

  const query = `
      query GetPaginatedRepos($before: String, $after: String) {
        viewer {
          repositories(first: 50, orderBy: { field: NAME, direction: ASC }, before: $before, after: $after) {
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
              repositories(first: 50, orderBy: { field: NAME, direction: ASC }, before: $before, after: $after) {
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
    const response = await fetch(graphql_api_url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: {
          before,
          after,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API responded with ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (
      !data.viewer ||
      !data.viewer.repositories ||
      !data.viewer.organizations
    ) {
      throw new Error("Unexpected response format from the GitHub API.");
    }

    const userRepos = data.viewer.repositories.nodes;
    const orgRepos = data.viewer.organizations.nodes.flatMap(
      (org: any) => org.repositories.nodes
    );

    const allRepos = [...userRepos, ...orgRepos];

    return {
      nodes: allRepos,
      pageInfo: data.viewer.repositories.pageInfo,
      totalCount: data.viewer.repositories.totalCount,
    };
  } catch (error) {
    console.error(error);
    return {
      nodes: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0,
    };
  }
};
