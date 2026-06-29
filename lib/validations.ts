import z from "zod/v4";

export const signInSchema = z.object({
  email: z.email("Please provide a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password cannot exceed 100 characters."),
});

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username cannot exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),

  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name cannot exceed 50 characters.")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z.email("Please provide a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password cannot exceed 100 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least on lowercase letter.")
    .regex(/[0-9]/, "Password must contain at lead on number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character.",
    ),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, "Title is required.")
    .max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(1, "Content is required."),
  tags: z
    .array(
      z
        .string()
        .min(3, "Tag is required.")
        .max(30, "Tag cannot exceed 30 characters."),
    )
    .min(1, "At least on tag is required.")
    .max(3, "Cannot add more than 3 tags."),
});

export const UserSchema = z.object({
  name: z.string().min(3, "Name is required."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(15, "Username must not exceed 15 characters."),
  email: z.email("Please provide a valid email address."),
  bio: z.string().optional(),
  image: z.url("Please provide a valid image url").optional(),
  location: z.string().optional(),
  portfolio: z.url("Please provide a valid portfolio url").optional(),
  reputation: z.number().optional(),
});

export const AccountSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(3, "Name is required"),
  image: z.url("Please provide a valid image URL").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(100, "Password cannot exceed 100 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least on lowercase letter.")
    .regex(/[0-9]/, "Password must contain at lead on number.")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character.",
    )
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider Account ID is required."),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z.string().min(1, "Provider Account ID is required."),
  user: z.object({
    name: z.string().min(3, "Name is required."),
    username: z.string().min(3, "Username must be at least 3 characters long."),
    email: z.email("Please provide a valid email address."),
    image: z.url("Please provide a valid image URL.").optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, "Question ID is required."),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required."),
});

export const PaginatedSearchParamSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchParamSchema.extend({
  tagId: z.string().min(1, "Tag ID is required."),
});

export const IncrementViewsSchema = PaginatedSearchParamSchema.extend({
  questionId: z.string().min(1, "Question ID is required."),
});

export const AnswerSchema = z.object({
  content: z.string().min(100, "Answer has to have more than 100 characters."),
});

export const CreateAnswerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, "Question ID is required."),
});

export const GetAnswersSchema = PaginatedSearchParamSchema.extend({
  questionId: z.string().min(1, "Question ID is required."),
});

export const AIAnswerSchema = z.object({
  question: z
    .string()
    .min(5, "Question is required.")
    .max(120, "Question cannot exceed 130 characters."),
  content: z.string().min(100, "Answer has to have more than 100 characters."),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, "Target ID is required."),
  targetType: z.enum(["question", "answer"], "Invalid Target Type"),
  voteType: z.enum(["upvote", "downvote"], "Invalid Vote Type."),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.union([z.literal(-1), z.literal(1)]),
});
