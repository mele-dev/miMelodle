export const typedEnv = process.env as Readonly<{
    NODE_ENV: "development" | "production";
}>;
