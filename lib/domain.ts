export const domain =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://polli-coder.megavault.in"
    : process.env.VERCEL_BRANCH_URL
      ? `https://${process.env.VERCEL_BRANCH_URL}`
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NEXT_PUBLIC_DEVELOPMENT_URL
          ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
          : "http://localhost:3000";
