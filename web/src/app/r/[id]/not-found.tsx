import Link from "next/link";

export default function ShareNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-4 text-center text-zinc-300">
      <p className="text-sm font-medium text-white">This report link is invalid or expired.</p>
      <p className="mt-2 max-w-md text-xs text-zinc-500">Public snapshots are only available when the backend is configured and the id matches a stored share.</p>
      <Link href="/audit" className="mt-6 text-sm text-violet-400 hover:text-violet-300">
        Run a new audit →
      </Link>
    </div>
  );
}
