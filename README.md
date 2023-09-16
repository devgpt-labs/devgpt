# DevGPT: We're building the world's best open-source dev agent.

## Table of Contents

1. [Introduction](#Introduction)
1. [Installation](#Installation)
1. [Features](#Features)
1. [How It Works](#How-It-Works)
1. [Key Outcomes](#Key-Outcomes)
1. [FAQs](#FAQs)
1. [Getting Started for Open-Source Contributors](#Getting-Started-for-Open-Source-Contributors)
1. [Support](#Support)

## Introduction

Welcome to **DevGPT**, the AI-driven development tool designed to transform the way you code. Created to assist developers in achieving their maximum potential, DevGPT is not just an auto-completion tool; it's your AI-powered dev-agent powered by gpt-4-32k and other models.

![DevGPT](Preview.png)

## Installation

Once you have the DevGPT release package, follow these straightforward installation steps:

1. **Run the correct installer for your operating system:** The installer will run and install DevGPT for you.

`MacOS: .dmg`

`Windows: .exe`

`Linux: .AppImage`

If you have any questions about installation, get in touch with our team via [Discord](https://discord.com/invite/6GFtwzuvtw)!

## Features

- **Code Generation**: Enter a prompt and get your required code generated.
- **One-Click Sync**: Directly sync generated code to your local code editor.
- **Personalized Training**: Our AI model trains on your code repository to generate code that perfectly fits into your codebase.
- **Follow-Up Prompts**: Need to modify generated code? Just enter follow-up prompts.

## How It Works

1. **Type Your Prompt**: Simply enter a prompt describing the code you need.
1. **Wait for Generation**: Our model takes an average of 40 seconds to generate your code.
1. **Sync to Local Editor**: With one click, sync the generated code to your local code editor.
1. **Optional Follow-Up Prompts**: If you wish to modify the generated code, you can enter follow-up prompts.

## Key Outcomes

- **Write Unit Tests**: Automatically generate unit tests for your codebase.
- **Write Complex Functions**: No need to fret over complex algorithms; let DevGPT handle them.
- **Create Components**: Create UI/UX components effortlessly.
- **Debug**: Troubleshoot issues in your code easily.

## FAQs

1. **Is this similar to Github Copilot?**
   - No, we are not an autocomplete tool. We handle entire tasks, acting as your co-developer.
1. **How much time will this save me?**
   - Our average user saves 1.5 hours every day, allowing you to focus on more complex and fulfilling tasks.
1. **Is ____ supported? (Flutter, Dart, Next, Python, Go, Rust, Svelte...)**
   - Our prompts are ran through gpt-4-32k, meaning anything that you are used to running in other AI's including ChatGPT will have a similar outcome here. 
   - In our benchmarking we've found success most languages, but we always recommend: Test on the free version, this will tell you how much of a grasp it may have in the paid version.
1. **How do I exclude Files / stop DevGPT from reading my node_modules**
   - We have now removed the functionality of users having to manually enter the files that they would like to be removed from the generation. 
   This is now entirely handled by us, and default / baggage files will not be used in the generation.
1. **How do I cancel my Plan / subscription?**
   - If you'd like to cancel your DevGPT plan, you can do this via your receipt that was sent to you when you subscribed. 
   - If you don't have this, or are unable to do this, you can send your email along with the request to cancel to support@devgpt.com, and your refund will be processed.
1. **What is the file limit of repos that can be used with DevGPT?**
   - There is no file limit, you are allowed to process any repo of any size.
1. **Why does my DevGPT take to long to install / download / load?**
   - This is something we have noticed in loading, and are working on reducing our package size to reduce overall download size and loading time.
   - In the meantime we do apologise for the slightly longer than usual load time. 
   - If you are waiting anywhere over 7-10 minutes however, you may want to consider a reload, or to look for more help in the [DevGPT discord](https://discord.com/invite/6GFtwzuvtw).
1. **Why are my prompts freeing, not running, crashing, not working?**
   - As of the version 1.1.1, you should now be able to receive a brief error message of why your prompt didn't work. However, these messages are often targeted to our Dev team, instead of being useful for you. I've compiled a list of reasons that I've found user's prompts are sometimes failing.
   - Issues:
     - You may be on a previous version of DevGPT. 
     Download the latest version from [our Website](https://www.devgpt.com/).
     - Your prompt may be too long (400+ characters)
     - Your context may be too long (150+ characters)
     - Your answers to the follow-up questions are too long (100+ characters)
     - Your repo is empty (this will be fixed in a future update)
     - Your prompt is asking a question. (e.g How does this work?)
     - Your prompt was providing code directly in the prompt (e.g Fix this code: const a + b)
   - Suggestions:
     - Rewrite your prompt to the following style (In X file, do this thing)
     - Download the newest version
     - Test on multiple repos instead of the same repo
     - Simplify your tech stack and context 
   - Example perfect prompts:
     - In <file_name>, make the "Example" button say "Something else". onClick the button should become disabled, change the text to 'Different text', and on response from the API change it back to 'Something else'
     - Write a unit test for <file_name>
     - Refactor <file_name> to make it easier for junior devs to understand and improve any syntax
     - Write unit tests for <name_of_a_folder_containing_not_too_many_files>
     - Create a new component called MyExample.jsx that stores a list of something and maps it to a list of something else
   - We'll add more fixes, example prompts and issues to this list as they are coming in.
1. **I have a new idea / want to report an issue**
   - You can do this at devgpt-releases [Github Issues](https://github.com/february-labs/devgpt-releases/issues).
   - It doesn't have to be an "issue" for you to report it here, it can be a suggestion, idea, or any feedback at all! :)
1. **How do I reset my password?**
   - In the app during sign in, we have a reset password function. This will open, you enter your email, that will send you a magic link that signs you in to our site
   - Here, you can reset your password and access additional support docs.
1. **I upgraded my account but it's not reflecting in the app**
   - If you have upgraded but on the sidebar in the app you still have an 'Upgrade' button, your app is not reflecting the upgrade correctly.
   - The app will instantly update on upgrade, but here are some steps you can follow / things you can check if this isn't happening:
     - Make sure you have a subscription to DevGPT. You can only upgrade via the app, you can't upgrade via the web or any other means. We have found some users have accidentally purchased WebKit (another company that sometimes uses the name DevGPT). This is not us.
     - You mistyped your email at some point and have signed up again with a different one, or are using a different one. The email that you put into the Stripe payment will not matter: only the email that your account is using. Do make sure that all of your emails are correct, and spelt correctly.
     - Try refreshing the app
     - Try to sign in, and sign out
   - If this hasn't fixed your issue and you have checked the above: please get directly in touch with one of our team and they will help you.
1. **I am getting the error: "Oops, something went wrong! Error 0008"**
   - This error is often caused by being on the incorrect version. 
   In version 1.1.1 we made it so people didn't have to immediately upgrade after a new version is released. 
   However, if you are in a version earlier than 1.1.1, you will have to upgrade versions.
   - It is always recommended to be on the newest version for the best experience. You can get new versions from [our Website](https://www.devgpt.com/).
1. **Why is my download taking so long?**
   - We are working on reducing our bundler size to reduce download time, but in the meantime our download size and time is quite long. 
   We will reduce this.
   - This is not helped by the fact we do not have a loading screen, but as long as you're running the latest version, you should have no issue loading the app / the app should always run, eventually. 
   On average it will be under or around 20 seconds.
   - If your download / load is taking far longer than this (10m+): Check your internet connection, check you have enough space available on your device. 
   If this doesn't help, you may want to get additional help via our team in Discord.
1. **How do I upgrade my DevGPT plan?**
   - You can upgrade your plan directly in the app of DevGPT, which will direct you to Stripe that will handle the payment.
   - Do not upgrade your account using any other method but this.

## Getting Started for Open-Source Contributors

1. Make sure you're using node v20.5.0, clone the project and npm install.
1. Create a new project on Supabase.com
1. Go to https://supabase.com/dashboard/project/{PROJECT_ID}/settings/api, copy the URL (it should be like: https://{PROJECT_ID}.supabase.co) and paste into "NEXT_PUBLIC_SUPABASE_URL" in your "renderer/EXAMPLE.env". Find the anon public key below and paste into "NEXT_PUBLIC_SUPABASE_ANON_KEY" in your "renderer/EXAMPLE.env". - Please rename this file to ".env".
1. Whilst in your new ".env" file, change the value of "NEXT_PUBLIC_OPENAI_API_KEY" to your OpenAI API key.
1. Go to https://supabase.com/dashboard/project/{PROJECT_ID}/sql/new and copy the SQL code from the file "supabase/SupabaseSetup.sql" into the text box and press RUN.
1. Run NPM install // Yarn install in the root directory of the project in your terminal.
1. Run NPM run dev // Yarn run dev in terminal.
1. Sign up to DevGPT in your local enviroment and see your account appear in your Supabase Table; you'll need to confirm your email address via email and this may require you to restart the app after confirmation.
1. Run the DevGPT-api repo (OSS on GitHub) to make prompts!

## Support

For any queries, issues, or support needs, feel free to contact us at support@devgpt.com
or on our [Discord](https://discord.com/invite/6GFtwzuvtw)

---

**Happy Coding!**

The DevGPT Team
