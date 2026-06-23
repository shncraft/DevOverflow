import Theme from "./theme";
import { MobileNavigation } from "./mobile-navigation";
import { AppLogo } from "./app-logo";
import { auth } from "@/auth";
import { UserAvatar } from "@/components/user-avatar";

const Navbar = async () => {
  const session = await auth();
  return (
    <div className="flex-between background-light900_dark200 fixed z-50 w-full gap-5 p-6 dark:shadow-none sm:px-12 ">
      <AppLogo TextClassName="max-sm:hidden" />

      <p>global Search</p>

      <div className="flex-between gap-5">
        <Theme />

        {session?.user && (
          <UserAvatar
            id={session.user.id!}
            name={session.user.name!}
            image={session.user.image}
          />
        )}

        <MobileNavigation />
      </div>
    </div>
  );
};

export default Navbar;
