interface OAuthSignInParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: OAuthSignInUserParams;
}

interface OAuthSignInUserParams {
  email: string;
  name: string;
  image: string;
  username: string;
}
