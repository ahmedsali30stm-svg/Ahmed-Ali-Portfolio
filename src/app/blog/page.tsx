import { getAllPosts } from "@/lib/blog";
import Link from "next/link";

export const metadata = {
  title: "Blog | Ahmed Ali",
  description: "Thoughts on AI, travel technology, and building autonomous systems.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen bg-[#050508] text-white px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-light tracking-wider text-white/90 mb-2">
          Blog
        </h1>
        <p className="text-sm text-white/40 mb-12">
          Thoughts on AI, travel technology, and building autonomous systems.
        </p>

        {posts.length === 0 ? (
          <p className="text-white/30">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block group p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-gold/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <time className="text-xs text-white/30 font-mono">
                    {post.date}
                  </time>
                  <span className="text-xs text-white/20">·</span>
                  <span className="text-xs text-white/30">
                    {post.readingTime}
                  </span>
                </div>
                <h2 className="text-lg font-medium text-white/80 group-hover:text-gold transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-white/40 line-clamp-2">
                  {post.description}
                </p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
