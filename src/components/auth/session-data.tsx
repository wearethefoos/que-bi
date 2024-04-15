import type { Session } from "next-auth";

export default function SessionData({ session }: { session: Session | null }) {
  if (!process.env.IS_DEV) return null;

  if (session?.user) {
    return (
      <div className="flex flex-col gap-4 w-full p-12">
        <h2 className="text-xl font-bold">Current Session Data</h2>
        {Object.keys(session.user).length > 3 ? (
          <p>
            The whole session object is passed to the page, including the raw
            user object. Our recommendation is to{" "}
            <em>only pass the necessary fields</em> to the page, as the raw user
            object may contain sensitive information.
          </p>
        ) : (
          <p>
            Only some fields in the user object is passed to the page to avoid
            exposing sensitive information.
          </p>
        )}
        <div className="flex flex-col rounded-md bg-gray-100 dark:bg-gray-800">
          <div className="p-4 font-bold rounded-t-md bg-gray-200 dark:bg-gray-700">
            Session
          </div>
          <pre className="py-6 px-4 whitespace-pre-wrap break-all">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <p>
      No session data, please <em>Sign In</em> first.
    </p>
  );
}
