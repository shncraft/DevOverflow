import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <h1 className="h1-bold">Welcome to world of NextJS</h1>

      {session && (
        <form
          className="px-10 pt-25"
          action={async () => {
            "use server";
            await signOut({ redirectTo: ROUTES.SIGN_IN });
          }}
        >
          <Button variant="destructive" type="submit">
            Log out
          </Button>
        </form>
      )}
    </>
  );
}
