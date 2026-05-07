import { auth } from "@/auth";
import { getPostsByUser } from "@/lib/db/posts";
import { PostCard } from "./_components/post-card";

export default async function WatchFeedPage() {
  const session = await auth();

  if (!session?.user?.id) return null;
  
  const posts = await getPostsByUser(session.user.id);

  return (
    <main className="min-h-screen py-8 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col border-b border-slate-200 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight italic">Watch Feed</h1>
          <p className="text-slate-500 text-sm">Real-time intelligence from active executive trackers.</p>
        </header>
        
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-xl border border-slate-200 text-slate-400 italic">
              No intelligence data available.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}