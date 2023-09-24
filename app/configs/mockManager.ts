
class MockConfigurationManager {
  private config: { [key: string]: string };

  constructor() {
    this.config = {
      MOCK_INTEGRATIONS: 'false',
    };
  }

  get(key: string): string | undefined {
    return this.config[key];
  }

  isMockIntegrationsEnabled(): boolean {
    return this.config.MOCK_INTEGRATIONS === 'true';
  }

  mockRepos() {
    return [
      {
        name: 'SampleRepo1',
        owner: { login: 'johnDoe' },
      },
      {
        name: 'SampleRepo2',
        owner: { login: 'johnDoe' },
      },
    ];
  }

  mockData() {
    return {
      repoWindowOpen: false,
      session: {
        user: {
          id: "mockUserId",
          email: "mockEmail@example.com",
        },
      },
      user: {
        id: "mockUserId",
        email: "mockEmail@example.com",
        identities: [
          { id: "mock", provider: "mock", identity_data: { name: "Mock User", email: "mockEmail@example.com" } },
        ],
      },
      isPro: true,
      repo: {
        owner: "",
        repo: "",
      },
      lofaf: ["mockLofaf1", "mockLofaf2"],
      techStack: ["mockTech1", "mockTech2"],
      context: "mockContext",
      branch: "mockBranch",
      messages: [],
    };
  }
}

const mockManager = new MockConfigurationManager();

export { mockManager };
