class MockConfigurationManager {
  private config: { [key: string]: string };

  constructor() {
    this.config = {
      MOCK_INTEGRATIONS: "false",
    };
  }

  get(key: string): string | undefined {
    return this.config[key];
  }

  isMockIntegrationsEnabled(): boolean {
    return this.config.MOCK_INTEGRATIONS === "true";
  }

  mockRepos() {
    return [
      {
        name: "SampleRepo1",
        owner: { login: "johnDoe" },
      },
      {
        name: "SampleRepo2",
        owner: { login: "johnDoe" },
      },
    ];
  }

  mockData() {
    return {
      repoWindowOpen: false,
      session: {
        user: {
          id: "",
          email: "mockEmail@example.com",
          app_metadata: {}, // Empty mock object for UserAppMetadata
          user_metadata: {}, // Empty mock object for UserMetadata
          aud: "mockAud",
          created_at: new Date().toISOString(),
          confirmation_sent_at: new Date().toISOString(),
          recovery_sent_at: new Date().toISOString(),
          email_change_sent_at: new Date().toISOString(),
          new_email: "newMockEmail@example.com",
          new_phone: "1234567890",
          invited_at: new Date().toISOString(),
          action_link: "http://mocklink.com",
          phone: "1234567890",
          confirmed_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString(),
          phone_confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: "mockRole",
          updated_at: new Date().toISOString(),
          identities: [
            {
              id: "mock",
              provider: "mock",
              identity_data: {
                name: "Mock User",
                email: "mockEmail@example.com",
              },
            },
          ],
          factors: [],
        },
      },
      user: {
        id: "mockUserId",
        email: "mockEmail@example.com",
        app_metadata: {}, // Empty mock object for UserAppMetadata
        user_metadata: {}, // Empty mock object for UserMetadata
        aud: "mockAud",
        created_at: new Date().toISOString(),
        // Other optional properties from the User interface can be added here too
        identities: [
          {
            id: "mock",
            provider: "mock",
            identity_data: {
              name: "Mock User",
              email: "mockEmail@example.com",
            },
          },
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
