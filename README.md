# DevGPT: We're building the world's best open-source dev agent.

## Table of Contents

1. [Introduction](#Introduction)
1. [Features](#Features)
1. [How It Works](#How-It-Works)
1. [Key Outcomes](#Key-Outcomes)
1. [FAQs](#FAQs)
1. [Getting Started for Open-Source Contributors](#Getting-Started-for-Open-Source-Contributors)
1. [Support](#Support)

## Introduction

Welcome to **DevGPT**, the AI-driven development tool designed to transform the way you code. Created to assist developers in achieving their maximum potential, DevGPT is not just an auto-completion tool; it's your AI-powered dev-agent powered by gpt-4-32k and other models.

## Features

- **Code Generation**: Enter a prompt and get your required code generated.
- **Personalized Training**: Our AI model trains on your code repository to generate code that perfectly fits into your codebase.
- **Follow-Up Prompts**: Need to modify generated code? Just enter follow-up prompts.

## How It Works

1. **Type Your Prompt**: Simply enter a prompt describing the code you need.
1. **Wait for Generation**: Our model takes an average of 40 seconds to generate your code.
1. **Optional Follow-Up Prompts**: If you wish to modify the generated code, you can enter follow-up prompts.

## Key Outcomes

- **Write Unit Tests**: Automatically generate unit tests for your codebase.
- **Write Complex Functions**: No need to fret over complex algorithms; let DevGPT handle them.
- **Create Components**: Create UI/UX components effortlessly.
- **Debug**: Troubleshoot issues in your code easily.

## Bounty board (For OSS contributors)

| Task                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------- |
| Updating documentation                                                                                               |
| Add compatibility for Open-AI (repo currently only supports Azure, .env change only, no frontend changes)            |
| While page is loading it should show a spinner instead of the broken top-bar                                         |
| Shouldn’t need to re-train models on previously selected repos - save the conversation to local memory, e.g. cookies |
| Add option to re-train a model manually (calls setupContextMessages)                                                 |
| Bitbucket and GitLab integrations                                                                                    |
| Performance increase for local development (high load time and CPU  when running locally?)                           |

## FAQs

1. **Is this similar to Github Copilot?**
   - No, we are not an autocomplete tool. We handle entire tasks, acting as your co-developer.
1. **How much time will this save me?**
   - Our average user saves 1.5 hours every day, allowing you to focus on more complex and fulfilling tasks.

## Getting Started for Open-Source Contributors

For detailed instructions on how to set up the development environment and build DevGPT from source, please visit [our documentation](https://docs.devgpt.com/february-labs/open-source-setup).

## Support

For any queries, issues, or support needs, feel free to contact us at support@devgpt.com

---

**Happy Coding!**

The DevGPT Team
