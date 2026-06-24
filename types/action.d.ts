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

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}
