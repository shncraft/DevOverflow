import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <h1 className="h1-bold">Welcome to world of NextJS</h1>
    </>
  );
}
