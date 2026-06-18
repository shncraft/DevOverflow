import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { AppLogo } from "./app-logo";
import { Button } from "@/components/ui/button";
import NavLinks from "./nav-links";

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          alt="Menu"
          className="inverted-colors sm:hidden"
          height={36}
          width={36}
        />
      </SheetTrigger>
      <SheetContent
        className="background-light900_dark200 border-none px-6"
        side="left"
      >
        <SheetHeader>
          <SheetTitle className="hidden">Navigation</SheetTitle>
          <AppLogo />
        </SheetHeader>

        <div className="no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <SheetClose asChild>
            <section className="flex h-full flex-col gap-6 pt-16">
              <NavLinks isMobileNav />
            </section>
          </SheetClose>

          <div className="flex flex-col gap-3">
            <SheetClose asChild>
              <Link href={ROUTES.SIGN_IN}>
                <Button className="small-medium btn-secondary min-h-10.25 w-full rounded-lg px-4 py-3 shadow-none">
                  <span className="primary-text-gradient">Log In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href={ROUTES.SIGN_UP}>
                <Button className="small-medium light-border btn-tertiary min-h-10.25 w-full rounded-lg border px-4 py-3 shadow-none text-dark400_light900">
                  <span className="primary-text-gradient">Sign Up</span>
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
