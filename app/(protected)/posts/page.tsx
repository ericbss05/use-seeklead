// app/dashboard/posts/page.tsx
import { auth } from "@/auth";
import { getScrapedPostsList } from "@/lib/get-posts-tracked";
import { PostList } from "@/components/post-list";

export default async function PostsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  // Récupération des données via ta lib Prisma
  const posts = await getScrapedPostsList(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Posts surveillés</h1>
        <p className="text-zinc-500">
          Retrouvez les dernières publications et leurs performances.
        </p>
      </div>

      <PostList initialPosts={posts} />
    </div>
  );
}