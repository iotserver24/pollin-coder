# Pollin Coder

![Pollin Coder Logo](./public/og-image.png)

<h1 align="center">Pollin Coder by R3AP3R editz</h1>

<p align="center">
  Pollin Coder is an open-source AI code generator that lets you create small apps with a single prompt. Powered by advanced AI models and the Pollinations.ai platform, it offers a seamless experience for developers and creators.
</p>

## Features

- Generate full-stack apps or code snippets from a single prompt
- Uses state-of-the-art models for code and text generation
- Live code sandbox powered by Sandpack
- Built with Next.js, Tailwind CSS, and modern web tech
- Analytics and observability ready (Plausible, Helicone)

## Tech Stack

- [Pollinations AI](https://pollinations.ai/) for LLM inference
- [Sandpack](https://sandpack.codesandbox.io/) for the code sandbox
- Next.js app router with Tailwind
- Helicone for observability (optional)
- Plausible for website analytics

## Getting Started

1. Clone the repo: `git clone https://github.com/iotserver24/pollin-coder`
2. Copy `.example.env` to `.env.local` and configure your environment variables:
   ```bash
   cp .example.env .env.local
   ```
3. Run `npm install` and `npm run dev` to install dependencies and start the app locally

## Environment Variables

The application uses the following environment variables:

- `POLLINATIONS_AI_TOKEN` (optional): Your Pollinations AI token for authentication. If not provided, the app will work without authentication but may have rate limits.
- `HELICONE_API_KEY` (optional): API key for Helicone observability
- `DATABASE_URL`: Database connection string (required for production)

### Pollinations AI Authentication

To use Pollinations AI with authentication:

1. Get your token from [Pollinations AI](https://pollinations.ai/)
2. Add it to your `.env.local` file:
   ```
   POLLINATIONS_AI_TOKEN=your_token_here
   ```

The app will automatically use the token for all API calls to Pollinations AI, providing:
- Higher rate limits
- Better reliability
- Access to premium features

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

© 2025 R3AP3R editz. All rights reserved.
