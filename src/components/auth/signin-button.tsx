import { signIn } from "@/lib/auth";

type Props = {
  redirectTo?: string;
};

export function SignIn({ redirectTo }: Props) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo });
      }}
    >
      <button
        className="px-4 py-2 bg-blue-800 text-white rounded-md"
        type="submit"
      >
        Sign in
      </button>
    </form>
  );
}
