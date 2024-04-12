import { signOut } from "@/lib/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="px-4 py-2 bg-blue-800 text-white rounded-md"
        type="submit"
      >
        Sign Out
      </button>
    </form>
  );
}
