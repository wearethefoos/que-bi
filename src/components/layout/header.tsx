import { auth } from "@/lib/auth";
import { SignOut } from "../auth/signout-button";
import { SignIn } from "../auth/signin-button";
import Link from "next/link";
import Image from "next/image";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="h-12 bg-blue-600 text-white fixed w-full">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg font-bold flex flex-row gap-2 items-center"
          >
            <Image src="/que-logo.svg" alt="logo" width={24} height={24} />
            ¿Que? - <span className="font-light text-sm">A simple BI tool</span>
          </Link>
        </div>
        <div className="flex items-center">
          {session ? <SignOut /> : <SignIn />}
        </div>
      </div>
    </header>
  );
};
